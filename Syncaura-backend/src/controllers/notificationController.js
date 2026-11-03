import pool from '../config/db.js';
import { getUserNotifications, markAsRead, markAllAsRead, deleteNotification } from '../utils/notifications.js';

/**
 * Get notifications for current user
 */
export const getNotifications = async (req, res, next) => {
  try {
    const { limit = 20, page = 1, isRead } = req.query;
    
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      isRead: isRead ? isRead === 'true' : null
    };

    const { notifications, total } = await getUserNotifications(req.user.id, options);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread notifications count
 */
export const getUnreadCount = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM notifications WHERE recipient = $1 AND is_read = false",
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      unreadCount: parseInt(result.rows[0].count)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await markAsRead(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const result = await markAllAsRead(req.user.id);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      modifiedCount: result.rowCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete notification
 */
export const removeNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const checkResult = await pool.query("SELECT recipient FROM notifications WHERE id = $1", [id]);

    if (checkResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (checkResult.rows[0].recipient !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this notification'
      });
    }

    await deleteNotification(id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear all notifications for user
 */
export const clearAllNotifications = async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM notifications WHERE recipient = $1", [req.user.id]);

    res.status(200).json({
      success: true,
      message: 'All notifications cleared',
      deletedCount: result.rowCount
    });
  } catch (error) {
    next(error);
  }
};
