import pool from '../config/db.js';
import { getIO } from '../config/socket.js';

/**
 * Create and send a notification to users
 */
export const createNotification = async (notificationData) => {
  try {
    const {
      type,
      title,
      message,
      recipients,
      relatedEntity,
      actionUrl = null,
      data = null
    } = notificationData;

    // Handle both single recipient and array of recipients
    const recipientArray = Array.isArray(recipients) ? recipients : [recipients];
    const io = getIO();

    const notifications = await Promise.all(
      recipientArray.map(async (recipientId) => {
        const result = await pool.query(
          `INSERT INTO notifications (
            recipient, type, title, message, entity_type, entity_id, action_url, data
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [
            recipientId, 
            type, 
            title, 
            message, 
            relatedEntity?.entityType || null, 
            relatedEntity?.entityId || null, 
            actionUrl, 
            data ? JSON.stringify(data) : null
          ]
        );
        const createdNotif = result.rows[0];

        // Real-time socket delivery
        if (io && recipientId) {
          try {
            io.to(`user_${recipientId}`).emit("notification:new", createdNotif);
          } catch (emitErr) {
            console.warn("Socket notification emit failed:", emitErr.message);
          }
        }

        return createdNotif;
      })
    );

    return notifications;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Get notifications for a user
 */
export const getUserNotifications = async (userId, options = {}) => {
  try {
    const { limit = 20, skip = 0, isRead = null } = options;
    
    let query = "SELECT * FROM notifications WHERE recipient = $1";
    let params = [userId];

    if (isRead !== null) {
      query += " AND is_read = $2";
      params.push(isRead);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, skip);

    const result = await pool.query(query, params);
    
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM notifications WHERE recipient = $1" + (isRead !== null ? " AND is_read = $2" : ""),
      isRead !== null ? [userId, isRead] : [userId]
    );

    return { 
      notifications: result.rows, 
      total: parseInt(countResult.rows[0].count) 
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId) => {
  try {
    const result = await pool.query(
      "UPDATE notifications SET is_read = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [notificationId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (userId) => {
  try {
    const result = await pool.query(
      "UPDATE notifications SET is_read = true, updated_at = CURRENT_TIMESTAMP WHERE recipient = $1 AND is_read = false",
      [userId]
    );
    return result;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    const result = await pool.query(
      "DELETE FROM notifications WHERE id = $1 RETURNING *",
      [notificationId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Notify admins about complaint status
 */
export const notifyAdminsAboutComplaint = async (complaint, eventType) => {
  try {
    const adminsResult = await pool.query("SELECT id FROM users WHERE role IN ('admin', 'co-admin')");
    const adminIds = adminsResult.rows.map(admin => admin.id);

    let title, message;

    switch (eventType) {
      case 'created':
        title = `New Complaint: ${complaint.title}`;
        message = `A new complaint has been filed - ${complaint.category} (${complaint.severity})`;
        break;
      case 'status_updated':
        title = `Complaint Status Updated: ${complaint.title}`;
        message = `Complaint status changed to: ${complaint.status}`;
        break;
      case 'assigned':
        title = `Complaint Assigned: ${complaint.title}`;
        message = `A complaint has been assigned to a handler`;
        break;
      default:
        title = `Complaint Update: ${complaint.title}`;
        message = `There is an update on complaint: ${complaint.title}`;
    }

    const notifications = await createNotification({
      type: `complaint_${eventType}`,
      title,
      message,
      recipients: adminIds,
      relatedEntity: {
        entityType: 'complaint',
        entityId: complaint.id
      },
      actionUrl: `/complaints/${complaint.id}`,
      data: { complaintId: complaint.id, eventType }
    });

    return notifications;
  } catch (error) {
    console.error('Error notifying admins about complaint:', error);
    throw error;
  }
};

/**
 * Notify user about complaint updates
 */
export const notifyUserAboutComplaint = async (userId, complaint, eventType) => {
  try {
    let title, message;

    switch (eventType) {
      case 'assigned':
        title = 'Your Complaint Has Been Assigned';
        message = `Your complaint "${complaint.title}" has been assigned to a handler`;
        break;
      case 'status_updated':
        title = 'Your Complaint Status Updated';
        message = `Your complaint "${complaint.title}" status is now: ${complaint.status}`;
        break;
      case 'commented':
        title = 'New Comment on Your Complaint';
        message = `Someone has commented on your complaint: "${complaint.title}"`;
        break;
      default:
        title = 'Complaint Update';
        message = `There is an update on your complaint: "${complaint.title}"`;
    }

    const notifications = await createNotification({
      type: `complaint_${eventType}`,
      title,
      message,
      recipients: userId,
      relatedEntity: {
        entityType: 'complaint',
        entityId: complaint.id
      },
      actionUrl: `/complaints/${complaint.id}`,
      data: { complaintId: complaint.id, eventType }
    });

    return notifications;
  } catch (error) {
    console.error('Error notifying user about complaint:', error);
    throw error;
  }
};

/**
 * Notify all users about new notice
 */
export const notifyAllUsersAboutNotice = async (notice) => {
  try {
    const usersResult = await pool.query("SELECT id FROM users WHERE is_active = true");
    const userIds = usersResult.rows.map(user => user.id);

    const notifications = await createNotification({
      type: 'notice_created',
      title: `New Notice: ${notice.title}`,
      message: notice.description.substring(0, 100) + '...',
      recipients: userIds,
      relatedEntity: {
        entityType: 'notice',
        entityId: notice.id
      },
      actionUrl: `/notices/${notice.id}`,
      data: { noticeId: notice.id }
    });

    return notifications;
  } catch (error) {
    console.error('Error notifying users about notice:', error);
    throw error;
  }
};
