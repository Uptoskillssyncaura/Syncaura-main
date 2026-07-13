import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectHealth
} from "../controllers/projectController.js";

import { auth } from "../middlewares/auth.js";

const router = express.Router();

// Protected routes
router.post("/", auth, createProject);
router.get("/", auth, getAllProjects);

// Project Health Score
router.get("/:id/health", auth, getProjectHealth);

router.get("/:id", auth, getProjectById);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);

export default router;