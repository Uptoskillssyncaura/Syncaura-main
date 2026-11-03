const express = require("express");
const axios = require("axios");
const { getAuthUrl, getToken } = require("./auth");
const { getEmails, getCalendarEvents } = require("./outlook");

const app = express();
let storedToken = null;

app.get("/auth/login", async (req, res) => {
  try {
    const url = await getAuthUrl();
    res.redirect(url);
  } catch (err) {
    res.send("Login error: " + err.message);
  }
});

app.get("/auth/callback", async (req, res) => {
  try {
    storedToken = await getToken(req.query.code);
    res.redirect("/dashboard");
  } catch (err) {
    res.send("Token error: " + err.message);
  }
});

app.get("/dashboard", async (req, res) => {
  if (!storedToken) return res.redirect("/auth/login");
  try {
    const emails = await getEmails(storedToken);
    const events = await getCalendarEvents(storedToken);

    const emailRows = emails.map(e => `
      <tr>
        <td>${e.subject || "No Subject"}</td>
        <td>${e.from?.emailAddress?.name || ""}</td>
        <td>${new Date(e.receivedDateTime).toLocaleString()}</td>
      </tr>
    `).join("");

    const eventRows = events.map(e => `
      <tr>
        <td>${e.subject || "No Subject"}</td>
        <td>${new Date(e.start?.dateTime).toLocaleString()}</td>
        <td>${new Date(e.end?.dateTime).toLocaleString()}</td>
        <td>${e.location?.displayName || "-"}</td>
      </tr>
    `).join("");

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Outlook Sync Dashboard</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; background: #f0f4f8; }
          h1 { color: #0078d4; }
          h2 { color: #333; margin-top: 40px; }
          table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          th { background: #0078d4; color: white; padding: 12px; text-align: left; }
          td { padding: 12px; border-bottom: 1px solid #eee; }
          tr:hover { background: #f5f5f5; }
          .badge { background: #0078d4; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>📧 Outlook Sync Dashboard</h1>
        <p>Connected to Microsoft Outlook ✅</p>

        <h2>📬 Emails <span class="badge">${emails.length}</span></h2>
        <table>
          <tr>
            <th>Subject</th>
            <th>From</th>
            <th>Received</th>
          </tr>
          ${emailRows}
        </table>

        <h2>📅 Calendar Events <span class="badge">${events.length}</span></h2>
        <table>
          <tr>
            <th>Subject</th>
            <th>Start</th>
            <th>End</th>
            <th>Location</th>
          </tr>
          ${eventRows}
        </table>
      </body>
      </html>
    `);
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

app.get("/create-event", async (req, res) => {
  try {
    if (!storedToken) return res.redirect("/auth/login");
    const newEvent = {
      subject: "Test Meeting - Outlook Sync",
      start: { dateTime: "2026-03-15T10:00:00", timeZone: "Asia/Kolkata" },
      end: { dateTime: "2026-03-15T10:30:00", timeZone: "Asia/Kolkata" }
    };
    await axios.post("https://graph.microsoft.com/v1.0/me/events", newEvent, {
      headers: { Authorization: `Bearer ${storedToken}` }
    });
    res.redirect("/dashboard");
  } catch (err) {
    res.json({ error: err.response?.data });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));