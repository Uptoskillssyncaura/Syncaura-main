import pool from '../config/db.js';

export const completionRate = async (req, res) => {
  try {
    const { projectId } = req.query;

    let totalResult, completedResult;

    if (projectId) {
      totalResult = await pool.query("SELECT COUNT(*) FROM tasks WHERE project_id = $1", [projectId]);
      completedResult = await pool.query("SELECT COUNT(*) FROM tasks WHERE status = 'DONE' AND project_id = $1", [projectId]);
    } else {
      totalResult = await pool.query("SELECT COUNT(*) FROM tasks");
      completedResult = await pool.query("SELECT COUNT(*) FROM tasks WHERE status = 'DONE'");
    }

    const total = parseInt(totalResult.rows[0].count);
    const completed = parseInt(completedResult.rows[0].count);

    return res.status(200).json({
      totalTasks: total,
      completedTasks: completed,
      completionRate: total === 0 ? 0 : Math.round((completed / total) * 100)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const burndownData = async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ message: "projectId required" });

    const tasksResult = await pool.query(
      "SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at ASC",
      [projectId]
    );
    const tasks = tasksResult.rows;

    if (!tasks.length) return res.json([]);

    const dates = [...new Set(tasks.map(t => new Date(t.created_at).toISOString().split('T')[0]))];

    let totalTasks = tasks.length;
    const result = [];

    for (let date of dates) {
      const completedUpToDate = tasks.filter(
        t => t.status === 'DONE' && new Date(t.updated_at).toISOString().split('T')[0] <= date
      ).length;

      result.push({
        date,
        remaining: totalTasks - completedUpToDate
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const workload = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT assigned_to as _id, COUNT(*) as task_count FROM tasks WHERE assigned_to IS NOT NULL GROUP BY assigned_to"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const myWorkload = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT * FROM tasks WHERE assigned_to = $1", [userId]);
    const tasks = result.rows;

    res.status(200).json({
      totalTasks: tasks.length,
      pending: tasks.filter(t => t.status !== 'DONE').length,
      completed: tasks.filter(t => t.status === 'DONE').length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};