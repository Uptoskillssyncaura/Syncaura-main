import express from "express";
const router = express.Router();
import { auth } from "../middlewares/auth.js";
import { permit } from "../middlewares/role.js";
import {getChannels} from "../controllers/channelController.js";
import {getChannelById} from "../controllers/channelController.js";
import ROLES from "../config/roles.js";

import {
  createChannel,
  joinChannel,
  leaveChannel,
  getPublicChannels,
  createPrivateChat,
  createGroupChat,
  updateGroupDetails,
  addGroupMembers,
  removeGroupMember
} from "../controllers/channelController.js";
import upload from "../middlewares/upload.js";

router.post("/private", auth, createPrivateChat);
router.post("/group", auth, createGroupChat);

router.post(
  "/",
  auth,
  
  createChannel
);

router.post("/:channelId/join", auth, joinChannel);
router.post("/:channelId/leave", auth, leaveChannel);
router.put("/:channelId", auth, upload.single("profile_pic"), updateGroupDetails);
router.post("/:channelId/members", auth, addGroupMembers);
router.delete("/:channelId/members/:userId", auth, removeGroupMember);
router.get("/",auth,getChannels);
router.get("/:id",auth,getChannelById);

export default router;