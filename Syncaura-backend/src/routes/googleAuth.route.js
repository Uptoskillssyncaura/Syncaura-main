import express from "express";
import { google } from "googleapis";
import { auth } from "../middlewares/auth.js";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, assignRefreshId } from "../utils/generateTokens.js";

const router = express.Router();

const getOAuth2Client = () => {
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:5000/auth/callback";

  console.log("Creating OAuth2Client with redirectUri:", redirectUri);

  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
};

router.get("/google", auth, async (req, res) => {
  try {
    const oauth2Client = getOAuth2Client();
    const state = jwt.sign(
      { id: req.user.id },
      process.env.JWT_ACCESS_SECRET || "default_jwt_secret",
      { expiresIn: "10m" }
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
      state,
    });

    console.log("Generated Google Auth URL:", authUrl);
    return res.redirect(authUrl);
  } catch (error) {
    console.error("Google OAuth Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start Google OAuth",
    });
  }
});

// Step 1: Generate Google auth URL
router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    console.log("=== Google OAuth Callback Triggered ===");
    console.log("Query parameters:", { code: !!code, state: !!state });

    if (!code) {
      console.error("OAuth Error: Authorization code missing");
      return res.status(400).json({
        success: false,
        message: "Authorization code missing",
      });
    }

    if (!state) {
      console.error("OAuth Error: State token missing");
      return res.status(400).json({
        success: false,
        message: "State token missing",
      });
    }

    let decoded;
    let isLoginFlow = false;

    if (state === "login") {
      isLoginFlow = true;
    } else {
      try {
        decoded = jwt.verify(state, process.env.JWT_ACCESS_SECRET || "default_jwt_secret");
        console.log("State token verified successfully. User ID:", decoded.sub || decoded.id);
      } catch (err) {
        console.error("JWT Verification failed for state parameter:", err.message);
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        return res.redirect(`${clientUrl}/signin?error=${encodeURIComponent("State token verification failed")}`);
      }
    }

    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (isLoginFlow) {
      // Get user info from Google API
      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
      const { data: userInfo } = await oauth2.userinfo.get();

      if (!userInfo.email) {
        throw new Error("Google account does not have a valid email address");
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
      return res.redirect(`${clientUrl}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}&role=${user.role}&name=${encodeURIComponent(user.name)}`);
    } else {
      const targetUserId = decoded.sub || decoded.id;
      console.log("Updating database user tokens for user ID:", targetUserId);

      const dbResult = await pool.query(
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
          targetUserId,
        ]
      );

      console.log("Database update complete. Rows affected:", dbResult.rowCount);

      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      return res.redirect(`${clientUrl}/meetings?google_connected=true`);
    }
  } catch (error) {
    console.error("OAuth callback error:", error);

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const redirectPath = req.query.state === "login" ? "signin" : "meetings";
    return res.redirect(`${clientUrl}/${redirectPath}?error=${encodeURIComponent(error.message || "Google OAuth failed")}`);
  }
});

// Step 2: Callback after Google OAuth approval
// router.get("/google/callback", async (req, res) => {
//   try {
//     const { code, state } = req.query;
//     if (!code || !state) return res.status(400).json({ message: "Authorization code missing" });

//     const decoded = jwt.verify(state, process.env.JWT_ACCESS_SECRET);

//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     // Update user with tokens
//     await pool.query(
//       `UPDATE users SET 
//         google_access_token = $1, 
//         google_refresh_token = $2, 
//         google_scope = $3, 
//         google_token_type = $4, 
//         google_expiry_date = $5,
//         updated_at = CURRENT_TIMESTAMP 
//       WHERE id = $6`,
//       [
//         tokens.access_token,
//         tokens.refresh_token,
//         tokens.scope,
//         tokens.token_type,
//         tokens.expiry_date,
//         decoded.sub || decoded.id
//       ]
//     );

//     res.status(200).json({
//       success: true,
//       message: "Google connected successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Google OAuth failed" });
//   }
// });

export default router;
