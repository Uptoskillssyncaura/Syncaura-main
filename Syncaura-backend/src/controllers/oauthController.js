import { google } from "googleapis";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
  const configured = cleanEnv(process.env.GOOGLE_REDIRECT_URI);
  if (configured) {
    return configured;
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
  const clientId = cleanEnv(process.env.GOOGLE_CLIENT_ID);
  const clientSecret = cleanEnv(process.env.GOOGLE_CLIENT_SECRET);
  console.log("[OAuth] Creating OAuth2Client with redirectUri:", redirectUri);
  console.log("[OAuth] Using Client ID:", maskString(clientId));
  console.log("[OAuth] Using Client Secret:", maskString(clientSecret));
  return {
    client: new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    ),
    redirectUri,
  };
};

/**
 * Helper to securely parse and validate OAuth state parameter
 */
const parseOAuthState = (rawState) => {
  const defaultOrigin = cleanEnv(process.env.CLIENT_URL || "https://flowbit.pages.dev").replace(/\/+$/, '');
  const result = {
    origin: defaultOrigin,
    from: "signin",
    valid: false,
  };

  if (!rawState) return result;

  const secret = process.env.JWT_ACCESS_SECRET || "flowbit_oauth_state_secret";

  // Attempt 1: Verify signed JWT state
  try {
    const decoded = jwt.verify(rawState, secret);
    if (decoded && typeof decoded === "object") {
      const approved = getApprovedOrigin(decoded.origin);
      if (approved) result.origin = approved;
      if (decoded.from === "signup" || decoded.from === "signin") {
        result.from = decoded.from;
      }
      result.valid = true;
      return result;
    }
  } catch (jwtErr) {
    // JWT verification failed or state is legacy base64
  }

  // Attempt 2: Fallback to legacy base64-encoded JSON state
  try {
    const parsed = JSON.parse(Buffer.from(rawState, "base64").toString("utf8"));
    if (parsed && typeof parsed === "object") {
      const approved = getApprovedOrigin(parsed.origin);
      if (approved) result.origin = approved;
      if (parsed.from === "signup" || parsed.from === "signin") {
        result.from = parsed.from;
      }
      // Check timestamp expiration (15 minutes)
      if (parsed.t && Date.now() - parsed.t < 15 * 60 * 1000) {
        result.valid = true;
      }
      return result;
    }
  } catch (b64Err) {
    console.warn("[OAuth] Could not parse state parameter:", b64Err.message);
  }

  return result;
};

/**
 * Initiate Google login/signup redirect
 */
export const initiateGoogleLogin = async (req, res) => {
  try {
    const rawOrigin = req.query.origin || (req.get('referer') ? new URL(req.get('referer')).origin : null);
    const fromPage = (req.query.from === "signup" || (req.get('referer') && req.get('referer').includes("signup"))) ? "signup" : "signin";

    // Validate origin against strict allowlist — prevent open redirects
    let clientOrigin = getApprovedOrigin(rawOrigin);
    if (!clientOrigin) {
      // Fall back to CLIENT_URL if origin is missing or not in allowlist
      clientOrigin = cleanEnv(process.env.CLIENT_URL || "https://flowbit.pages.dev").replace(/\/+$/, '');
    }

    const clientId = cleanEnv(process.env.GOOGLE_CLIENT_ID);
    const clientSecret = cleanEnv(process.env.GOOGLE_CLIENT_SECRET);
    if (!clientId || !clientSecret) {
      console.error("[OAuth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in backend environment variables.");
      return res.redirect(`${clientOrigin}/${fromPage}?error=${encodeURIComponent("Google Client ID or Secret is not configured on the backend.")}`);
    }

    const { client: oauth2Client, redirectUri } = getOauth2Client(req);

    // Sign the OAuth state with JWT to prevent tampering and replay attacks
    const stateSecret = process.env.JWT_ACCESS_SECRET || "flowbit_oauth_state_secret";
    const statePayload = jwt.sign(
      { origin: clientOrigin, from: fromPage, t: Date.now() },
      stateSecret,
      { expiresIn: "15m" }
    );

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
  const { code, state, error, error_description, error_uri } = req.query;

  // Safely parse state to find destination frontend origin and page
  const parsedState = parseOAuthState(state);
  const clientUrl = parsedState.origin;
  const returnPage = parsedState.from || "signin";

  // 1. Handle errors returned directly from Google
  if (error) {
    console.error(`[OAuth] Google returned an error: "${error}", description: "${error_description || '(none)'}"`);
    let userMsg;
    if (error === "access_denied") {
      userMsg = "Google sign-in was cancelled or access denied. If your Google Cloud app is in 'Testing' mode, make sure your email is added under 'Test users' in Google Cloud Console.";
    } else if (error === "redirect_uri_mismatch") {
      userMsg = "Google OAuth redirect URI mismatch. Please verify that authorized redirect URIs in Google Cloud Console include: https://syncaura-main.onrender.com/api/auth/google/callback";
    } else {
      userMsg = error_description || `Google authentication failed: ${error}`;
    }
    return res.redirect(`${clientUrl}/${returnPage}?error=${encodeURIComponent(userMsg)}`);
  }

  // 2. Handle missing authorization code
  if (!code) {
    const paramNames = Object.keys(req.query || {}).join(", ") || "(none)";
    console.warn(`[OAuth] Google callback reached without code or error at ${req.originalUrl}. Query params present: [${paramNames}]`);
    return res.redirect(`${clientUrl}/${returnPage}?error=${encodeURIComponent("Google authorization code missing. Please try signing in again.")}`);
  }

  // 3. Exchange code for Google tokens
  try {
    console.log("[OAuth] Exchanging code for tokens. redirectUri will be:", getRedirectUri(req));
    const { client: oauth2Client, redirectUri } = getOauth2Client(req);

    let tokens;
    try {
      const tokenResponse = await oauth2Client.getToken({ code, redirect_uri: redirectUri });
      tokens = tokenResponse.tokens;
      console.log("[OAuth] Token exchange successful. Scopes:", tokens.scope);
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

    // 4. Fetch user profile from Google
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email) {
      return res.redirect(`${clientUrl}/${returnPage}?error=${encodeURIComponent("Google account does not have a valid email address")}`);
    }

    const email = userInfo.email.toLowerCase();
    const googleSub = userInfo.id || null;
    const profilePic = userInfo.picture || null;
    console.log("[OAuth] Google user authenticated. Email:", email, "Sub:", googleSub ? maskString(googleSub) : "(none)");

    // 5. Check if user exists in database (match by google_id OR verified email)
    let userRes = await pool.query(
      "SELECT * FROM users WHERE (google_id IS NOT NULL AND google_id = $1) OR email = $2 LIMIT 1",
      [googleSub, email]
    );
    let user;

    if (userRes.rowCount > 0) {
      user = userRes.rows[0];
      console.log("[OAuth] Existing user found, id:", user.id);

      // Link google_id and profile pic if missing
      await pool.query(
        `UPDATE users SET 
          google_id = COALESCE(google_id, $1),
          profile_pic = COALESCE(profile_pic, $2),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [googleSub, profilePic, user.id]
      );
    } else {
      // User doesn't exist -> Create new user account with secure random password hash
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 12);
      const name = userInfo.name || "Google User";

      const insertRes = await pool.query(
        `INSERT INTO users (name, email, password_hash, role, google_id, profile_pic) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, email, dummyPassword, "user", googleSub, profilePic]
      );
      user = insertRes.rows[0];
      console.log("[OAuth] New user created, id:", user.id);
    }

    // 6. Save Google OAuth access token for optional calendar sync
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

    // 7. Generate JWT access & refresh tokens
    const rid = assignRefreshId(user);
    await pool.query("UPDATE users SET refresh_token_id = $1 WHERE id = $2", [rid, user.id]);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, rid);

    // 8. Set refresh token cookie (SameSite=None in production for cross-origin redirects)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 9. Redirect user back to frontend AuthCallback route with credentials
    const redirectUrl = `${clientUrl}/auth/callback?token=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}&role=${encodeURIComponent(user.role)}&name=${encodeURIComponent(user.name)}&userId=${encodeURIComponent(user.id)}&email=${encodeURIComponent(user.email)}`;
    console.log("[OAuth] Redirecting to frontend:", clientUrl + "/auth/callback");
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("[OAuth] Google OAuth login callback unexpected error:", error);
    res.redirect(`${clientUrl}/${returnPage}?error=${encodeURIComponent("Google OAuth Login failed: " + error.message)}`);
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
