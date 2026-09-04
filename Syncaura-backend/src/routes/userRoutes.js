import { Router } from 'express';

import { auth } from '../middlewares/auth.js';
import { permit } from '../middlewares/role.js';
import { requireSelf } from '../middlewares/userAuth.js';
import { getUser } from '../controllers/userController.js';

const router = Router();
import { getAllUsers } from '../controllers/userController.js';

router.get('/all', auth, getAllUsers);

router.get(
  '/:userId',
  auth,
  permit('user'),
  requireSelf,
  getUser
);

export default router;