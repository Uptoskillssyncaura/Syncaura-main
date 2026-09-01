import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);

export default router;
