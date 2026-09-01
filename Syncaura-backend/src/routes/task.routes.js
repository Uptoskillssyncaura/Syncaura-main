import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getGanttData,
  getUpcomingReminders,
  addSubtask,
  updateSubtaskStatus,
  startTask,
  getTaskActivity,
} from "../controllers/task.controller.js";
import { auth } from "../middlewares/auth.js";
import { permit } from "../middlewares/role.js";
import ROLES from "../config/roles.js";
 
const router = express.Router();
 
// 1. Read Routes (Protected: Logged-in Users)
router.get("/gantt/data", auth, getGanttData);
router.get("/reminders/upcoming", auth, getUpcomingReminders);
router.get("/", auth, getAllTasks);
router.get("/:id", auth, getTaskById);
router.get("/:id/activity", auth, getTaskActivity);
 
// 2. User Actions (Protected: Logged-in Users)
router.patch("/:id/status", auth, updateTaskStatus);
router.patch("/:id/start", auth, startTask);
router.post("/:taskId/subtasks", auth, addSubtask);
router.patch("/:taskId/subtasks/:subtaskId/status", auth, updateSubtaskStatus);
 
// 3. Admin-Only Actions (Protected: Auth + RBAC Permit)
router.post("/", auth, permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), createTask);
router.put("/:id", auth, permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), updateTask);
router.delete("/:id", auth, permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), deleteTask);
 
export default router;