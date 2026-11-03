import express from 'express';
import { handleChat } from '../controllers/chatbotController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

// Protected chat route
router.post('/', auth, handleChat);

export default router;
