import pool from '../config/db.js';

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        role,
        first_name,
        last_name,
        phone,
        language,
        is_active,
        created_at,
        updated_at
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

    return res.status(200).json({
      user: result.rows[0]
    });

  } catch (err) {
    console.error('Get user error:', err);
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { excludeSelf } = req.query;
    let query = `SELECT id, name, email, role FROM users WHERE is_active = true`;
    const params = [];

    if (excludeSelf === 'true' && req.user?.id) {
      params.push(req.user.id);
      query += ` AND id != $1`;
    }

    query += ` ORDER BY name ASC`;
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};