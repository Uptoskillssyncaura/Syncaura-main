import pool from '../config/db.js';

/**
 * Allows a co-admin to access only a user assigned to them.
 *
 * Expected route:
 * /users/:userId
 */
export const requireAssignedUser = async (req, res, next) => {
  try {
    // ---------------------------------------
    // 1. Make sure authenticated user exists
    // ---------------------------------------
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    // ---------------------------------------
    // 2. Only co-admin can use this middleware
    // ---------------------------------------
    if (req.user.role !== 'co-admin') {
      return res.status(403).json({
        message: 'Forbidden: Co-admin access required'
      });
    }

    // ---------------------------------------
    // 3. Get target user ID from route
    // ---------------------------------------
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      });
    }

    // ---------------------------------------
    // 4. Find target user
    // ---------------------------------------
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        co_admin_id,
        is_active
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const targetUser = result.rows[0];

    // ---------------------------------------
    // 5. Target must be a normal user
    // ---------------------------------------
    if (targetUser.role !== 'user') {
      return res.status(403).json({
        message: 'Co-admin can only manage normal users'
      });
    }

    // ---------------------------------------
    // 6. Check ownership
    // ---------------------------------------
    if (targetUser.co_admin_id !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden: User is not assigned to you'
      });
    }

    // Make target user available to controller
    req.assignedUser = targetUser;

    next();

  } catch (err) {
    console.error('Co-admin authorization error:', err);
    next(err);
  }
};

