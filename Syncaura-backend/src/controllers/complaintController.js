import pool from '../config/db.js';
import ROLES from '../config/roles.js';
import {
  notifyAdminsAboutComplaint,
  notifyUserAboutComplaint,
  createNotification
} from '../utils/notifications.js';

/**
 * Create a new complaint
 */
export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, severity, priority, isAnonymous, attachments = [] } = req.body || {};

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO complaints (
        title, description, category, severity, priority, is_anonymous, filed_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        title, 
        description, 
        category, 
        severity || 'medium', 
        priority || 'normal', 
        isAnonymous || false, 
        req.user.id
      ]
    );

    const complaint = result.rows[0];

    // Handle attachments
    const attachmentUrls = req.files?.map((file) => `/uploads/${file.filename}`)
      || (Array.isArray(attachments) ? attachments : []);

    if (attachmentUrls.length) {
      for (const url of attachmentUrls) {
        await pool.query(
          "INSERT INTO complaint_attachments (complaint_id, file_url) VALUES ($1, $2)",
          [complaint.id, url]
        );
      }
      complaint.attachments = attachmentUrls;
    }

    // Notify admins about new complaint
    try {
      await notifyAdminsAboutComplaint(complaint, 'created');
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    res.status(201).json({
      success: true,
      message: 'Complaint filed successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all complaints with filters
 */
export const getAllComplaints = async (req, res, next) => {
  try {
    const { status, category, severity, priority, limit = 20, page = 1 } = req.query;

    let query = "SELECT c.*, u.name as filer_name, u.email as filer_email FROM complaints c JOIN users u ON c.filed_by = u.id WHERE 1=1";
    let params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND c.status = $${paramCount++}`;
      params.push(status);
    }
    if (category) {
      query += ` AND c.category = $${paramCount++}`;
      params.push(category);
    }
    if (severity) {
      query += ` AND c.severity = $${paramCount++}`;
      params.push(severity);
    }
    if (priority) {
      query += ` AND c.priority = $${paramCount++}`;
      params.push(priority);
    }

    const skip = (page - 1) * limit;
    query += ` ORDER BY c.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(limit, skip);

    const result = await pool.query(query, params);
    
    const totalResult = await pool.query("SELECT COUNT(*) FROM complaints");
    const total = parseInt(totalResult.rows[0].count);

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaints filed by current user
 */
export const getMyComplaints = async (req, res, next) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;

    let query = "SELECT * FROM complaints WHERE filed_by = $1";
    let params = [req.user.id];

    if (status) {
      query += " AND status = $2";
      params.push(status);
    }

    const skip = (page - 1) * limit;
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, skip);

    const result = await pool.query(query, params);
    
    const totalResult = await pool.query("SELECT COUNT(*) FROM complaints WHERE filed_by = $1", [req.user.id]);
    const total = parseInt(totalResult.rows[0].count);

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single complaint by ID
 */
export const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT c.*, 
        u.name as filer_name, u.email as filer_email, u.role as filer_role,
        a.name as handler_name, a.email as handler_email, a.role as handler_role
       FROM complaints c 
       LEFT JOIN users u ON c.filed_by = u.id 
       LEFT JOIN users a ON c.assigned_to = a.id
       WHERE c.id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    const complaint = result.rows[0];

    // Authorization
    if (req.user.role !== ROLES.ADMIN && req.user.role !== ROLES.CO_ADMIN) {
      if (complaint.filed_by !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view this complaint'
        });
      }
    }

    // Get comments
    const commentsResult = await pool.query(
      "SELECT cc.*, u.name as user_name FROM complaint_comments cc JOIN users u ON cc.user_id = u.id WHERE cc.complaint_id = $1 ORDER BY cc.created_at ASC",
      [id]
    );
    complaint.comments = commentsResult.rows;

    // Get attachments
    const attachmentsResult = await pool.query(
      "SELECT * FROM complaint_attachments WHERE complaint_id = $1",
      [id]
    );
    complaint.attachments = attachmentsResult.rows;

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update complaint status
 */
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, resolution } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const updateResult = await pool.query(
      `UPDATE complaints SET 
        status = $1, 
        resolution = COALESCE($2, resolution),
        resolved_at = CASE WHEN $1 IN ('resolved', 'closed') THEN CURRENT_TIMESTAMP ELSE resolved_at END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 RETURNING *`,
      [status, resolution || null, req.params.id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const complaint = updateResult.rows[0];

    // Notify user
    try {
      await notifyUserAboutComplaint(complaint.filed_by, complaint, 'status_updated');
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Assign complaint to a handler
 */
export const assignComplaint = async (req, res, next) => {
  try {
    const { assignedToId } = req.body;

    const userResult = await pool.query("SELECT id FROM users WHERE id = $1", [assignedToId]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Handler not found' });
    }

    const result = await pool.query(
      "UPDATE complaints SET assigned_to = $1, status = 'in-progress', updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [assignedToId, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const complaint = result.rows[0];

    try {
      await notifyUserAboutComplaint(complaint.filed_by, complaint, 'assigned');
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Complaint assigned successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add comment to complaint
 */
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const complaintResult = await pool.query("SELECT * FROM complaints WHERE id = $1", [req.params.id]);
    if (complaintResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const complaint = complaintResult.rows[0];

    // Authorization
    const isAdmin = req.user.role === ROLES.ADMIN || req.user.role === ROLES.CO_ADMIN;
    const isFiler = complaint.filed_by === req.user.id;

    if (!isAdmin && !isFiler) {
      return res.status(403).json({ success: false, message: 'You are not authorized' });
    }

    const commentResult = await pool.query(
      "INSERT INTO complaint_comments (complaint_id, user_id, text) VALUES ($1, $2, $3) RETURNING *",
      [req.params.id, req.user.id, text.trim()]
    );

    // Notify
    try {
      if (isFiler && !isAdmin) {
        const adminsResult = await pool.query("SELECT id FROM users WHERE role IN ('admin', 'co-admin')");
        const adminIds = adminsResult.rows.map(a => a.id);
        
        await createNotification({
          type: 'complaint_commented',
          title: `Comment on Complaint: ${complaint.title}`,
          message: `The complaint filer has commented on: "${complaint.title}"`,
          recipients: adminIds,
          relatedEntity: {
            entityType: 'complaint',
            entityId: complaint.id
          },
          actionUrl: `/complaints/${complaint.id}`
        });
      } else {
        await notifyUserAboutComplaint(complaint.filed_by, complaint, 'commented');
      }
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: commentResult.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update complaint
 */
export const updateComplaint = async (req, res, next) => {
  try {
    const { title, description, category, severity, priority, status } = req.body;

    const result = await pool.query(
      `UPDATE complaints SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        severity = COALESCE($4, severity),
        priority = COALESCE($5, priority),
        status = CASE WHEN $7 IN ('admin', 'co-admin') AND $6 IS NOT NULL THEN $6 ELSE status END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 RETURNING *`,
      [title, description, category, severity, priority, status, req.user.role, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete complaint
 */
export const deleteComplaint = async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM complaints WHERE id = $1 RETURNING *", [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({ success: true, message: 'Complaint deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaint statistics
 */
export const getComplaintStats = async (req, res, next) => {
  try {
    const totalRes = await pool.query("SELECT COUNT(*) FROM complaints");
    const byStatus = await pool.query("SELECT status as _id, COUNT(*) as count FROM complaints GROUP BY status");
    const byCategory = await pool.query("SELECT category as _id, COUNT(*) as count FROM complaints GROUP BY category");
    const bySeverity = await pool.query("SELECT severity as _id, COUNT(*) as count FROM complaints GROUP BY severity");

    res.status(200).json({
      success: true,
      data: {
        total: parseInt(totalRes.rows[0].count),
        byStatus: byStatus.rows,
        byCategory: byCategory.rows,
        bySeverity: bySeverity.rows
      }
    });
  } catch (error) {
    next(error);
  }
};
