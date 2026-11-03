import express from "express";
import {addNote,getNotesByMeeting} from "../controllers/noteController.js";

import {auth} from "../middlewares/auth.js";

const router =express.Router();

router.post("/",auth,addNote);
router.get("/:meetingId",auth,getNotesByMeeting);




export default router; 