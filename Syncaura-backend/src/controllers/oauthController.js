import { google } from "googleapis";
import axios from "axios";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateAccessToken, generateRefreshToken, assignRefreshId } from "../utils/generateTokens.js";
import { getAccessToken as getGithubAccessToken } from "../services/githubAPI.js";

// Log credential presence at module load (not values — never log secrets)
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error("[OAuth] MISSING: GOOGLE_CLIENT_ID is not set in environment");
} else {
  console.log("[OAuth] GOOGLE_CLIENT_ID loaded, length:", process.env.GOOGLE_CLIENT_ID.length);
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.error("[OAuth] MISSING: GOOGLE_CLIENT_SECRET is not set in environment");
} else {
  console.log("[OAuth] GOOGLE_CLIENT_SECRET loaded, length:", process.env.GOOGLE_CLIENT_SECRET.length);
}
console.log("[OAuth] GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI || "(not set — will derive from request)");

// Scopes for Google OAuth Login ONLY (no Calendar - keep login minimal)
const GOOGLE_LOGIN_SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

// Strict allowlist of approved frontend origins
const ALLOWED_FRONTEND_ORIGINS = [
  "https://flowbit.pages.dev",
  "https://syncaura-main-rust.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
];

const getApprovedOrigin = (raw) => {
  if (!raw) return null;
  const cleaned = raw.replace(/\/+$/, '');
  // Also check env-configured origins
  const extraOrigins = (process.env.ALLOWED_CLIENT_ORIGINS || '')
    .split(',').map(o => o.trim().replace(/\/+$/, '')).filter(Boolean);
  const all = [...ALLOWED_FRONTEND_ORIGINS, ...extraOrigins];
  return all.includes(cleaned) ? cleaned : null;
};

const getRedirectUri = (req) => {
  if (process.env.GOOGLE_REDIRECT_URI && process.env.GOOGLE_REDIRECT_URI.trim()) {
    return process.env.GOOGLE_REDIRECT_URI.trim();
  }
  // Fallback: derive from request (should not be reached in production if env var is set)
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
  const host = req.get('host');
  console.warn("[OAuth] GOOGLE_REDIRECT_URI not set — deriving from request. Set the env var for production.");
  return `${protocol}://${host}/api/auth/google/callback`;
};

// Instantiating local oauthClient for auth login/signup flow
const getOauth2Client = (req) => {
  const redirectUri = getRedirectUri(req);
  console.log("[OAuth] Creating OAuth2Client with redirectUri:", redirectUri);
  console.log("[OAuth] Using CLIENT_ID length:", (process.env.GOOGLE_CLIENT_ID || "").length);
  return {
    client: new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    ),
    redirectUri,
  };
};

/**
 * Initiate Google login/signup redirect
 */
export const initiateGoogleLogin = async (req, res) => {
  try {
    const rawOrigin = req.query.origin || (req.get('referer') ? new URL(req.get('referer')).origin : null);

    // Validate origin against strict allowlist — prevent open redirects
    let clientOrigin = getApprovedOrigin(rawOrigin);
    if (!clientOrigin) {
      // Fall back to CLIENT_URL if origin is missing or not in allowlist
      clientOrigin = (process.env.CLIENT_URL || "https://flowbit.pages.dev").replace(/\/+$/, '');
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error("[OAuth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in backend environment variables.");
      return res.redirect(`${clientOrigin}/signin?error=${encodeURIComponent("Google Client ID or Secret is not configured on the backend.")}`);
    }

    const { client: oauth2Client, redirectUri } = getOauth2Client(req);
    const statePayload = Buffer.from(JSON.stringify({ origin: clientOrigin, t: Date.now() })).toString('base64');

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: GOOGLE_LOGIN_SCOPES,
      state: statePayload,
      prompt: "consent",
      redirect_uri: redirectUri,
    });

    console.log("[OAuth] Redirecting to Google. clientOrigin:", clientOrigin, "redirectUri:", redirectUri);
    res.redirect(authUrl);
  } catch (error) {
    console.error("[OAuth] Google Login initiation error:", error);
    res.status(500).json({ message: "Failed to initiate Google Login" });
  }
};

/**
 * Handle Google callback, register or login user, generate tokens, and redirect to frontend
 */
export const handleGoogleCallback = async (req, res) => {
  // Default clientUrl — will be overridden from state if valid
  let clientUrl = (process.env.CLIENT_URL || "https://flowbit.pages.dev").replace(/\/+$/, '');

  if (req.query.state) {
    try {
      const parsed = JSON.parse(Buffer.from(req.query.state, 'base64').toString('utf8'));
      if (parsed?.origin) {
        // Validate origin from state against allowlist to prevent open redirect
        const approved = getApprovedOrigin(parsed.origin);
        if (approved) {
          clientUrl = approved;
        } else {
          console.warn("[OAuth] State origin not in allowlist:", parsed.origin, "— using default CLIENT_URL");
        }
      }
    } catch (e) {
      console.warn("[OAuth] Failed to parse state param:", e.message);
    }
  }

  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect(`${clientUrl}/signin?error=${encodeURIComponent("Google authorization code missing")}`);
    }

    console.log("[OAuth] Exchanging code for tokens. redirectUri will be:", getRedirectUri(req));
    const { client: oauth2Client, redirectUri } = getOauth2Client(req);

    let tokens;
    try {
      const tokenResponse = await oauth2Client.getToken({ code, redirect_uri: redirectUri });
      tokens = tokenResponse.tokens;
      console.log("[OAuth] Token exchange successful. Scopes:", tokens.scope);
    } catch (tokenErr) {
      console.error("[OAuth] Token exchange failed:", tokenErr.message);
      // Provide a more helpful error message for invalid_client
      const errMsg = tokenErr.message.includes("invalid_client")
        ? "OAuth credentials mismatch — check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on Render"
        : tokenErr.message;
      return res.redirect(`${clientUrl}/signin?error=${encodeURIComponent("Google OAuth Login failed: " + errMsg)}`);
    }

    oauth2Client.setCredentials(tokens);

    // Get user info from Google API
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email) {
      return res.redirect(`${clientUrl}/signin?error=${encodeURIComponent("Google account does not have a valid email address")}`);
    }

    const email = userInfo.email.toLowerCase();
    console.log("[OAuth] Google user authenticated:", email);

    // Check if user exists in database
    let userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    let user;

    if (userRes.rowCount > 0) {
      user = userRes.rows[0];
      console.log("[OAuth] Existing user found, id:", user.id);
    } else {
      // User doesn't exist -> Create new user with a secure disabled password hash
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 12);
      const name = userInfo.name || "Google User";

      const insertRes = await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, email, dummyPassword, "user"]
      );
      user = insertRes.rows[0];
      console.log("[OAuth] New user created, id:", user.id);
    }

    // Save Google OAuth access token (for potential calendar sync later)
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

    // Set refresh token cookie
    // SameSite=None required for cross-origin OAuth redirects
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect user back to frontend AuthCallback route
    // Include userId and email so frontend can hydrate state without an extra API call
    const redirectUrl = `${clientUrl}/auth/callback?token=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}&role=${encodeURIComponent(user.role)}&name=${encodeURIComponent(user.name)}&userId=${encodeURIComponent(user.id)}&email=${encodeURIComponent(user.email)}`;
    console.log("[OAuth] Redirecting to frontend:", clientUrl + "/auth/callback");
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("[OAuth] Google OAuth login callback error:", error);
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
