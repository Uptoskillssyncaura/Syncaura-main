import express from "express";
import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
  downloadAttachment,
  viewAttachment,
  deleteAttachment
} from "../controllers/notice.controller.js";

import {auth} from "../middlewares/auth.js"; // existing authentication middleware
import { permit } from "../middlewares/role.js"; // restrict access to admin/coadmin
import upload from "../middlewares/upload.js";   // Multer middleware


const router = express.Router();

// View all notices (any authenticated user)
router.get("/", auth, getAllNotices);


 //Create a new notice (admin/coadmin only)
// router.post("/", auth, roleCheck, createNotice);

// //Update a notice (admin/coadmin only)
// router.put("/:id", auth, roleCheck, updateNotice);

//  //Delete a notice (admin/coadmin only)
//  router.delete("/:id", auth, roleCheck, deleteNotice);

// Get a specific notice by ID (any authenticated user)
router.get("/:id", auth, getNoticeById);

// Create a new notice (admin/coadmin only, with attachments)
router.post("/", auth, permit('admin', 'co-admin'), upload.array("attachments", 5), createNotice);

// Update a notice (admin/coadmin only, can add attachments)
router.put("/:id", auth, permit('admin', 'co-admin'), upload.array("attachments", 5), updateNotice);

// Delete a notice (admin/coadmin only, deletes notice + attachments)
router.delete("/:id", auth, permit('admin', 'co-admin'), deleteNotice);

// View/Stream a specific attachment in browser (any authenticated user)
router.get("/:id/attachments/:fileName/view", auth, viewAttachment);

// Download a specific attachment (any authenticated user)
router.get("/:id/attachments/:fileName/download", auth, downloadAttachment);

// Delete a specific attachment (admin/coadmin only)
router.delete("/:id/attachments/:fileName", auth, permit('admin', 'co-admin'), deleteAttachment);


export default router;
