import crypto from 'crypto';
import pool from '../config/db.js';
import { validationResult } from 'express-validator';
import { sendEmail } from '../utils/email.js';

export const createUserByCoAdmin = async (req, res, next) => {
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
    // 2. Make sure authenticated user exists
    // ---------------------------------------
    const coAdminId = req.user?.id;

    if (!coAdminId) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    // ---------------------------------------
    // 3. Get new user's data
    // ---------------------------------------
    const { name, email } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // ---------------------------------------
    // 4. Check duplicate email
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
    // 5. Generate invitation token
    // ---------------------------------------
    const invitationToken = crypto.randomBytes(32).toString('hex');

    // Store only token hash in database
    const invitationTokenHash = crypto
      .createHash('sha256')
      .update(invitationToken)
      .digest('hex');

    // Token expires after 24 hours
    const invitationExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    // ---------------------------------------
    // 6. Create user
    //
    // IMPORTANT:
    // co_admin_id comes from req.user.id
    // NOT from req.body
    // ---------------------------------------
    const result = await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password_hash,
        role,
        is_active,
        co_admin_id,
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
        $5,
        CURRENT_TIMESTAMP
      )
      RETURNING
        id,
        name,
        email,
        role,
        co_admin_id,
        is_active,
        invited_at
      `,
      [
        name.trim(),
        normalizedEmail,
        coAdminId,
        invitationTokenHash,
        invitationExpiresAt
      ]
    );

    const user = result.rows[0];

    // ---------------------------------------
    // 7. Create invitation URL
    // ---------------------------------------
    const frontendUrl =
      process.env.FRONTEND_URL || 'http://localhost:3000';

    const invitationUrl =
      `${frontendUrl}/activate-account?token=${invitationToken}`;

    // ---------------------------------------
    // 8. Send invitation email
    // ---------------------------------------
    try {
      await sendEmail(
        user.email,
        'Activate your Syncaura account',
        `
          <h2>Welcome to Syncaura</h2>

          <p>Hello ${user.name},</p>

          <p>
            A co-admin has created a Syncaura account for you.
          </p>

          <p>
            Click the button below to activate your account
            and create your own password.
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
        'Co-admin user invitation email failed:',
        emailError.message
      );

      return res.status(201).json({
        message:
          'User created, but invitation email could not be sent',
        user,
        invitationEmailSent: false
      });
    }

    // ---------------------------------------
    // 9. Return response
    // ---------------------------------------
    return res.status(201).json({
      message: 'User created and invitation sent successfully',
      user,
      invitationEmailSent: true
    });

  } catch (err) {
    console.error('Co-admin create user error:', err);
    next(err);
  }
}; 


export const getAssignedUsers = async (req, res, next) => {
  try {
    const coAdminId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        co_admin_id,
        is_active,
        created_at,
        updated_at
      FROM users
      WHERE co_admin_id = $1
        AND role = 'user'
      ORDER BY created_at DESC
      `,
      [coAdminId]
    );

    return res.status(200).json({
      users: result.rows
    });

  } catch (err) {
    console.error('Get assigned users error:', err);
    next(err);
  }
};


export const getAssignedUser = async (req, res, next) => {
  try {
    // requireAssignedUser has already verified:
    // 1. user is authenticated
    // 2. user is a co-admin
    // 3. target is a normal user
    // 4. target belongs to this co-admin

    return res.status(200).json({
      user: req.assignedUser
    });

  } catch (err) {
    console.error('Get assigned user error:', err);
    next(err);
  }
};