import express from 'express';
import { auth } from '../middlewares/auth.js';
import { getMyAttendance, checkIn, checkOut } from '../controllers/attendanceController.js';

const router = express.Router();

// All attendance routes are protected - employees can only access their own data
router.use(auth);

// Get personal attendance history and monthly summary
router.get('/my-attendance', getMyAttendance);

// Daily check-in and check-out endpoints
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);

export default router;
