import pool from "../config/db.js";
import { notifyAllUsersAboutNotice } from "../utils/notifications.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
// CREATE notice with attachments
export const createNotice = async (req, res) => {
  try {
    const { title, description, category, created_by } = req.body;
    const authorName = req.user?.name || created_by || 'Admin';
    const authorId = req.user?.id || null;
    const normCategory = (category || 'GENERAL').toUpperCase();

    const result = await pool.query(
      "INSERT INTO notices (title, description, category, created_by, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, normCategory, authorName, authorId]
    );

    const notice = result.rows[0];

    // Prepare attachments
    const files = req.files?.map(file => ({
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`
    })) || [];

    for (const file of files) {
      await pool.query(
        "INSERT INTO notice_attachments (notice_id, file_name, file_url) VALUES ($1, $2, $3)",
        [notice.id, file.fileName, file.fileUrl]
      );
    }
    notice.attachments = files;

    // Send notifications
    try {
      await notifyAllUsersAboutNotice(notice);
    } catch (notificationError) {
      console.error("Notification error:", notificationError);
    }

    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    // Cleanup
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, "../../public/uploads", file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all notices
export const getAllNotices = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT n.*, u.name AS creator_user_name, u.role AS creator_user_role 
      FROM notices n 
      LEFT JOIN users u ON n.creator_id = u.id 
      ORDER BY n.created_at DESC
    `);
    const notices = result.rows;

    for (let notice of notices) {
      const attachmentsResult = await pool.query(
        "SELECT * FROM notice_attachments WHERE notice_id = $1",
        [notice.id]
      );
      notice.attachments = attachmentsResult.rows;
    }

    res.status(200).json({ success: true, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single notice by ID
export const getNoticeById = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT n.*, u.name AS creator_user_name, u.role AS creator_user_role 
      FROM notices n 
      LEFT JOIN users u ON n.creator_id = u.id 
      WHERE n.id = $1
    `, [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    const notice = result.rows[0];
    const attachmentsResult = await pool.query(
      "SELECT * FROM notice_attachments WHERE notice_id = $1",
      [notice.id]
    );
    notice.attachments = attachmentsResult.rows;

    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE notice
export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;
    const normCategory = category ? category.toUpperCase() : null;

    // Check notice exists and ownership
    const existingNoticeRes = await pool.query("SELECT * FROM notices WHERE id = $1", [id]);
    if (existingNoticeRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }
    const existingNotice = existingNoticeRes.rows[0];

    const userRole = String(req.user?.role || "").toLowerCase();
    const isAdmin = userRole === "admin";
    const isCoAdmin = userRole === "co-admin" || userRole === "coadmin";

    // Co-admin can only edit notices they published
    if (!isAdmin && isCoAdmin) {
      if (existingNotice.creator_id && existingNotice.creator_id !== req.user?.id) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only edit notices that you published."
        });
      }
    }

    const result = await pool.query(
      "UPDATE notices SET title = COALESCE($1, title), description = COALESCE($2, description), category = COALESCE($3, category), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [title, description, normCategory, id]
    );

    const notice = result.rows[0];

    // Add new attachments
    const files = req.files?.map(file => ({
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`
    })) || [];

    for (const file of files) {
      await pool.query(
        "INSERT INTO notice_attachments (notice_id, file_name, file_url) VALUES ($1, $2, $3)",
        [id, file.fileName, file.fileUrl]
      );
    }

    const attachmentsResult = await pool.query("SELECT * FROM notice_attachments WHERE notice_id = $1", [id]);
    notice.attachments = attachmentsResult.rows;

    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../../public/uploads', file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// VIEW/STREAM attachment
export const viewAttachment = async (req, res) => {
  try {
    const { id, fileName } = req.params;
    const result = await pool.query(
      "SELECT * FROM notice_attachments WHERE notice_id = $1 AND file_name = $2",
      [id, fileName]
    );
 
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Attachment not found" });
    }
 
    const attachment = result.rows[0];
    const filePath = path.join(__dirname, '../../public', attachment.file_url);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found on server" });
    }
 
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.txt': 'text/plain',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    const ext = path.extname(attachment.file_name).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
 
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${attachment.file_name}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// DOWNLOAD attachment
export const downloadAttachment = async (req, res) => {
  try {
    const { id, fileName } = req.params;
    const result = await pool.query(
      "SELECT * FROM notice_attachments WHERE notice_id = $1 AND file_name = $2",
      [id, fileName]
    );
 
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Attachment not found" });
    }
 
    const attachment = result.rows[0];
    const filePath = path.join(__dirname, '../../public', attachment.file_url);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found on server" });
    }
 
    res.download(filePath, attachment.file_name);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// DELETE specific attachment
export const deleteAttachment = async (req, res) => {
  try {
    const { id, fileName } = req.params;
    
    const result = await pool.query(
      "DELETE FROM notice_attachments WHERE notice_id = $1 AND file_name = $2 RETURNING *",
      [id, fileName]
    );
 
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Attachment not found" });
    }
 
    const attachment = result.rows[0];
    const filePath = path.join(__dirname, '../../public', attachment.file_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
 
    res.json({ success: true, message: "Attachment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// DELETE notice
export const deleteNotice = async (req, res) => {
  try {
    const existingNoticeRes = await pool.query("SELECT * FROM notices WHERE id = $1", [req.params.id]);
    if (existingNoticeRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }
    const existingNotice = existingNoticeRes.rows[0];

    const userRole = String(req.user?.role || "").toLowerCase();
    const isAdmin = userRole === "admin";
    const isCoAdmin = userRole === "co-admin" || userRole === "coadmin";

    // Co-admin can only delete notices they published
    if (!isAdmin && isCoAdmin) {
      if (existingNotice.creator_id && existingNotice.creator_id !== req.user?.id) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only delete notices that you published."
        });
      }
    }

    const attachmentsResult = await pool.query("SELECT * FROM notice_attachments WHERE notice_id = $1", [req.params.id]);
    
    await pool.query("DELETE FROM notices WHERE id = $1", [req.params.id]);

    // Cleanup files
    attachmentsResult.rows.forEach(att => {
      const filePath = path.join(__dirname, '../../public', att.file_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    res.status(200).json({ success: true, message: "Notice and attachments deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};