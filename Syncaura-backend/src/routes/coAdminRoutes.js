import { Router } from 'express';

import { auth } from '../middlewares/auth.js';
import { permit } from '../middlewares/role.js';

import {
  createUserByCoAdmin,getAssignedUsers,getAssignedUser
} from '../controllers/coAdminController.js';

import {
  createUserByCoAdminValidator
} from '../validators/coAdminValidators.js';

import { requireAssignedUser } from '../middlewares/coAdminAuth.js';

const router = Router();

/**
 * Co-admin creates a normal user
 *
 * POST /api/co-admin/users
 */
router.post(
  '/users',
  auth,
  permit('co-admin'),
  createUserByCoAdminValidator,
  createUserByCoAdmin
);

router.get(
  '/users',
  auth,
  permit('co-admin'),
  getAssignedUsers
);

router.get(
  '/users/:userId',
  auth,
  permit('co-admin'),
  requireAssignedUser,
  getAssignedUser
);

export default router;