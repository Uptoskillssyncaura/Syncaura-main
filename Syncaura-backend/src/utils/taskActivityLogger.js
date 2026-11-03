import pool from "../config/db.js";

export const logTaskActivity = async ({ taskId, action, changedBy, oldValue, newValue }) => {
  try {
    await pool.query(
      `INSERT INTO task_activity_log 
        (task_id, action, changed_by, old_value, new_value) 
       VALUES ($1, $2, $3, $4, $5)`,
      [
        taskId,
        action,
        changedBy || null,
        oldValue ? JSON.stringify(oldValue) : null,
        newValue ? JSON.stringify(newValue) : null
      ]
    );
  } catch (err) {
    console.error("Failed to log task activity:", err.message);
  }
};