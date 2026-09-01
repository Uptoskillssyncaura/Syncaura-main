import { google } from "googleapis";
import axios from "axios";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateAccessToken, generateRefreshToken, assignRefreshId } from "../utils/generateTokens.js";
import { getAccessToken as getGithubAccessToken } from "../services/githubAPI.js";

// Scopes for Google OAuth Login & Calendar
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/calendar",
];

// Instantiating local oauthClient for auth login/signup flow
const getOauth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/auth/google/callback"
  );
};

/**
 * Initiate Google login/signup redirect
 */
export const initiateGoogleLogin = async (req, res) => {
  try {
    const oauth2Client = getOauth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: GOOGLE_SCOPES,
      state: "login",
      prompt: "consent",
    });

    res.redirect(authUrl);
  } catch (error) {
    console.error("Google Login initiation error:", error);
    res.status(500).json({ message: "Failed to initiate Google Login" });
  }
};

/**
 * Handle Google callback, register or login user, generate tokens, and redirect to frontend
 */
export const handleGoogleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: "Google authorization code missing" });
    }

    const oauth2Client = getOauth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google API
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email) {
      return res.status(400).json({ message: "Google account does not have a valid email address" });
    }

    const email = userInfo.email.toLowerCase();

    // Check if user exists in database
    let userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    let user;

    if (userRes.rowCount > 0) {
      user = userRes.rows[0];
    } else {
      // User doesn't exist -> Create new user with a secure disabled password hash
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 12);
      const name = userInfo.name || "Google User";
      
      const insertRes = await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, email, dummyPassword, "user"]
      );
      user = insertRes.rows[0];
    }

    // Save Google OAuth tokens for calendar sync
    await pool.query(
      `UPDATE users SET 
        google_access_token = $1, 
        google_refresh_token = COALESCE($2, google_refresh_token), 
        google_scope = COALESCE($3, google_scope), 
        google_token_type = COALESCE($4, google_token_type), 
        google_expiry_date = COALESCE($5, google_expiry_date),
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = $6`,
      [
        tokens.access_token,
        tokens.refresh_token || null,
        tokens.scope || null,
        tokens.token_type || null,
        tokens.expiry_date || null,
        user.id,
      ]
    );

    // Generate JWT access & refresh tokens
    const rid = assignRefreshId(user);
    await pool.query("UPDATE users SET refresh_token_id = $1 WHERE id = $2", [rid, user.id]);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, rid);

    // Set refresh token cookie matching existing pattern
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect user back to frontend AuthCallback route
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientUrl}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}&role=${user.role}&name=${encodeURIComponent(user.name)}`);
  } catch (error) {
    console.error("Google OAuth login callback error:", error);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientUrl}/signin?error=${encodeURIComponent("Google OAuth Login failed: " + error.message)}`);
  }
};

/**
 * Helper to fetch user details from GitHub
 */
const getGithubUser = async (accessToken) => {
  const { data: profile } = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  let email = profile.email;
  if (!email) {
    const { data: emails } = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const primaryEmailObj = emails.find((e) => e.primary && e.verified) || emails[0];
    email = primaryEmailObj?.email;
  }

  return {
    email: email ? email.toLowerCase() : null,
    name: profile.name || profile.login || "GitHub User",
  };
};

/**
 * Handle GitHub callback, register or login user, and return JWT credentials as JSON
 */
export const handleGithubCallback = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "GitHub authorization code missing" });
    }

    // Exchange code for github access token using existing api helper
    const githubAccessToken = await getGithubAccessToken(code);
    const githubUser = await getGithubUser(githubAccessToken);

    if (!githubUser.email) {
      return res.status(400).json({ message: "Could not retrieve a valid email from your GitHub profile" });
    }

    // Check if user exists in database
    let userRes = await pool.query("SELECT * FROM users WHERE email = $1", [githubUser.email]);
    let user;

    if (userRes.rowCount > 0) {
      user = userRes.rows[0];
    } else {
      // User doesn't exist -> Create new user with a secure disabled password hash
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 12);
      const insertRes = await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [githubUser.name, githubUser.email, dummyPassword, "user"]
      );
      user = insertRes.rows[0];
    }

    // Generate JWT access & refresh tokens
    const rid = assignRefreshId(user);
    await pool.query("UPDATE users SET refresh_token_id = $1 WHERE id = $2", [rid, user.id]);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, rid);

    // Set refresh token cookie matching existing pattern
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("GitHub OAuth login callback error:", error);
    res.status(500).json({ message: "GitHub Login failed", error: error.message });
  }
};
