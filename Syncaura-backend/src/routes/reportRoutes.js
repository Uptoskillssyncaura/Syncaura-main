import express from "express";
const router = express.Router();
import { getTaskReport, getProjectProgress, getDocumentSummary } from "../controllers/reportController.js";
import { auth } from "../middlewares/auth.js";

// Protected route
router.get("/tasks", auth, getTaskReport);
router.get("/progress", auth, getProjectProgress);
router.get("/documents", auth, getDocumentSummary);
export default router;
