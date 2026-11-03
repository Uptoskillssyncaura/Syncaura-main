import express from "express";
import { createCalendarEvent } from "../services/googleCalendar.js";

const router = express.Router();

router.post("/test-calendar", async (req, res) => {
  try {
    const event = await createCalendarEvent({
      title: "Syncaura Test Meeting",
      description: "Testing calendar integration",
      startTime: "2026-01-16T10:00:00+05:30",
      endTime: "2026-01-16T11:00:00+05:30",
    
    });

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
