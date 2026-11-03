import express from 'express';
import {auth} from '../middlewares/auth.js';
import { permit } from '../middlewares/role.js';
import ROLES from '../config/roles.js';

import {
  completionRate,
  burndownData,
  workload,
  myWorkload,
  projectHealth
} from '../controllers/dashboardController.js';

const router = express.Router();

/**
 * ADMIN + CO-ADMIN
 */
router.get(
  '/completion',
  auth,
  permit(ROLES.ADMIN, ROLES.CO_ADMIN),
  completionRate
);

router.get(
  '/burndown',
  auth,
  permit(ROLES.ADMIN, ROLES.CO_ADMIN),
  burndownData
);

router.get(
  '/workload',
  auth,
  permit(ROLES.ADMIN, ROLES.CO_ADMIN),
  workload
);

router.get(
  '/project-health/:projectId',
  auth,
  permit(ROLES.ADMIN, ROLES.CO_ADMIN),
  projectHealth
);

/**
 * USER
 */
router.get(
  '/my-workload',
  auth,
  permit(ROLES.USER, ROLES.ADMIN, ROLES.CO_ADMIN),
  myWorkload
);

export default router;
