import { google } from "googleapis";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN_PATH = path.join(__dirname, "../../token.json");


import pool from "../config/db.js";

export const getCalendarClient = (tokens, userId = null) => {
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/auth/google/callback";
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  if (tokens) {
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date ? Number(tokens.expiry_date) : undefined,
    });
  }

  // Listen for refreshed tokens and save them to the database
  oauth2Client.on("tokens", async (refreshedTokens) => {
    if (userId) {
      try {
        console.log(`OAuth tokens automatically refreshed for user ID: ${userId}`);
        const updateQuery = `
          UPDATE users SET 
            google_access_token = COALESCE($1, google_access_token),
            google_refresh_token = COALESCE($2, google_refresh_token),
            google_expiry_date = COALESCE($3, google_expiry_date),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $4
        `;
        await pool.query(updateQuery, [
          refreshedTokens.access_token || null,
          refreshedTokens.refresh_token || null,
          refreshedTokens.expiry_date || null,
          userId,
        ]);
      } catch (err) {
        console.error("Error saving refreshed Google OAuth tokens to DB:", err);
      }
    }
  });

  return google.calendar({
    version: "v3",
    auth: oauth2Client,
  });
};