import pool from '../config/db.js';

export const getProfile = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      name,
      first_name,
      last_name,
      phone,
      language,
      profile_pic
    } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET
          name = COALESCE($1, name),
         first_name = COALESCE($2, first_name),
         last_name = COALESCE($3, last_name),
         phone = COALESCE($4, phone),
         language = COALESCE($5, language),
         profile_pic = COALESCE($6, profile_pic),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *;
      `,
      [
        name ?? null,
        first_name ?? null,
        last_name ?? null,
        phone ?? null,
        language ?? null,
        profile_pic ?? null,
        userId,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
