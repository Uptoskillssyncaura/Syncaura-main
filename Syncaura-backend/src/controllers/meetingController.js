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

  if (
    dateStr.includes('+') ||
    dateStr.endsWith('Z')
  ) {
    return dateStr;
  }

  return `${dateStr}+05:30`;
};

// 🟢 Sync Google Calendar
export const syncCalendar = async (req, res) => {

  try {

    const tokens = req.user?.googleTokens;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (
      !tokens ||
      (
        !tokens.access_token &&
        !tokens.refresh_token
      )
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Google Calendar not connected. Please connect your Google account first."
      });
    }

    const googleEvents = await listCalendarEvents({
      tokens,
      userId
    });

    let importedCount = 0;
    let updatedCount = 0;

    for (const gEvent of googleEvents) {

      const googleEventId = gEvent.id;

      const title =
        gEvent.summary ||
        "Google Calendar Event";

      const description =
        gEvent.description || "";

      const startTime =
        parseToLocalString(
          gEvent.start?.dateTime ||
          gEvent.start?.date
        );

      const endTime =
        parseToLocalString(
          gEvent.end?.dateTime ||
          gEvent.end?.date
        );

      if (
        !googleEventId ||
        !startTime ||
        !endTime
      ) {
        continue;
      }

      const meetLink =
        gEvent.hangoutLink ||
        gEvent.conferenceData?.entryPoints
          ?.find(
            entry =>
              entry.entryPointType === "video"
          )
          ?.uri ||
        null;

      const existing = await pool.query(
        `
        SELECT id
        FROM meetings
        WHERE google_event_id = $1
        `,
        [googleEventId]
      );

      if (existing.rowCount > 0) {

        await pool.query(
          `
          UPDATE meetings
          SET
            title = $1,
            description = $2,
            start_time = $3,
            end_time = $4,
            google_meet_link = $5,
            updated_at = CURRENT_TIMESTAMP
          WHERE google_event_id = $6
          `,
          [
            title,
            description,
            startTime,
            endTime,
            meetLink,
            googleEventId
          ]
        );

        updatedCount++;

      } else {

        const inserted = await pool.query(
          `
          INSERT INTO meetings (
            title,
            description,
            start_time,
            end_time,
            created_by,
            google_event_id,
            google_meet_link
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
          `,
          [
            title,
            description,
            startTime,
            endTime,
            userId,
            googleEventId,
            meetLink
          ]
        );

        /*
         * Import attendees
         */
        const meetingId =
          inserted.rows[0].id;

        if (Array.isArray(gEvent.attendees)) {

          for (const attendee of gEvent.attendees) {

            if (!attendee.email) continue;

            await pool.query(
              `
              INSERT INTO meeting_participants (
                meeting_id,
                email
              )
              VALUES ($1, $2)
              ON CONFLICT DO NOTHING
              `,
              [
                meetingId,
                attendee.email
              ]
            );
          }
        }

        importedCount++;
      }
    }

    /*
     * Return user's local meetings
     */
    const meetingsResult = await pool.query(
      `
      SELECT *
      FROM meetings
      WHERE created_by = $1
      ORDER BY start_time DESC
      `,
      [userId]
    );

    const meetings =
      meetingsResult.rows;

    for (const meeting of meetings) {

      const participantsResult =
        await pool.query(
          `
          SELECT email
          FROM meeting_participants
          WHERE meeting_id = $1
          `,
          [meeting.id]
        );

      meeting.participants =
        participantsResult.rows.map(
          row => row.email
        );
    }

    return res.status(200).json({

      success: true,

      message:
        `Calendar sync completed! Imported ${importedCount}, updated ${updatedCount}.`,

      importedCount,

      updatedCount,

      meetings

    });

  } catch (error) {

    console.error(
      "Error in syncCalendar:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Failed to sync calendar",

      error: error.message

    });
  }
};

// ✅ Create meeting
export const createMeeting = async (req, res) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      participants
    } = req.body;

    // ---------------------------------------
    // 1. Validate required fields
    // ---------------------------------------
    if (!title || !startTime) {
      return res.status(400).json({
        success: false,
        message: "Title and start time are required"
      });
    }

    // ---------------------------------------
    // 2. Get logged-in user
    // ---------------------------------------
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found"
      });
    }

    console.log("Creating meeting for user:", userId);

    // ---------------------------------------
    // 3. Convert time for local DB
    // ---------------------------------------
    const cleanStartTime = parseToLocalString(startTime);
    const cleanEndTime = endTime ? parseToLocalString(endTime) : null;

    // ---------------------------------------
    // 4. Validate time range
    // ---------------------------------------
    if (cleanEndTime && new Date(cleanEndTime) <= new Date(cleanStartTime)) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time"
      });
    }

    // ---------------------------------------
    // 5. Format time for Google Calendar
    // ---------------------------------------
    const formattedStart = formatForGoogle(startTime);
    const defaultEndTimeStr = new Date(new Date(cleanStartTime).getTime() + 60 * 60 * 1000).toISOString();
    const formattedEnd = endTime ? formatForGoogle(endTime) : formatForGoogle(defaultEndTimeStr);

    let calendarEvent = null;

    // ---------------------------------------
    // 6. Create Google Calendar event
    // ---------------------------------------
    if (
      req.googleTokens &&
      (
        req.googleTokens.access_token ||
        req.googleTokens.refresh_token
      )
    ) {
      try {
        console.log("Google Calendar connected.");
        console.log("Creating Google Calendar event...");

        calendarEvent = await createCalendarEvent({
          tokens: req.googleTokens,
          userId,
          title,
          description,
          startTime: formattedStart,
          endTime: formattedEnd
        });

        console.log("Google Calendar event created:");
        console.log("Event ID:", calendarEvent?.id);
        console.log("Meet Link:", calendarEvent?.hangoutLink);

      } catch (err) {
        console.error("Calendar sync failed:", err);
      }
    } else {
      console.log("Google Calendar is not connected.");
    }

    // ---------------------------------------
    // 7. Extract Google information
    // ---------------------------------------
    const googleEventId = calendarEvent?.id || null;
    let meetLink = calendarEvent?.hangoutLink || calendarEvent?.meetLink || null;

    // If Google Calendar is not connected or returns no link, generate a Google Meet room link
    if (!meetLink) {
      const chars = "abcdefghijklmnopqrstuvwxyz";
      const seg = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      meetLink = `https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`;
    }

    // ---------------------------------------
    // 8. Insert meeting into database
    // ---------------------------------------
    const result = await pool.query(
      `INSERT INTO meetings (
        title,
        description,
        start_time,
        end_time,
        created_by,
        google_event_id,
        google_meet_link
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        title,
        description || null,
        cleanStartTime,
        cleanEndTime || null,
        userId,
        googleEventId || null,
        meetLink || null
      ]
    );

    const meeting = result.rows[0];

    // ---------------------------------------
    // 9. Add participants
    // ---------------------------------------
    if (participants && Array.isArray(participants)) {
      for (const email of participants) {
        if (email && typeof email === 'string' && email.trim()) {
          try {
            await pool.query(
              `INSERT INTO meeting_participants
               (meeting_id, email)
               VALUES ($1, $2)
               ON CONFLICT (meeting_id, email) DO NOTHING`,
              [meeting.id, email.trim()]
            );
          } catch (partErr) {
            console.warn("Error inserting participant:", partErr.message);
          }
        }
      }

      meeting.participants = participants;
    } else {
      meeting.participants = [];
    }

    // ---------------------------------------
    // 10. Response
    // ---------------------------------------
    return res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      meeting,
      google_synced: !!googleEventId,
      meet_link: meetLink
    });

  } catch (error) {
    console.error("Create meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
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

      if (!meeting.google_meet_link) {
        const hash = (meeting.id || "").replace(/[^a-zA-Z]/g, "").slice(0, 10).padEnd(10, "x").toLowerCase();
        meeting.google_meet_link = `https://meet.google.com/${hash.slice(0, 3)}-${hash.slice(3, 7)}-${hash.slice(7, 10)}`;
      }
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

    if (!meeting.google_meet_link) {
      const hash = (meeting.id || "").replace(/[^a-zA-Z]/g, "").slice(0, 10).padEnd(10, "x").toLowerCase();
      meeting.google_meet_link = `https://meet.google.com/${hash.slice(0, 3)}-${hash.slice(3, 7)}-${hash.slice(7, 10)}`;
    }

    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update meeting
export const updateMeeting = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      title,
      description,
      startTime,
      endTime
    } = req.body;

    const existingResult = await pool.query(
      `
      SELECT *
      FROM meetings
      WHERE id = $1
      `,
      [id]
    );

    if (existingResult.rowCount === 0) {
      return res.status(404).json({
        message: "Meeting not found"
      });
    }

    const existing =
      existingResult.rows[0];

    const finalTitle =
      title ?? existing.title;

    const finalDescription =
      description ?? existing.description;

    const finalStartTime =
      startTime
        ? parseToLocalString(startTime)
        : existing.start_time;

    const finalEndTime =
      endTime !== undefined
        ? (endTime ? parseToLocalString(endTime) : null)
        : existing.end_time;

    if (
      finalEndTime &&
      finalStartTime &&
      new Date(finalEndTime) <= new Date(finalStartTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time"
      });
    }

    /*
     * Update Google Calendar
     */
    if (
      existing.google_event_id &&
      req.googleTokens
    ) {
      const gDefaultEnd = finalStartTime
        ? new Date(new Date(finalStartTime).getTime() + 60 * 60 * 1000).toISOString()
        : null;

      try {
        await updateCalendarEvent(
          existing.google_event_id,
          {
            tokens: req.googleTokens,
            userId: req.user?.id,
            title: finalTitle,
            description: finalDescription,
            startTime: formatForGoogle(finalStartTime),
            endTime: finalEndTime
              ? formatForGoogle(finalEndTime)
              : (gDefaultEnd ? formatForGoogle(gDefaultEnd) : null)
          }
        );
      } catch (error) {
        console.warn(
          "Google Calendar update failed:",
          error.message
        );
      }
    }

    /*
     * Update local DB
     */
    const result = await pool.query(
      `
      UPDATE meetings
      SET
        title = $1,
        description = $2,
        start_time = $3,
        end_time = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
      `,
      [
        finalTitle,
        finalDescription,
        finalStartTime,
        finalEndTime,
        id
      ]
    );

    res.json({
      success: true,
      meeting: result.rows[0]
    });

  } catch (error) {

    console.error(
      "Update meeting error:",
      error
    );

    res.status(500).json({
      success: false,
      error: error.message
    });
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