import { Router } from 'express';

import { auth } from '../middlewares/auth.js';
import { permit } from '../middlewares/role.js';

import { createCoAdmin ,createUser,assignCoAdminToUser} from '../controllers/adminController.js';

import {
  createCoAdminValidator,createUserValidator,assignCoAdminValidator
} from '../validators/adminValidators.js';

const router = Router();

/**
 * Admin creates Co-admin
 *
 * POST /admin/co-admins
 *
 * Authentication:
 * 1. auth    -> verifies JWT and loads req.user
 * 2. permit  -> checks req.user.role === 'admin'
 */
router.post(
  '/co-admins',
  auth,
  permit('admin'),
  createCoAdminValidator,
  createCoAdmin
);

router.post(
  '/users',
  auth,
  permit('admin'),
  createUserValidator,
  createUser
);

router.patch(
  '/users/:userId/co-admin',
  auth,
  permit('admin'),
  assignCoAdminValidator,
  assignCoAdminToUser
);

export default router;