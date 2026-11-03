import dotenv from 'dotenv'
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import { google } from "googleapis";
import fs from "fs"; // Added for Database storage

const app = express();
app.use(bodyParser.json());

/* ---------------- OAUTH CLIENT ---------------- */
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
let savedTokens = null;

/* ---------------- ROUTES ---------------- */

app.get("/", (req, res) => res.send("Server is running ✅"));

// 1. Authenticate Route
app.get("/auth", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.redirect(authUrl); // Directly redirect to make it easier
});

// 2. Callback Route
app.get("/oauth2callback", async (req, res) => {
  try {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    savedTokens = tokens;
    res.send("<h1>Authentication successful ✅</h1><p>You can go back to Postman now.</p>");
  } catch (err) {
    res.status(500).send("Authentication failed");
  }
});

// 3. Create Meet & Store in DB
app.post("/create-meet", async (req, res) => {
  try {
    if (!savedTokens) return res.status(401).json({ error: "Please go to /auth first" });

    oauth2Client.setCredentials(savedTokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const { title, dateTime, emails } = req.body;
    if (!title || !dateTime || !emails) return res.status(400).json({ error: "Missing fields" });

    // Set end time to 30 minutes after start time
    const start = new Date(dateTime);
    const end = new Date(start.getTime() + 30 * 60000);

    const event = {
      summary: title,
      start: { dateTime: start.toISOString(), timeZone: "Asia/Kolkata" },
      end: { dateTime: end.toISOString(), timeZone: "Asia/Kolkata" },
      attendees: emails.map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    // Extract the Meet link safely
    const meetLink = response.data.hangoutLink;

    // --- DB STORAGE LOGIC ---
    const meetingData = {
      title,
      meetLink,
      date: dateTime,
      eventId: response.data.id,
      createdAt: new Date().toISOString(),
    };

    // Save to a local file (database.json)
    const dbPath = "./database.json";
    let database = [];
    if (fs.existsSync(dbPath)) {
      database = JSON.parse(fs.readFileSync(dbPath));
    }
    database.push(meetingData);
    fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));
    // ------------------------

    res.json({
      message: "Success! Meeting created and stored in DB.",
      meetLink: meetLink,
      calendarLink: response.data.htmlLink,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to create meeting" });
  }
});

app.listen(3000, () => console.log("🚀 Server: http://localhost:3000"));