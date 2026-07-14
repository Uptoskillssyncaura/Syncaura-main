import fs from "fs";
import path from "path";
import readline from "readline";
import { google } from "googleapis";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("Authorize this app by visiting this url:\n", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nEnter the code from that page here: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    fs.writeFileSync(
      path.join(__dirname, "../../token.json"),
      JSON.stringify(tokens, null, 2)
    );
    console.log("✅ Token stored successfully in token.json");
  } catch (error) {
    console.error("❌ Error retrieving access token", error);
  }
  rl.close();
});