import pool from "../config/db.js";

/**
 * GET TASK REPORT
 */
export const getTaskReport = async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;

    let query = "SELECT * FROM tasks WHERE 1=1";
    let params = [];
    let paramCount = 1;

    if (projectId) {
      query += ` AND project_id = $${paramCount++}`;
      params.push(projectId);
    }
    if (status) {
      query += ` AND status = $${paramCount++}`;
      params.push(status);
    }
    if (priority) {
      query += ` AND priority = $${paramCount++}`;
      params.push(priority);
    }

    const result = await pool.query(query, params);
    const tasks = result.rows;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "DONE").length;
    const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS").length;
    const todoTasks = tasks.filter(t => t.status === "TODO").length;
    const progressPercent = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      progressPercent,
      tasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET project-wise progress
export const getProjectProgress = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        project_id,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'DONE') as completed,
        COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') as in_progress,
        COUNT(*) FILTER (WHERE status = 'TODO') as todo
      FROM tasks 
      WHERE project_id IS NOT NULL
      GROUP BY project_id
    `);

    const projects = {};
    result.rows.forEach(row => {
      const pid = row.project_id;
      projects[pid] = {
        total: parseInt(row.total),
        completed: parseInt(row.completed),
        inProgress: parseInt(row.in_progress),
        todo: parseInt(row.todo),
        progressPercent: row.total > 0 ? (row.completed / row.total) * 100 : 0
      };
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET document summary (per project)
export const getDocumentSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.project_id, d.title, d.updated_at,
        (SELECT COUNT(*) FROM document_versions dv WHERE dv.document_id = d.id) as versions_count
      FROM documents d
    `);

    const summary = {};
    result.rows.forEach(row => {
      const pid = row.project_id;
      if (!summary[pid]) summary[pid] = [];
      summary[pid].push({
        title: row.title,
        versionsCount: parseInt(row.versions_count),
        lastUpdated: row.updated_at
      });
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};