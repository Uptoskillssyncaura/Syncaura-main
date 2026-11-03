import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, assignRefreshId } from '../utils/generateTokens.js';
import { sendEmail, sendResetEmail, sendPasswordOtpEmail, sendPasswordChangedEmail } from '../utils/email.js';
import { generateOtp } from '../utils/otp.js';
import ROLES from "../config/roles.js";

const handleValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation error');
    err.status = 422;
    err.details = errors.array();
    throw err;
  }
};

const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plain, salt);
};

export const register = async (req, res, next) => {
  try {
    handleValidation(req);
    const { name, email, password, role } = req.body;

    const existingRes = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existingRes.rowCount > 0) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await hashPassword(password);
    // Public registrations are always standard users for security
    const finalRole = ROLES.USER;

    const insertRes = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email.toLowerCase(), passwordHash, finalRole]
    );

    const user = insertRes.rows[0];

    const rid = assignRefreshId(user);
    await pool.query('UPDATE users SET refresh_token_id = $1 WHERE id = $2', [rid, user.id]);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, rid);

    // 🔥 SMTP ALERT TRIGGER

    try {
      await sendEmail(
        email,
        "Welcome to Syncaura 🎉",
        `<h2>Welcome ${name}</h2>`
      );
    } catch (err) {
      console.error("Welcome email failed:", err);
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      tokens: { accessToken, refreshToken }
    });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    handleValidation(req);
    const { email, password } = req.body;

    const userRes = await pool.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email.toLowerCase()]);
    if (userRes.rowCount === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = userRes.rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const rid = assignRefreshId(user);
    await pool.query('UPDATE users SET refresh_token_id = $1 WHERE id = $2', [rid, user.id]);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, rid);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      tokens: { accessToken, refreshToken }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Missing refreshToken' });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = payload.sub;
    const rid = payload.rid;

    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];

    if (!user || user.refresh_token_id !== rid) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user);
    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const userRes = await pool.query(
      `SELECT 
        id,
        name,
        email,
        role,
        first_name,
        last_name,
        phone,
        language,
        is_active,
        created_at,
        updated_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (userRes.rowCount === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const user = userRes.rows[0];

    res.status(200).json({
      user
    });

  } catch (err) {
    next(err);
  }
};

export const requestPasswordOtp = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await pool.query(
      'UPDATE users SET otp_code = $1, otp_expires_at = $2 WHERE id = $3',
      [otp, expiresAt, userId]
    );

    console.log(`Generated OTP for ${user.email}: ${otp}`);
    res.json({ message: 'OTP generated (printed in server console)' });

    // Assume sendPasswordOtpEmail exists globally or in email.js, though not imported originally.
    // If it fails, next(err) handles it.
    try {
      await sendPasswordOtpEmail({
        to: user.email,
        name: user.name,
        otp
      });
    } catch (err) {
      console.error("OTP email failed:", err.message);
    }
  } catch (err) { next(err); }
};

export const changePasswordWithOtp = async (req, res, next) => {
  try {
    handleValidation(req);
    const { otp, newPassword } = req.body;
    const userId = req.user?.id;

    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.otp_code || user.otp_code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (!user.otp_expires_at || new Date(user.otp_expires_at) < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    const passwordHash = await hashPassword(newPassword);

    await pool.query(
      'UPDATE users SET password_hash = $1, otp_code = NULL, otp_expires_at = NULL, refresh_token_id = NULL WHERE id = $2',
      [passwordHash, userId]
    );

    try {
      await sendPasswordChangedEmail({
        to: user.email,
        name: user.name
      });
    } catch (err) {
      console.error("Password changed email failed:", err.message);
    }

    res.json({ message: 'Password changed successfully' });
  } catch (err) { next(err); }
};

export const forgotPassword = async (req, res, next) => {
  try {
    handleValidation(req);
    const { email } = req.body;

    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = userRes.rows[0];
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent' });
    }

    const resetPayload = { sub: String(user.id) };
    const token = jwt.sign(
      resetPayload,
      process.env.RESET_TOKEN_SECRET,
      { expiresIn: `${process.env.RESET_TOKEN_EXPIRES_MIN || 15}m` }
    );

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + Number(process.env.RESET_TOKEN_EXPIRES_MIN) * 60_000);

    await pool.query(
      'UPDATE users SET reset_token_hash = $1, reset_token_expires_at = $2 WHERE id = $3',
      [tokenHash, expiresAt, user.id]
    );
    console.log(user.email);

    try {
      await sendResetEmail({
        to: user.email,
        name: user.name,
        token
      });

      console.log("Reset email sent");
    } catch (err) {
      console.error("Reset email failed:", err.message);
    }

    res.json({
      message: 'If that email exists, a reset link has been sent'
    });
  } catch (err) { next(err); }
};

export const resetPassword = async (req, res, next) => {
  try {
    handleValidation(req);
    const { token, newPassword } = req.body;


    const payload = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [payload.sub]);
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    if (!user.reset_token_hash || user.reset_token_hash !== tokenHash) {
      return res.status(400).json({ message: 'Invalid reset token' });
    }
    if (!user.reset_token_expires_at || new Date(user.reset_token_expires_at) < new Date()) {
      return res.status(400).json({ message: 'Reset token expired' });
    }

    const passwordHash = await hashPassword(newPassword);

    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token_hash = NULL, reset_token_expires_at = NULL, refresh_token_id = NULL WHERE id = $2',
      [passwordHash, user.id]
    );

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    handleValidation(req);
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(currentPassword, user.password_hash);
    if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });

    const passwordHash = await hashPassword(newPassword);
    await pool.query(
      'UPDATE users SET password_hash = $1, refresh_token_id = NULL WHERE id = $2',
      [passwordHash, userId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (err) { next(err); }
};


export const adminOnly = async (req, res) => {
  res.json({ message: 'Hello Admin!' });
};

//new changes,

export const logout = async (req, res) => {
  res.clearCookie("refreshToken");

  res.json({
    message: "Logged out successfully"
  });
};