import pool from '../config/db.js';

const roundScore = (value) => Math.round(Math.max(0, Math.min(100, value)));

/**
 * Return a single, explainable health score for a project.
 *
 * Weighting: completion (40), overdue work (30), workload assignment (15),
 * and upcoming deadlines (15). A score is deliberately accompanied by its
 * component scores so clients can show managers why a project is at risk.
 */
export const projectHealth = async (req, res) => {
  try {
    const { projectId } = req.params;

    const projectResult = await pool.query(
      'SELECT id, name, status FROM projects WHERE id = $1',
      [projectId]
    );

    if (projectResult.rowCount === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const metricsResult = await pool.query(
      `SELECT
        COUNT(*)::int AS total_tasks,
        COUNT(*) FILTER (WHERE status = 'DONE')::int AS completed_tasks,
        COUNT(*) FILTER (
          WHERE status <> 'DONE'
            AND deadline IS NOT NULL
            AND deadline < CURRENT_TIMESTAMP
        )::int AS overdue_tasks,
        COUNT(*) FILTER (
          WHERE status <> 'DONE'
            AND deadline IS NOT NULL
            AND deadline >= CURRENT_TIMESTAMP
            AND deadline < CURRENT_TIMESTAMP + INTERVAL '7 days'
        )::int AS due_soon_tasks,
        COUNT(*) FILTER (WHERE status <> 'DONE' AND assigned_to IS NULL)::int AS unassigned_tasks,
        COUNT(*) FILTER (WHERE status <> 'DONE')::int AS open_tasks,
        COUNT(DISTINCT assigned_to) FILTER (
          WHERE status <> 'DONE' AND assigned_to IS NOT NULL
        )::int AS assignee_count
      FROM tasks
      WHERE project_id = $1`,
      [projectId]
    );

    const metrics = metricsResult.rows[0];
    const totalTasks = metrics.total_tasks;
    const completedTasks = metrics.completed_tasks;
    const openTasks = metrics.open_tasks;
    const overdueTasks = metrics.overdue_tasks;
    const dueSoonTasks = metrics.due_soon_tasks;
    const unassignedTasks = metrics.unassigned_tasks;
    const assigneeCount = metrics.assignee_count;

    // Projects with no tasks have no delivery risk yet.
    if (totalTasks === 0) {
      return res.json({
        project: projectResult.rows[0],
        score: 100,
        status: 'healthy',
        metrics: {
          totalTasks: 0,
          completedTasks: 0,
          openTasks: 0,
          overdueTasks: 0,
          dueSoonTasks: 0,
          unassignedTasks: 0,
          assigneeCount: 0,
          completionRate: 0
        },
        breakdown: {
          completion: 100,
          overdue: 100,
          workload: 100,
          deadlines: 100
        },
        issues: []
      });
    }

    const completion = (completedTasks / totalTasks) * 40;
    const overdue = 30 * (1 - overdueTasks / Math.max(openTasks, 1));
    const deadlines = 15 * (1 - dueSoonTasks / Math.max(openTasks, 1));

    // Unassigned work is the primary workload risk. The rest of the workload
    // weight stays available once each active task has an owner.
    const workload = 15 * (1 - unassignedTasks / Math.max(openTasks, 1));
    const score = roundScore(completion + overdue + workload + deadlines);
    const status = score >= 80 ? 'healthy' : score >= 60 ? 'at-risk' : 'critical';

    const issues = [];
    if (overdueTasks > 0) issues.push(`${overdueTasks} overdue task${overdueTasks === 1 ? '' : 's'}`);
    if (dueSoonTasks > 0) issues.push(`${dueSoonTasks} task${dueSoonTasks === 1 ? '' : 's'} due within 7 days`);
    if (unassignedTasks > 0) issues.push(`${unassignedTasks} open task${unassignedTasks === 1 ? '' : 's'} unassigned`);

    return res.json({
      project: projectResult.rows[0],
      score,
      status,
      metrics: {
        totalTasks,
        completedTasks,
        openTasks,
        overdueTasks,
        dueSoonTasks,
        unassignedTasks,
        assigneeCount,
        completionRate: roundScore((completedTasks / totalTasks) * 100)
      },
      breakdown: {
        completion: roundScore((completion / 40) * 100),
        overdue: roundScore((overdue / 30) * 100),
        workload: roundScore((workload / 15) * 100),
        deadlines: roundScore((deadlines / 15) * 100)
      },
      issues
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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
    // Tasks can be assigned by user id, email, or name (see task.controller.js
    // getAllTasks), so matching on id alone silently missed tasks assigned by
    // email/name and made the user's dashboard look empty even when they had
    // work assigned. Match the same way getAllTasks does.
    const values = [req.user.id];
    const conditions = [`assigned_to = $1`];

    if (req.user?.email) {
      values.push(req.user.email);
      conditions.push(`LOWER(assigned_to) = LOWER($${values.length})`);
    }
    if (req.user?.name) {
      values.push(req.user.name);
      conditions.push(`LOWER(assigned_to) = LOWER($${values.length})`);
    }

    const result = await pool.query(
      `SELECT * FROM tasks WHERE ${conditions.join(" OR ")}`,
      values
    );
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
 