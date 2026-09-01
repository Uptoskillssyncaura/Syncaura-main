import crypto from 'crypto';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { sendEmail } from '../utils/email.js';

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainPassword, salt);
};

/**
 * Admin creates a Co-admin
 *
 * POST /admin/co-admins
 */
export const createCoAdmin = async (req, res, next) => {
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

    // ---------------------------------------
    // 2. Get data from request
    // ---------------------------------------
    const { name, email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // ---------------------------------------
    // 3. Check whether email already exists
    // ---------------------------------------
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (existingUser.rowCount > 0) {
      return res.status(409).json({
        message: 'Email already registered'
      });
    }

    // ---------------------------------------
    // 4. Hash password
    // ---------------------------------------
    const passwordHash = await hashPassword(password);

    // ---------------------------------------
    // 5. Create Co-admin
    //
    // IMPORTANT:
    // role is NOT taken from req.body.
    // It is always forced to co-admin.
    // ---------------------------------------
    const result = await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash,
        role
      )
      VALUES ($1, $2, $3, 'co-admin')
      RETURNING
        id,
        name,
        email,
        role,
        is_active,
        created_at
      `,
      [
        name.trim(),
        normalizedEmail,
        passwordHash
      ]
    );

    const coAdmin = result.rows[0];

    // ---------------------------------------
    // 6. Return created Co-admin
    // ---------------------------------------
    return res.status(201).json({
      message: 'Co-admin created successfully',
      coAdmin
    });

  } catch (err) {
    console.error('Create Co-admin error:', err);
    next(err);
  }
};

export const createUser = async (req, res, next) => {
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

    // ---------------------------------------
    // 2. Get user details
    // ---------------------------------------
    const { name, email } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // ---------------------------------------
    // 3. Check duplicate email
    // ---------------------------------------
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (existingUser.rowCount > 0) {
      return res.status(409).json({
        message: 'Email already registered'
      });
    }

    // ---------------------------------------
    // 4. Generate secure invitation token
    // ---------------------------------------
    const invitationToken = crypto.randomBytes(32).toString('hex');

    // Store only the hash in DB
    const invitationTokenHash = crypto
      .createHash('sha256')
      .update(invitationToken)
      .digest('hex');

    // Token valid for 24 hours
    const invitationExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    // ---------------------------------------
    // 5. Create user
    //
    // No password is created here.
    // User will choose their own password.
    // ---------------------------------------
    const result = await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash,
        role,
        is_active,
        invitation_token_hash,
        invitation_token_expires_at,
        invited_at
      )
      VALUES (
        $1,
        $2,
        NULL,
        'user',
        false,
        $3,
        $4,
        CURRENT_TIMESTAMP
      )
      RETURNING
        id,
        name,
        email,
        role,
        is_active,
        invited_at
      `,
      [
        name.trim(),
        normalizedEmail,
        invitationTokenHash,
        invitationExpiresAt
      ]
    );

    const user = result.rows[0];

    // ---------------------------------------
    // 6. Create invitation URL
    // ---------------------------------------
    const frontendUrl =
      process.env.FRONTEND_URL || 'http://localhost:3000';

    const invitationUrl =
      `${frontendUrl}/activate-account?token=${invitationToken}`;

    // ---------------------------------------
    // 7. Send invitation email
    // ---------------------------------------
    try {
      await sendEmail(
        user.email,
        'Activate your Syncaura account',
        `
          <h2>Welcome to Syncaura</h2>

          <p>Hello ${user.name},</p>

          <p>
            An administrator has created a Syncaura account for you.
          </p>

          <p>
            Click the button below to activate your account and
            create your password.
          </p>

          <p>
            <a
              href="${invitationUrl}"
              style="
                display:inline-block;
                padding:12px 20px;
                background:#2563eb;
                color:white;
                text-decoration:none;
                border-radius:6px;
              "
            >
              Activate Account
            </a>
          </p>

          <p>
            This invitation will expire in 24 hours.
          </p>

          <p>
            If you did not expect this invitation, you can ignore this email.
          </p>
        `
      );
    } catch (emailError) {
      console.error(
        'User invitation email failed:',
        emailError.message
      );

      // User was created, but invitation could not be sent.
      return res.status(201).json({
        message:
          'User created, but invitation email could not be sent',
        user,
        invitationEmailSent: false
      });
    }

    // ---------------------------------------
    // 8. Return response
    // ---------------------------------------
    return res.status(201).json({
      message: 'User created and invitation sent successfully',
      user,
      invitationEmailSent: true
    });

  } catch (err) {
    console.error('Create User error:', err);
    next(err);
  }
};


// Admin assigns or removes a Co-admin from a user
export const assignCoAdminToUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { co_admin_id } = req.body;

    // ------------------------------------------------
    // 1. Check target user exists
    // ------------------------------------------------
    const userResult = await pool.query(
      `
      SELECT id, name, email, role, co_admin_id
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // ------------------------------------------------
    // 2. Only normal users can be assigned
    // ------------------------------------------------
    if (user.role !== 'user') {
      return res.status(400).json({
        message: 'Only normal users can be assigned to a co-admin'
      });
    }

    // ------------------------------------------------
    // 3. NULL means remove current co-admin
    // ------------------------------------------------
    if (co_admin_id === null) {
      const result = await pool.query(
        `
        UPDATE users
        SET
          co_admin_id = NULL,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING
          id,
          name,
          email,
          role,
          co_admin_id,
          updated_at
        `,
        [userId]
      );

      return res.status(200).json({
        message: 'Co-admin removed successfully',
        user: result.rows[0]
      });
    }

    // ------------------------------------------------
    // 4. Check selected co-admin exists
    // ------------------------------------------------
    const coAdminResult = await pool.query(
      `
      SELECT id, name, email, role
      FROM users
      WHERE id = $1
      `,
      [co_admin_id]
    );

    if (coAdminResult.rowCount === 0) {
      return res.status(404).json({
        message: 'Co-admin not found'
      });
    }

    const coAdmin = coAdminResult.rows[0];

    // ------------------------------------------------
    // 5. Verify selected account is actually co-admin
    // ------------------------------------------------
    if (coAdmin.role !== 'co-admin') {
      return res.status(400).json({
        message: 'Selected user is not a co-admin'
      });
    }

    // ------------------------------------------------
    // 6. Update relationship
    // ------------------------------------------------
    const result = await pool.query(
      `
      UPDATE users
      SET
        co_admin_id = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING
        id,
        name,
        email,
        role,
        co_admin_id,
        updated_at
      `,
      [co_admin_id, userId]
    );

    return res.status(200).json({
      message: 'Co-admin assigned successfully',
      user: result.rows[0]
    });

  } catch (err) {
    console.error('Assign Co-admin error:', err);
    next(err);
  }
};