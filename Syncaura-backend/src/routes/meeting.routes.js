import express from "express";


import { createMeeting, updateMeeting, deleteMeeting, getMeetings, getMeetingById, syncCalendar } from "../controllers/meetingController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();
router.post("/sync-calendar", auth, syncCalendar);
router.post("/", auth,createMeeting);
router.get("/", auth, getMeetings);
router.get("/:id", auth, getMeetingById);
router.put("/:id", auth, updateMeeting);
router.delete("/:id", auth, deleteMeeting);

export default router;

