import express from 'express';
import { auth } from '../middlewares/auth.js';
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearAllNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get notifications for current user
router.get('/', getNotifications);

// Get unread notifications count
router.get('/unread/count', getUnreadCount);

// Mark notification as read
router.patch('/:id/read', markNotificationAsRead);

// Mark all as read
router.patch('/mark-all-read', markAllNotificationsAsRead);

// Delete notification
router.delete('/:id', removeNotification);

// Clear all notifications
router.delete('/', clearAllNotifications);

export default router;
