import express from 'express';
import { auth } from '../middlewares/auth.js';
import { permit } from '../middlewares/role.js';
import ROLES from '../config/roles.js';
import {
  getMyAttendance,
  getAllEmployeesAttendance,
  checkIn,
  checkOut,
} from '../controllers/attendanceController.js';

const router = express.Router();

// All attendance routes are protected
router.use(auth);

// Get all employees attendance for date (Admin and Co-Admin only)
router.get('/all', permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), getAllEmployeesAttendance);

// Get personal attendance history and monthly summary
router.get('/my-attendance', getMyAttendance);

// Daily check-in and check-out endpoints
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);

export default router;

