import express from "express";

import { sendMessage, getMessages } from "../controllers/messageController.js";
import {auth} from "../middlewares/auth.js";

const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/:channelId", auth, getMessages);
import { markAsRead } from "../controllers/messageController.js";
router.post("/read", auth, markAsRead);

import upload from "../middlewares/upload.js";
import { sendMediaMessage } from "../controllers/messageController.js"

router.post(
    "/send-media",
    auth,
    upload.single("file"),
    sendMediaMessage
);


export default router;