import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import pool from '../config/db.js';

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainPassword, salt);
};

export const activateAccount = async (req, res, next) => {
  try {
    // ---------------------------------------
    // 1. Validate request
    // ---------------------------------------
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { token, password } = req.body;

    // ---------------------------------------
    // 2. Hash token
    // ---------------------------------------
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // ---------------------------------------
    // 3. Find invited user
    // ---------------------------------------
    const result = await pool.query(
      `
      SELECT id, name, email, role, is_active,
             invitation_token_expires_at
      FROM users
      WHERE invitation_token_hash = $1
      `,
      [tokenHash]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        message: 'Invalid invitation token'
      });
    }

    const user = result.rows[0];

    // ---------------------------------------
    // 4. Check expiration
    // ---------------------------------------
    if (
      !user.invitation_token_expires_at ||
      new Date(user.invitation_token_expires_at) < new Date()
    ) {
      return res.status(400).json({
        message: 'Invitation token expired'
      });
    }

    // ---------------------------------------
    // 5. Check if already active
    // ---------------------------------------
    if (user.is_active) {
      return res.status(400).json({
        message: 'Account is already active'
      });
    }

    // ---------------------------------------
    // 6. Hash new password
    // ---------------------------------------
    const passwordHash = await hashPassword(password);

    // ---------------------------------------
    // 7. Activate account
    //
    // Token is cleared after successful use.
    // ---------------------------------------
    await pool.query(
      `
      UPDATE users
      SET
        password_hash = $1,
        is_active = true,
        invitation_token_hash = NULL,
        invitation_token_expires_at = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [passwordHash, user.id]
    );

    return res.status(200).json({
      message: 'Account activated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Activate account error:', err);
    next(err);
  }
};