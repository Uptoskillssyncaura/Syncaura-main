import pool from '../config/db.js';

export const applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason, leaveType, type } = req.body;

    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({
        message: "fromDate, toDate and reason are required"
      });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({
        message: "Invalid date format. Use YYYY-MM-DD"
      });
    }

    const fromStr = String(fromDate).split('T')[0];
    const toStr = String(toDate).split('T')[0];

    if (toStr < fromStr) {
      return res.status(400).json({
        message: "toDate cannot be before fromDate"
      });
    }

    // Auto-create column if missing
    await pool.query("ALTER TABLE leaves ADD COLUMN IF NOT EXISTS leave_type VARCHAR(100) DEFAULT 'Casual Leave'").catch(() => {});

    // Check for overlapping leave requests for this user (excluding rejected ones)
    const overlapCheck = await pool.query(
      `SELECT id FROM leaves 
       WHERE user_id = $1 
         AND status != 'rejected'
         AND DATE(from_date) <= DATE($2) 
         AND DATE(to_date) >= DATE($3)`,
      [req.user.id, to, from]
    );

    if (overlapCheck.rowCount > 0) {
      return res.status(400).json({
        message: "You already have a leave request for this date range."
      });
    }

    const rawType = leaveType || type || 'Casual Leave';
    const lType = rawType.toLowerCase().endsWith("leave") || rawType.toLowerCase() === "work from home"
      ? rawType 
      : `${rawType} Leave`;

    const result = await pool.query(
      "INSERT INTO leaves (user_id, from_date, to_date, reason, leave_type, status) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *",
      [req.user.id, from, to, reason, lType]
    );

    // Fetch user details for instant frontend sync
    const userRes = await pool.query("SELECT name, email, profile_pic FROM users WHERE id = $1", [req.user.id]).catch(() => ({ rows: [] }));
    const userInfo = userRes.rows[0] || {};

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      data: {
        ...result.rows[0],
        user_name: userInfo.name || req.user.name || "Employee",
        user_email: userInfo.email || req.user.email,
        profile_pic: userInfo.profile_pic,
        leave_type: lType,
        type: lType,
      }
    });
  } catch (error) {
    console.error("Error applying leave:", error);
    res.status(500).json({ message: error.message || "Error applying leave" });
  }
};

export const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { fromDate, toDate, reason, leaveType, type } = req.body;

    const existingLeave = await pool.query("SELECT * FROM leaves WHERE id = $1", [id]);
    if (existingLeave.rowCount === 0) {
      return res.status(404).json({ message: "Leave not found" });
    }

    const leave = existingLeave.rows[0];

    // Only owner can edit their own leave
    if (leave.user_id !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own leave requests." });
    }

    // Can only edit if status is Pending
    if (String(leave.status).toLowerCase() !== 'pending') {
      return res.status(400).json({ message: "Cannot edit leave request once it has been approved or rejected." });
    }

    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "fromDate, toDate and reason are required" });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
    }

    const fromStr = String(fromDate).split('T')[0];
    const toStr = String(toDate).split('T')[0];

    if (toStr < fromStr) {
      return res.status(400).json({ message: "toDate cannot be before fromDate" });
    }

    // Check overlap excluding this leave
    const overlapCheck = await pool.query(
      `SELECT id FROM leaves 
       WHERE user_id = $1 
         AND id != $2
         AND status != 'rejected'
         AND DATE(from_date) <= DATE($3) 
         AND DATE(to_date) >= DATE($4)`,
      [req.user.id, id, to, from]
    );

    if (overlapCheck.rowCount > 0) {
      return res.status(400).json({
        message: "You already have a leave request for this date range."
      });
    }

    const rawType = leaveType || type || leave.leave_type || 'Casual Leave';
    const lType = rawType.toLowerCase().endsWith("leave") || rawType.toLowerCase() === "work from home"
      ? rawType 
      : `${rawType} Leave`;

    const result = await pool.query(
      `UPDATE leaves 
       SET from_date = $1, to_date = $2, reason = $3, leave_type = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [from, to, reason, lType, id]
    );

    const userRes = await pool.query("SELECT name, email, profile_pic FROM users WHERE id = $1", [req.user.id]).catch(() => ({ rows: [] }));
    const userInfo = userRes.rows[0] || {};

    res.status(200).json({
      success: true,
      message: "Leave request updated successfully",
      data: {
        ...result.rows[0],
        user_name: userInfo.name || req.user.name || "Employee",
        user_email: userInfo.email || req.user.email,
        profile_pic: userInfo.profile_pic,
        leave_type: lType,
        type: lType,
      }
    });
  } catch (error) {
    console.error("Error updating leave:", error);
    res.status(500).json({ message: error.message || "Error updating leave" });
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const existingLeave = await pool.query("SELECT * FROM leaves WHERE id = $1", [id]);
    if (existingLeave.rowCount === 0) {
      return res.status(404).json({ message: "Leave not found" });
    }

    const leave = existingLeave.rows[0];

    // Only owner can delete their own leave
    if (leave.user_id !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own leave requests." });
    }

    // Can only delete if status is Pending
    if (String(leave.status).toLowerCase() !== 'pending') {
      return res.status(400).json({ message: "Cannot delete leave request once it has been approved or rejected." });
    }

    await pool.query("DELETE FROM leaves WHERE id = $1", [id]);

    res.status(200).json({
      success: true,
      message: "Leave request deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting leave:", error);
    res.status(500).json({ message: error.message || "Error deleting leave" });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM leaves WHERE user_id = $1",
      [userId]
    );

    const totalLeaves = parseInt(totalResult.rows[0].count);

    const result = await pool.query(
      `SELECT l.*, COALESCE(l.leave_type, 'Casual Leave') AS leave_type, u.name AS user_name, u.email AS user_email, u.profile_pic
       FROM leaves l
       LEFT JOIN users u ON l.user_id = u.id
       WHERE l.user_id = $1
       ORDER BY l.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.status(200).json({
      leaves: result.rows,
      currentPage: page,
      totalPages: Math.ceil(totalLeaves / limit),
      totalLeaves,
    });

  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ message: "Error fetching leaves" });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM leaves"
    );

    const totalLeaves = parseInt(totalResult.rows[0].count);

    const result = await pool.query(
      `SELECT l.*, COALESCE(l.leave_type, 'Casual Leave') AS leave_type, u.name AS user_name, u.email AS user_email, u.profile_pic
       FROM leaves l
       LEFT JOIN users u ON l.user_id = u.id
       ORDER BY l.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.status(200).json({
      leaves: result.rows,
      currentPage: page,
      totalPages: Math.ceil(totalLeaves / limit),
      totalLeaves,
    });

  } catch (error) {
    console.error("Error fetching all leaves:", error);
    res.status(500).json({ message: "Error fetching leaves" });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const normalizedStatus = (status || "").toLowerCase();
    const validStatuses = ['pending', 'approved', 'rejected'];

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid status. Status must be 'pending', 'approved', or 'rejected'"
      });
    }

    const result = await pool.query(
      `UPDATE leaves 
       SET status = $1, reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [normalizedStatus, req.user.id, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.status(200).json({
      success: true,
      message: `Leave status updated to ${normalizedStatus}`,
      leave: result.rows[0]
    });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ message: "Error updating leave status" });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE leaves SET status = 'approved', reviewed_by = $1, reviewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [req.user.id, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.status(200).json({ success: true, message: "Leave approved successfully", leave: result.rows[0] });
  } catch (error) {
    console.error("Error approving leave:", error);
    res.status(500).json({ message: "Error approving leave" });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE leaves SET status = 'rejected', reviewed_by = $1, reviewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [req.user.id, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.status(200).json({ success: true, message: "Leave rejected successfully", leave: result.rows[0] });
  } catch (error) {
    console.error("Error rejecting leave:", error);
    res.status(500).json({ message: "Error rejecting leave" });
  }
};
