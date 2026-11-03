import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load token.json
const tokenPath = path.join(__dirname, "../../token.json");
const token = JSON.parse(fs.readFileSync(tokenPath, "utf8"));

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Attach token to OAuth client
oAuth2Client.setCredentials(token);

// ✅ CREATE CALENDAR OBJECT HERE
const calendar = google.calendar({
  version: "v3",
  auth: oAuth2Client,
});

// Export calendar
export default calendar;