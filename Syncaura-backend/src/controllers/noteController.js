import pool from "../config/db.js";

export const addNote = async (req, res) => {
  try {
    const { meetingId, content } = req.body;

    // validate both
  if (!meetingId || !content) {
    return res.status(400).json({ message: "meetingId and content are required" });
  }

    // Check if meeting exists
    const meetingCheck = await pool.query("SELECT id FROM meetings WHERE id = $1", [meetingId]);
    if (meetingCheck.rowCount === 0) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    const result = await pool.query(
      "INSERT INTO notes (meeting_id, content) VALUES ($1, $2) RETURNING *",
      [meetingId, content]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotesByMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const result = await pool.query(
      "SELECT * FROM notes WHERE meeting_id = $1 ORDER BY created_at DESC",
      [meetingId]
    );
    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

