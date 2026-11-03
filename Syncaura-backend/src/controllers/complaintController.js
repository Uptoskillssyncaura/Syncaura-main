import pool from '../config/db.js';
import ROLES from '../config/roles.js';
import { validate as isUUID } from 'uuid';
import {
  notifyAdminsAboutComplaint,
  notifyUserAboutComplaint,
} from '../utils/notifications.js';

/**
 * Create a new complaint / issue
 */
export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, severity, priority, isAnonymous, attachments = [], taskId, task_id } = req.body || {};

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }

    const resolvedTaskId = (taskId || task_id) && isUUID(String(taskId || task_id)) ? String(taskId || task_id) : null;

    const result = await pool.query(
      `INSERT INTO complaints (
        title, description, category, severity, priority, is_anonymous, filed_by, status, task_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'open', $8) RETURNING *`,
      [
        title, 
        description, 
        category, 
        severity || 'medium', 
        priority || 'normal', 
        isAnonymous || false, 
        req.user.id,
        resolvedTaskId
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
      complaint.attachments = attachmentUrls.map(u => ({ file_url: u }));
    } else {
      complaint.attachments = [];
    }

    // Attach user details
    complaint.filer_name = req.user.name || "Employee";
    complaint.filer_email = req.user.email;

    if (resolvedTaskId) {
      const tRes = await pool.query("SELECT title FROM tasks WHERE id = $1", [resolvedTaskId]);
      if (tRes.rowCount > 0) {
        complaint.task_title = tRes.rows[0].title;
      }
    }

    // Notify admins about new complaint
    try {
      await notifyAdminsAboutComplaint(complaint, 'created');
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    res.status(201).json({
      success: true,
      message: 'Issue filed successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all complaints with filters (Admin and Co-Admin only)
 */
export const getAllComplaints = async (req, res, next) => {
  try {
    const { status, category, severity, priority, limit = 50, page = 1 } = req.query;

    let query = `
      SELECT 
        c.*, 
        u.name as filer_name, 
        u.email as filer_email,
        u.name as user_name,
        u.email as user_email,
        u.name as name,
        u.email as email,
        t.title as task_title,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ca.id,
              'file_url', ca.file_url
            )
          ) FILTER (WHERE ca.id IS NOT NULL),
          '[]'
        ) AS attachments
      FROM complaints c 
      LEFT JOIN users u ON c.filed_by = u.id 
      LEFT JOIN tasks t ON c.task_id = t.id
      LEFT JOIN complaint_attachments ca ON c.id = ca.complaint_id
      WHERE 1=1
    `;
    let params = [];
    let paramCount = 1;

    if (status && status !== 'all') {
      query += ` AND LOWER(c.status) = $${paramCount++}`;
      params.push(status.toLowerCase().replace(" ", "-"));
    }
    if (category && category !== 'all') {
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
    query += `
      GROUP BY c.id, u.name, u.email, t.title
      ORDER BY c.created_at DESC
      LIMIT $${paramCount++} OFFSET $${paramCount++}
    `;
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
    const { status, limit = 50, page = 1 } = req.query;

    let query = `
      SELECT 
        c.*,
        u.name as filer_name,
        u.email as filer_email,
        u.name as user_name,
        u.email as user_email,
        u.name as name,
        u.email as email,
        t.title as task_title,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ca.id,
              'file_url', ca.file_url
            )
          ) FILTER (WHERE ca.id IS NOT NULL),
          '[]'
        ) AS attachments
      FROM complaints c
      LEFT JOIN users u ON c.filed_by = u.id
      LEFT JOIN tasks t ON c.task_id = t.id
      LEFT JOIN complaint_attachments ca
        ON c.id = ca.complaint_id
      WHERE c.filed_by = $1
    `;

    let params = [req.user.id];

    if (status && status !== 'all') {
      query += " AND LOWER(c.status) = $2";
      params.push(status.toLowerCase().replace(" ", "-"));
    }

    const skip = (page - 1) * limit;

    query += `
      GROUP BY c.id, u.name, u.email, t.title
      ORDER BY c.created_at DESC
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `;

    params.push(limit, skip);

    const result = await pool.query(query, params);

    const totalQuery = `
      SELECT COUNT(*)
      FROM complaints
      WHERE filed_by = $1
      ${status && status !== 'all' ? "AND LOWER(status) = $2" : ""}
    `;

    const totalParams = status && status !== 'all'
      ? [req.user.id, status.toLowerCase().replace(" ", "-")]
      : [req.user.id];

    const totalResult = await pool.query(totalQuery, totalParams);
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
        u.name as user_name, u.email as user_email, u.name as name, u.email as email,
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

    const userRole = (req.user?.role || "").toLowerCase();
    const isAdmin = userRole === "admin" || userRole === "co-admin" || userRole === "coadmin";

    // Authorization
    if (!isAdmin && complaint.filed_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this complaint'
      });
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
 * Update complaint status (Admin and Co-Admin only)
 */
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, resolution } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const normalizedStatus = status.toLowerCase().replace(" ", "-");
    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed statuses: 'open', 'in-progress', 'resolved', 'closed'"
      });
    }

    const updateResult = await pool.query(
      `UPDATE complaints SET 
        status = $1::varchar, 
        resolution = COALESCE($2, resolution),
        resolved_at = CASE 
          WHEN $1::varchar IN ('resolved', 'closed') 
          THEN CURRENT_TIMESTAMP 
          ELSE resolved_at 
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 
      RETURNING *`,
      [normalizedStatus, resolution || null, req.params.id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Fetch full complaint with user details
    const complaintRes = await pool.query(
      `SELECT c.*, u.name as filer_name, u.email as filer_email 
       FROM complaints c 
       LEFT JOIN users u ON c.filed_by = u.id 
       WHERE c.id = $1`,
      [req.params.id]
    );

    const complaint = complaintRes.rows[0] || updateResult.rows[0];

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
 * Assign complaint to handler
 */
export const assignComplaint = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    const updateResult = await pool.query(
      `UPDATE complaints SET 
        assigned_to = $1, 
        status = CASE WHEN status = 'open' THEN 'in-progress' ELSE status END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 RETURNING *`,
      [assignedTo, req.params.id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint assigned successfully',
      data: updateResult.rows[0]
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
    const { text, isInternal = false } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const complaintResult = await pool.query(
      "SELECT * FROM complaints WHERE id = $1",
      [req.params.id]
    );

    if (complaintResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const result = await pool.query(
      `INSERT INTO complaint_comments (complaint_id, user_id, comment, is_internal)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.id, req.user.id, text, isInternal]
    );

    const comment = result.rows[0];
    comment.user_name = req.user.name || "User";

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update complaint details
 */
export const updateComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, severity } = req.body;

    const result = await pool.query(
      `UPDATE complaints SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        priority = COALESCE($4, priority),
        severity = COALESCE($5, severity),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [title, description, category, priority, severity, req.params.id]
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
    const result = await pool.query(
      "DELETE FROM complaints WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaint statistics
 */
export const getComplaintStats = async (req, res, next) => {
  try {
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed
      FROM complaints
    `);

    res.status(200).json({
      success: true,
      data: statsResult.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
