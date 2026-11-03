import { google } from "googleapis";
import pool from "../config/db.js";

/**
 * Create Google OAuth2 client and attach user's tokens.
 *
 * This client is used for:
 * - Google Calendar
 * - Google Meet conference creation
 * - Calendar event update/delete
 * - Calendar event listing
 */
export const getCalendarClient = (tokens, userId = null) => {
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:5000/auth/google/callback";

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is missing in .env");
  }

  if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is missing in .env");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  /**
   * Attach user's Google OAuth credentials
   */
  if (tokens) {
    oauth2Client.setCredentials({
      access_token: tokens.access_token || undefined,

      refresh_token: tokens.refresh_token || undefined,

      scope: tokens.scope || undefined,

      token_type: tokens.token_type || undefined,

      expiry_date: tokens.expiry_date
        ? Number(tokens.expiry_date)
        : undefined,
    });
  }

  /**
   * Google automatically emits this event
   * when it refreshes an expired access token.
   *
   * We save the new token into our users table.
   */
  oauth2Client.on("tokens", async (refreshedTokens) => {
    if (!userId) {
      return;
    }

    try {
      console.log(
        `Google OAuth tokens refreshed for user: ${userId}`
      );

      const query = `
        UPDATE users
        SET
          google_access_token =
            COALESCE($1, google_access_token),

          google_refresh_token =
            COALESCE($2, google_refresh_token),

          google_expiry_date =
            COALESCE($3, google_expiry_date),

          google_scope =
            COALESCE($4, google_scope),

          google_token_type =
            COALESCE($5, google_token_type),

          updated_at = CURRENT_TIMESTAMP

        WHERE id = $6
      `;

      await pool.query(query, [
        refreshedTokens.access_token || null,

        refreshedTokens.refresh_token || null,

        refreshedTokens.expiry_date || null,

        refreshedTokens.scope || null,

        refreshedTokens.token_type || null,

        userId,
      ]);

      console.log(
        "Refreshed Google tokens saved successfully."
      );

    } catch (error) {

      console.error(
        "Failed to save refreshed Google tokens:",
        error
      );
    }
  });

  /**
   * Return Google Calendar API client
   */
  return google.calendar({
    version: "v3",
    auth: oauth2Client,
  });
};