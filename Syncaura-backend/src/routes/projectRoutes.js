import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  archiveProject,
  restoreProject,
} from "../controllers/projectController.js";
import { auth } from "../middlewares/auth.js";
import { permit } from "../middlewares/role.js";
import ROLES from "../config/roles.js";

const router = express.Router();

// Protected routes
// Only admin and co-admin can create, modify, or delete projects; normal users cannot
router.post("/", auth, permit(ROLES.ADMIN, ROLES.CO_ADMIN, "coadmin"), createProject);
router.get("/", auth, getAllProjects);
router.get("/:id", auth, getProjectById);
router.put("/:id", auth, permit(ROLES.ADMIN, ROLES.CO_ADMIN, "coadmin"), updateProject);
router.delete("/:id", auth, permit(ROLES.ADMIN, ROLES.CO_ADMIN, "coadmin"), deleteProject);
router.patch("/:id/archive", auth, permit(ROLES.ADMIN, ROLES.CO_ADMIN, "coadmin"), archiveProject);
router.patch("/:id/restore", auth, permit(ROLES.ADMIN, ROLES.CO_ADMIN, "coadmin"), restoreProject);

export default router;
