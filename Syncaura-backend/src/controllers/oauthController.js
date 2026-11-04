import { google } from "googleapis";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../config/db.js";
import { generateAccessToken, generateRefreshToken, assignRefreshId } from "../utils/generateTokens.js";
import { getAccessToken as getGithubAccessToken } from "../services/githubAPI.js";

const cleanEnv = (val) => {
  if (!val) return "";
  return String(val).trim().replace(/^["']|["']$/g, '').trim();
};

const maskString = (str) => {
  if (!str) return "(empty)";
  if (str.length <= 10) return str.slice(0, 2) + "***" + str.slice(-2);
  return str.slice(0, 10) + "..." + str.slice(-6) + ` (len: ${str.length})`;
};

// Log credential presence at module load (masked — safe for logs)
const startupClientId = cleanEnv(process.env.GOOGLE_CLIENT_ID);
const startupClientSecret = cleanEnv(process.env.GOOGLE_CLIENT_SECRET);
if (!startupClientId) {
  console.error("[OAuth] MISSING: GOOGLE_CLIENT_ID is not set in environment");
} else {
  console.log("[OAuth] GOOGLE_CLIENT_ID loaded:", maskString(startupClientId));
}
if (!startupClientSecret) {
  console.error("[OAuth] MISSING: GOOGLE_CLIENT_SECRET is not set in environment");
} else {
  console.log("[OAuth] GOOGLE_CLIENT_SECRET loaded:", maskString(startupClientSecret));
}
console.log("[OAuth] GOOGLE_REDIRECT_URI:", cleanEnv(process.env.GOOGLE_REDIRECT_URI) || "(not set — will derive from request)");

// Basic sign-in scopes ONLY (no calendar, drive, or sensitive scopes)
const GOOGLE_LOGIN_SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

// Strict allowlist of approved production frontend origins
const ALLOWED_FRONTEND_ORIGINS = [
  "https://flowbit.pages.dev",
  "https://syncaura-main-rust.vercel.app",
];

const getApprovedOrigin = (raw) => {
  if (!raw) return null;
  const cleaned = raw.replace(/\/+$/, '');

  // Check known production domains
  if (ALLOWED_FRONTEND_ORIGINS.includes(cleaned)) {
    return cleaned;
  }

  // Check extra origins configured in environment
  const extraOrigins = [
    ...(process.env.ALLOWED_CLIENT_ORIGINS || '').split(',').map(o => o.trim().replace(/\/+$/, '')),
    cleanEnv(process.env.CLIENT_URL).replace(/\/+$/, '')
  ].filter(Boolean);

  if (extraOrigins.includes(cleaned)) {
    return cleaned;
  }

  // Allow localhost ONLY in non-production development mode
  if (process.env.NODE_ENV !== "production") {
    if (/^http:\/\/localhost(:\d+)?$/.test(cleaned) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(cleaned)) {
      return cleaned;
    }
  }

  return null;
};

const getRedirectUri = (req) => {
  const configured = cleanEnv(process.env.GOOGLE_REDIRECT_URI);
  if (configured) {
    return configured;
  }
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
  const host = req.get('host');
  console.warn("[OAuth] GOOGLE_REDIRECT_URI not set — deriving from request. Set the env var for production.");
  return `${protocol}://${host}/api/auth/google/callback`;
};

// Single Google OAuth 2.0 Web Client — reads exclusively from environment
const getOauth2Client = (req) => {
  const redirectUri = getRedirectUri(req);
  const clientId = cleanEnv(process.env.GOOGLE_CLIENT_ID);
  const clientSecret = cleanEnv(process.env.GOOGLE_CLIENT_SECRET);

  console.log("[OAuth] Initializing OAuth2Client with redirectUri:", redirectUri);
  console.log("[OAuth] Using Client ID:", maskString(clientId));
  console.log("[OAuth] Using Client Secret:", maskString(clientSecret));

  return {
    client: new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    ),
    redirectUri,
    clientId,
  };
};

// Anti-replay cache for OAuth state nonces (10 minute TTL)
const usedStateNonces = new Set();
const recordStateNonce = (nonce) => {
  usedStateNonces.add(nonce);
  setTimeout(() => usedStateNonces.delete(nonce), 10 * 60 * 1000).unref();
};

// Ephemeral single-use authorization code store (60-second TTL)
// Ensures access tokens and refresh tokens are NEVER put in URL query parameters
const exchangeCodeStore = new Map();

const setExchangeCode = (code, data, ttlMs = 60000) => {
  exchangeCodeStore.set(code, {
    ...data,
    expiresAt: Date.now() + ttlMs,
  });
  setTimeout(() => {
    exchangeCodeStore.delete(code);
  }, ttlMs + 5000).unref();
};

/**
 * Initiate Google login/signup redirect
 * GET /api/auth/google
 */
export const initiateGoogleLogin = async (req, res) => {
  try {
    const rawOrigin = req.query.origin || (req.get('referer') ? new URL(req.get('referer')).origin : null);
    const fromPage = (req.query.from === "signup" || (req.get('referer') && req.get('referer').includes("signup"))) ? "signup" : "signin";

    // Validate origin against strict allowlist — prevent open redirects
    let clientOrigin = getApprovedOrigin(rawOrigin);
    if (!clientOrigin) {
      clientOrigin = cleanEnv(process.env.CLIENT_URL || "https://flowbit.pages.dev").replace(/\/+$/, '');
    }

    const clientId = cleanEnv(process.env.GOOGLE_CLIENT_ID);
    const clientSecret = cleanEnv(process.env.GOOGLE_CLIENT_SECRET);
    if (!clientId || !clientSecret) {
      console.error("[OAuth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in backend environment variables.");
      return res.redirect(`${clientOrigin}/${fromPage}?error=${encodeURIComponent("Google Client ID or Secret is not configured on the backend.")}`);
    }

    const { client: oauth2Client, redirectUri } = getOauth2Client(req);

    // Generate cryptographically secure state with nonce and bound origin/intent
    const nonce = crypto.randomBytes(16).toString("hex");
    const stateSecret = process.env.JWT_ACCESS_SECRET || "flowbit_oauth_state_secret";
    const statePayload = jwt.sign(
      { nonce, origin: clientOrigin, from: fromPage, iat: Math.floor(Date.now() / 1000) },
      stateSecret,
      { expiresIn: "10m" }
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: GOOGLE_LOGIN_SCOPES,
      state: statePayload,
      prompt: "consent",
      redirect_uri: redirectUri,
    });

    console.log("[OAuth] Initiating Google OAuth. clientOrigin:", clientOrigin, "redirectUri:", redirectUri);
    res.redirect(authUrl);
  } catch (error) {
    console.error("[OAuth] Google Login initiation error:", error);
    res.status(500).json({ message: "Failed to initiate Google Login" });
  }
};

/**
 * Handle Google callback, register or login user, generate exchange code, and redirect to frontend
 * GET /api/auth/google/callback
 */
export const handleGoogleCallback = async (req, res) => {
  const { code, state, error, error_description } = req.query;
  const defaultOrigin = cleanEnv(process.env.CLIENT_URL || "https://flowbit.pages.dev").replace(/\/+$/, '');
  let clientUrl = defaultOrigin;
  let returnPage = "signin";

  // 1. Validate and verify OAuth state parameter securely
  if (!state) {
    console.warn("[OAuth] Callback received without state parameter at", req.originalUrl);
    return res.redirect(`${defaultOrigin}/signin?error=${encodeURIComponent("Missing OAuth security state parameter.")}`);
  }

  const stateSecret = process.env.JWT_ACCESS_SECRET || "flowbit_oauth_state_secret";
  try {
    const decoded = jwt.verify(state, stateSecret);
    if (!decoded || !decoded.nonce) {
      throw new Error("Invalid state structure");
    }
    if (usedStateNonces.has(decoded.nonce)) {
      throw new Error("OAuth state has already been used (replay attack prevented)");
    }
    recordStateNonce(decoded.nonce);

    const approved = getApprovedOrigin(decoded.origin);
    if (!approved) {
      throw new Error(`Origin ${decoded.origin} is not allowed`);
    }
    clientUrl = approved;
    returnPage = decoded.from === "signup" ? "signup" : "signin";
  } catch (stateErr) {
    console.error("[OAuth] State validation failed:", stateErr.message);
    return res.redirect(`${defaultOrigin}/signin?error=${encodeURIComponent("Security validation failed: invalid or expired OAuth state.")}`);
  }

  // 2. Handle errors returned directly from Google
  if (error) {
    console.error(`[OAuth] Google returned an error: "${error}", description: "${error_description || '(none)'}"`);
    let userMsg;
    if (error === "access_denied") {
      userMsg = "Google sign-in was cancelled or access denied. If your Google Cloud app is in 'Testing' mode, verify your account is in the Test Users list.";
    } else if (error === "redirect_uri_mismatch") {
      userMsg = "Google OAuth redirect URI mismatch. Please verify that authorized redirect URIs in Google Cloud Console include: https://syncaura-main.onrender.com/api/auth/google/callback";
    } else {
      userMsg = error_description || `Google authentication failed: ${error}`;
    }
    return res.redirect(`${clientUrl}/${returnPage}?error=${encodeURIComponent(userMsg)}`);
  }

  // 3. Handle missing authorization code
  if (!code) {
    const paramNames = Object.keys(req.query || {}).join(", ") || "(none)";
    console.warn(`[OAuth] Google callback reached without code or error at ${req.originalUrl}. Query params present: [${paramNames}]`);
    return res.redirect(`${clientUrl}/${returnPage}?error=${encodeURIComponent("Google authorization code missing. Please try signing in again.")}`);
  }

  // 4. Exchange authorization code for Google tokens using the single client
  try {
    console.log("[OAuth] Exchanging code for tokens. redirectUri will be:", getRedirectUri(req));
    const { client: oauth2Client, redirectUri, clientId } = getOauth2Client(req);

    let tokens;
    try {
      const tokenResponse = await oauth2Client.getToken({ code, redirect_uri: redirectUri });
      tokens = tokenResponse.tokens;
      console.log("[OAuth] Token exchange successful with Google.");
    } catch (tokenErr) {
      console.error("[OAuth] Token exchange failed:", tokenErr.message);
      if (tokenErr.response?.data) {
        console.error("[OAuth] Google error response:", JSON.stringify(tokenErr.response.data));
      }
      let errMsg = tokenErr.message;
      if (tokenErr.message.includes("invalid_client")) {
        errMsg = "OAuth credentials mismatch — check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on Render match Google Cloud Console";
      } else if (tokenErr.message.includes("invalid_grant")) {
        errMsg = "Authorization code expired or already used. Please try signing in again.";
      }
      return res.redirect(`${clientUrl}/${returnPage}?error=${encodeURIComponent("Google OAuth Login failed: " + errMsg)}`);
    }

    oauth2Client.setCredentials(tokens);

    // 5. Verify Google ID Token and audience securely
    let googleSub = null;
    let email = null;
    let name = "Google User";
    let profilePic = null;

    if (tokens.id_token) {
      try {
        const ticket = await oauth2Client.verifyIdToken({
          idToken: tokens.id_token,
          audience: clientId,
        });
        const payload = ticket.getPayload();
        googleSub = payload.sub;
        email = payload.email ? payload.email.toLowerCase() : null;
        name = payload.name || name;
        profilePic = payload.picture || null;
        console.log("[OAuth] Verified Google ID Token. Sub:", maskString(googleSub), "Email:", email);

        if (!payload.email_verified) {
          return res.redirect(`${clientUrl}/${returnPage}?error=${encodeURIComponent("Google account email is not verified by Google.")}`);
        }
      } catch (verifyErr) {
        console.warn("[OAuth] ID token verification error, falling back to userinfo:", verifyErr.message);
      }
    }

    // Fallback profile retrieval if ID token was not present or could not be decoded
    if (!email) {
      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
      const { data: userInfo } = await oauth2.userinfo.get();
      if (!userInfo.email) {
        return res.redirect(`${clientUrl}/${returnPage}?error=${encodeURIComponent("Google account does not have a valid email address.")}`);
      }
      email = userInfo.email.toLowerCase();
      googleSub = userInfo.id || googleSub;
      name = userInfo.name || name;
      profilePic = userInfo.picture || profilePic;
    }

    // 6. Look up or register user without overwriting passwords or roles
    let userRes = await pool.query(
      "SELECT * FROM users WHERE (google_id IS NOT NULL AND google_id = $1) OR email = $2 LIMIT 1",
      [googleSub, email]
    );
    let user;

    if (userRes.rowCount > 0) {
      user = userRes.rows[0];
      console.log("[OAuth] Existing user found, id:", user.id);

      // Link google_id and profile_pic if not already set (preserves existing password & role)
      await pool.query(
        `UPDATE users SET 
          google_id = COALESCE(google_id, $1),
          profile_pic = COALESCE(profile_pic, $2),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [googleSub, profilePic, user.id]
      );
    } else {
      // Create new user account with secure random password hash
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 12);

      const insertRes = await pool.query(
        `INSERT INTO users (name, email, password_hash, role, google_id, profile_pic) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, email, dummyPassword, "user", googleSub, profilePic]
      );
      user = insertRes.rows[0];
      console.log("[OAuth] New user registered via Google, id:", user.id);
    }

    // 7. Store Google OAuth tokens for optional Calendar integration
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

    // 8. Generate JWT access & refresh tokens
    const rid = assignRefreshId(user);
    await pool.query("UPDATE users SET refresh_token_id = $1 WHERE id = $2", [rid, user.id]);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, rid);

    // 9. Store authentication payload with a single-use exchange code (60-second TTL)
    // NEVER put accessToken or refreshToken directly in the URL query string!
    const exchangeCode = crypto.randomBytes(32).toString("hex");
    setExchangeCode(exchangeCode, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profile_pic || profilePic,
      },
      accessToken,
      refreshToken,
    }, 60000);

    // Redirect user to frontend AuthCallback with ONLY the one-time exchange code
    const redirectUrl = `${clientUrl}/auth/callback?code=${encodeURIComponent(exchangeCode)}`;
    console.log("[OAuth] Authentication successful. Redirecting to frontend with one-time exchange code.");
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("[OAuth] Google OAuth callback unexpected error:", error);
    res.redirect(`${clientUrl}/${returnPage}?error=${encodeURIComponent("Google OAuth Login failed: " + error.message)}`);
  }
};

/**
 * Exchange one-time Google authorization code for authentication tokens (POST /api/auth/google/exchange)
 * Keeps access tokens and refresh tokens completely out of URL query parameters
 */
export const exchangeGoogleAuthCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Authorization code missing" });
    }

    const session = exchangeCodeStore.get(code);
    if (!session) {
      return res.status(400).json({ message: "Invalid or expired authorization code" });
    }

    // Immediately remove code to enforce single-use (anti-replay)
    exchangeCodeStore.delete(code);

    if (Date.now() > session.expiresAt) {
      return res.status(400).json({ message: "Authorization code has expired" });
    }

    // Set HttpOnly refresh token cookie
    res.cookie("refreshToken", session.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: session.user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
  } catch (err) {
    console.error("[OAuth] Exchange code error:", err);
    return res.status(500).json({ message: "Failed to exchange authorization code" });
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

    const githubAccessToken = await getGithubAccessToken(code);
    const githubUser = await getGithubUser(githubAccessToken);

    if (!githubUser.email) {
      return res.status(400).json({ message: "Could not retrieve a valid email from your GitHub profile" });
    }

    let userRes = await pool.query("SELECT * FROM users WHERE email = $1", [githubUser.email]);
    let user;

    if (userRes.rowCount > 0) {
      user = userRes.rows[0];
    } else {
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 12);
      const insertRes = await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [githubUser.name, githubUser.email, dummyPassword, "user"]
      );
      user = insertRes.rows[0];
    }

    const rid = assignRefreshId(user);
    await pool.query("UPDATE users SET refresh_token_id = $1 WHERE id = $2", [rid, user.id]);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, rid);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
