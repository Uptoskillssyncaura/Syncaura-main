import express from 'express';
import { auth } from '../middlewares/auth.js';
import { permit } from '../middlewares/role.js';
import ROLES from '../config/roles.js';
import {
  applyLeave,
  updateLeave,
  deleteLeave,
  getMyLeaves,
  getAllLeaves,
  getLeaveBalance,
  approveLeave, 
  rejectLeave,
  updateLeaveStatus,
} from '../controllers/leaveController.js';

const router = express.Router();

// Apply a new leave request (all authenticated roles)
router.post('/applyleave', auth, applyLeave);

// Get my leave balance
router.get('/balance', auth, getLeaveBalance);

// Get my leaves (regular user / employee)
router.get('/myleaves', auth, getMyLeaves);

// Get all leaves (Admin and Co-Admin only)
router.get('/allleaves', auth, permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), getAllLeaves);

// Update/Edit own pending leave (only applicant, only when pending)
router.put('/:id', auth, updateLeave);

// Delete own pending leave (only applicant, only when pending)
router.delete('/:id', auth, deleteLeave);

// Update status of leave (Admin and Co-Admin only)
router.put('/:id/status', auth, permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), updateLeaveStatus);
router.put('/:id/approve', auth, permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), approveLeave);
router.put('/:id/reject', auth, permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), rejectLeave);

export default router;
