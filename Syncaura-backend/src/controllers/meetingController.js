import pool from "../config/db.js";
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  listCalendarEvents,
} from "../services/googleCalendar.js";

// Helper: Formats string strictly to local time without double-shifting UTC offsets
const parseToLocalString = (dateInput) => {
  if (!dateInput) return null;
  // If string contains time (T), extract YYYY-MM-DDTHH:mm:ss directly
  if (typeof dateInput === 'string' && dateInput.includes('T')) {
    return dateInput.substring(0, 19);
  }
  return `${dateInput}T00:00:00`;
};

// Helper: Ensures string sent to Google Calendar explicitly includes IST (+05:30)
const formatForGoogle = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr.includes('+') || dateStr.endsWith('Z')) return dateStr;
  return `${dateStr}+05:30`;
};

// 🟢 Sync Google Calendar
export const syncCalendar = async (req, res) => {
  try {
    const tokens = req.user?.googleTokens;
    if (!tokens || (!tokens.access_token && !tokens.refresh_token)) {
      return res.status(400).json({
        success: false,
        message: "Google Calendar not connected. Please connect your Google account first.",
      });
    }

    const userId = req.user?.id;
    const googleEvents = await listCalendarEvents({ tokens, userId });
    let importedCount = 0;

    for (const gEvent of googleEvents) {
      const title = gEvent.summary || "Google Calendar Event";
      const description = gEvent.description || "";
      const startTime = parseToLocalString(gEvent.start?.dateTime || gEvent.start?.date);
      const endTime = parseToLocalString(gEvent.end?.dateTime || gEvent.end?.date);
      const meetLink = gEvent.hangoutLink || gEvent.htmlLink || null;

      if (!startTime || !endTime) continue;

      importedCount++;
    }

    const meetingsResult = await pool.query("SELECT * FROM meetings WHERE user_id = $1", [userId]);
    const meetings = meetingsResult.rows || [];

    for (const meeting of meetings) {
      const participantsResult = await pool.query(
        "SELECT email FROM meeting_participants WHERE meeting_id = $1",
        [meeting.id]
      );
      meeting.participants = participantsResult.rows.map((r) => r.email);
    }

    return res.status(200).json({
      success: true,
      message: `Calendar sync completed! Synced ${importedCount} items.`,
      syncedCount: importedCount,
      meetings,
    });
  } catch (error) {
    console.error("Error in syncCalendar:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to sync calendar",
      error: error.message,
    });
  }
};

// ✅ Create meeting
export const createMeeting = async (req, res) => {
  try {
    const { title, description, startTime, endTime, participants } = req.body;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Pass explicit timezone offset (+05:30) to Google Calendar API
    const formattedStart = formatForGoogle(startTime);
    const formattedEnd = formatForGoogle(endTime);

    let calendarEvent = null;

    if (
      req.googleTokens &&
      (req.googleTokens.access_token || req.googleTokens.refresh_token)
    ) {
      try {
        calendarEvent = await createCalendarEvent({
          tokens: req.googleTokens,
          userId: req.user?.id,
          title,
          description,
          startTime: formattedStart,
          endTime: formattedEnd,
        });
      } catch (err) {
        console.error("Calendar sync failed:", err);
      }
    }

    const cleanStartTime = parseToLocalString(startTime);

    const result = await pool.query(
      `INSERT INTO meetings (title, description, start_time) 
       VALUES ($1, $2, $3) RETURNING *`,
      [title, description, cleanStartTime]
    );

    const meeting = result.rows[0];

    if (participants && Array.isArray(participants)) {
      for (const email of participants) {
        await pool.query(
          "INSERT INTO meeting_participants (meeting_id, email) VALUES ($1, $2)",
          [meeting.id, email]
        );
      }
      meeting.participants = participants;
    }

    res.status(201).json({
      message: "Meeting created successfully",
      meeting,
      google_synced: !!calendarEvent?.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all meetings
export const getMeetings = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM meetings ORDER BY start_time DESC"
    );
    const meetings = result.rows;

    for (const meeting of meetings) {
      const participantsResult = await pool.query(
        "SELECT email FROM meeting_participants WHERE meeting_id = $1",
        [meeting.id]
      );
      meeting.participants = participantsResult.rows.map((r) => r.email);
    }

    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get single meeting
export const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;
    const meetingResult = await pool.query(
      "SELECT * FROM meetings WHERE id = $1",
      [id]
    );

    if (meetingResult.rowCount === 0)
      return res.status(404).json({ message: "Meeting not found" });

    const meeting = meetingResult.rows[0];

    const participantsResult = await pool.query(
      "SELECT email FROM meeting_participants WHERE meeting_id = $1",
      [id]
    );
    meeting.participants = participantsResult.rows.map((r) => r.email);

    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update meeting
export const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startTime, endTime } = req.body;

    const existing = await pool.query(
      "SELECT * FROM meetings WHERE id = $1",
      [id]
    );

    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    const meeting = existing.rows[0];

    if (meeting.google_event_id && req.googleTokens) {
      try {
        await updateCalendarEvent(meeting.google_event_id, {
          tokens: req.googleTokens,
          userId: req.user?.id,
          title: title || meeting.title,
          description: description || meeting.description,
          startTime: formatForGoogle(startTime || meeting.start_time),
          endTime: formatForGoogle(endTime || meeting.end_time),
        });
      } catch (err) {
        console.warn("Google Calendar update failed:", err.message);
      }
    }

    const cleanStartTime = parseToLocalString(startTime);
    const cleanEndTime = parseToLocalString(endTime);

    const result = await pool.query(
      `UPDATE meetings SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        start_time = COALESCE($3, start_time),
        end_time = COALESCE($4, end_time),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *`,
      [title, description, cleanStartTime, cleanEndTime, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete meeting
export const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      "SELECT google_event_id FROM meetings WHERE id = $1",
      [id]
    );

    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    const googleEventId = existing.rows[0].google_event_id;

    if (googleEventId && req.googleTokens) {
      try {
        await deleteCalendarEvent(
          googleEventId,
          req.googleTokens,
          req.user?.id
        );
      } catch (err) {
        console.warn("Google Calendar delete failed:", err.message);
      }
    }

    await pool.query("DELETE FROM meetings WHERE id = $1", [id]);

    res.json({ message: "Meeting deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};