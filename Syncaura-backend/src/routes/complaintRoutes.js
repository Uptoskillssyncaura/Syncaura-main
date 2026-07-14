import express from 'express';
import { auth } from '../middlewares/auth.js';
import { permit } from '../middlewares/role.js';
import ROLES from '../config/roles.js';
import {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  addComment,
  updateComplaint,
  deleteComplaint,
  getComplaintStats
} from '../controllers/complaintController.js';

const router = express.Router();

// All routes require authentication2
router.use(auth);

/**
 * Public routes (all authenticated users)
 */
// Get complaint statistics
router.get('/stats', permit(ROLES.ADMIN, ROLES.CO_ADMIN), getComplaintStats);
// File a new complaint
router.post('/', createComplaint);

// Get complaints filed by current user
router.get('/my-complaints', getMyComplaints);

// Get single complaint (with authorization check)
router.get('/:id', getComplaintById);

// Add comment to complaint
router.post('/:id/comments', addComment);

/**
 * Admin/Co-admin only routes
 */

// Get all complaints with filters
router.get('/', permit(ROLES.ADMIN, ROLES.CO_ADMIN), getAllComplaints);

// Update complaint status
router.patch('/:id/status', permit(ROLES.ADMIN, ROLES.CO_ADMIN), updateComplaintStatus);

// Assign complaint to handler
router.patch('/:id/assign', permit(ROLES.ADMIN, ROLES.CO_ADMIN), assignComplaint);

// Update complaint details
router.patch('/:id', permit(ROLES.ADMIN, ROLES.CO_ADMIN), updateComplaint);

// Delete complaint
router.delete('/:id', permit(ROLES.ADMIN, ROLES.CO_ADMIN), deleteComplaint);



export default router;
