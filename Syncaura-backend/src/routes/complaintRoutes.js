import express from 'express';
import { auth } from '../middlewares/auth.js';
import { permit } from '../middlewares/role.js';
import ROLES from '../config/roles.js';
import upload from '../middlewares/upload.js';
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

// All routes require authentication
router.use(auth);

// Get complaint statistics (Admin / Co-Admin)
router.get('/stats', permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), getComplaintStats);

// File a new complaint (all authenticated users)
router.post('/', upload.array('attachments', 5), createComplaint);

// Get complaints filed by current user (regular users)
router.get('/my-complaints', getMyComplaints);

// Get single complaint (filer or Admin/Co-Admin)
router.get('/:id', getComplaintById);

// Add comment to complaint
router.post('/:id/comments', addComment);

// Get all complaints with filters (Admin / Co-Admin only)
router.get('/', permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), getAllComplaints);

// Update complaint status (Admin / Co-Admin only)
router.patch('/:id/status', permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), updateComplaintStatus);

// Assign complaint to handler (Admin / Co-Admin only)
router.patch('/:id/assign', permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), assignComplaint);

// Update complaint details (Admin / Co-Admin only)
router.patch('/:id', permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), updateComplaint);

// Delete complaint (Admin / Co-Admin only)
router.delete('/:id', permit(ROLES.ADMIN, ROLES.CO_ADMIN, 'coadmin'), deleteComplaint);

export default router;
