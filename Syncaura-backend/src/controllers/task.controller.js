// Task Controller
import { logTaskActivity } from "../utils/taskActivityLogger.js";
import pool from "../config/db.js";
import { validate as isUUID } from "uuid";

/**
 * CREATE TASK
 */
export const createTask = async (req, res) => {
  try {
    const {
      title, description, priority, assignedTo, deadline, status,
      projectId, startDate, endDate, dependencies, reminderAt
    } = req.body;

    const cleanDate = (d) => (d && typeof d === "string" && d.trim() !== "" ? d : null);

    const finalDeadline = cleanDate(deadline);
    const finalStartDate = cleanDate(startDate);
    const finalEndDate = cleanDate(endDate);
    const finalReminderAt = cleanDate(reminderAt) || finalDeadline;
    const finalProjectId = (projectId && isUUID(projectId)) ? projectId : null;
    const finalAssignedTo = (assignedTo && typeof assignedTo === "string" && assignedTo.trim() !== "")
      ? assignedTo.trim()
      : (req.user?.name || req.user?.id || null);

    // Auto-migrate columns if missing in tasks table
    await pool.query("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS start_date TIMESTAMP;");
    await pool.query("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS end_date TIMESTAMP;");
    await pool.query("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS reminder_at TIMESTAMP;");

    const result = await pool.query(
      `INSERT INTO tasks (
        title, description, priority, assigned_to, deadline, status, 
        project_id, start_date, end_date, reminder_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`,
      [
        title,
        description || "",
        priority || "medium",
        finalAssignedTo,
        finalDeadline,
        status || "TODO",
        finalProjectId,
        finalStartDate,
        finalEndDate,
        finalReminderAt
      ]
    );

    const task = {
      ...result.rows[0],
      assignedTo: result.rows[0].assigned_to,
    };

    // Handle dependencies
    if (dependencies && Array.isArray(dependencies)) {
      for (const depId of dependencies) {
        if (isUUID(depId)) {
          await pool.query(
            "INSERT INTO task_dependencies (task_id, dependency_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [task.id, depId]
          );
        }
      }
      task.dependencies = dependencies;
    }

    await logTaskActivity({
      taskId: task.id,
      action: "TASK_CREATED",
      changedBy: req.user?.id,
      oldValue: null,
      newValue: { title: task.title, status: task.status, priority: task.priority, assignedTo: task.assigned_to }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ message: error.message || "Failed to create task" });
  }
};

/**
 * GET ALL TASKS
 */
export const getAllTasks = async (req, res) => {
  try {
    const {
      projectId,
      assignedTo,
      priority,
      status,
      deadline,
      search
    } = req.query;

    // Validate Project ID
    if (projectId && !isUUID(projectId)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    let query = `
      SELECT 
        t.*,
        COALESCE(u.name, t.assigned_to) AS "assignedTo",
        COALESCE(u.name, t.assigned_to) AS assigned_to
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to::text = u.id::text OR t.assigned_to = u.name OR t.assigned_to = u.email
    `;
    const conditions = [];
    const values = [];

    // Project Filter
    if (projectId) {
      values.push(projectId);
      conditions.push(`t.project_id = $${values.length}`);
    }

    // Assignee Filter
    if (assignedTo) {
      values.push(assignedTo);
      conditions.push(`(t.assigned_to = $${values.length} OR u.name ILIKE $${values.length})`);
    }

    // Priority Filter
    if (priority) {
      values.push(priority);
      conditions.push(`t.priority = $${values.length}`);
    }

    // Status Filter
    if (status) {
      values.push(status);
      conditions.push(`t.status = $${values.length}`);
    }

    // Due Date Filter
    if (deadline) {
      values.push(deadline);
      conditions.push(`DATE(t.deadline) = DATE($${values.length})`);
    }

    // Search by title or description
    if (search) {
      values.push(`%${search}%`);
      conditions.push(
        `(t.title ILIKE $${values.length} OR t.description ILIKE $${values.length})`
      );
    }

    // Add WHERE clause
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Sort latest first
    query += " ORDER BY t.created_at DESC";

    const result = await pool.query(query, values);

    return res.status(200).json(result.rows);

  } catch (error) {
    console.error("Get Tasks Error:", error);

    return res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

/**
 * GET SINGLE TASK
 */
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const taskResult = await pool.query(
      `SELECT 
        t.*,
        COALESCE(u.name, t.assigned_to) AS "assignedTo",
        COALESCE(u.name, t.assigned_to) AS assigned_to
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to::text = u.id::text OR t.assigned_to = u.name OR t.assigned_to = u.email
       WHERE t.id = $1`,
      [id]
    );

    if (taskResult.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = taskResult.rows[0];

    // Get subtasks
    const subtasksResult = await pool.query("SELECT * FROM subtasks WHERE task_id = $1", [id]);
    task.subtasks = subtasksResult.rows;

    // Get dependencies
    const depsResult = await pool.query(
      "SELECT dependency_id FROM task_dependencies WHERE task_id = $1",
      [id]
    );
    task.dependencies = depsResult.rows.map(r => r.dependency_id);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE TASK 
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, priority, assignedTo, deadline, status,
      projectId, startDate, endDate, reminderAt
    } = req.body;

    // Fetch existing task to check permissions
    const taskCheck = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (taskCheck.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const existingTask = taskCheck.rows[0];

    // RBAC: Check if user is Admin OR assigned to this task
    if (req.user?.role !== "admin" && existingTask.assigned_to !== req.user?.id) {
      return res.status(403).json({ message: "Forbidden: Not authorized to update this task" });
    }

    const result = await pool.query(
      `UPDATE tasks SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        priority = COALESCE($3, priority),
        assigned_to = COALESCE($4, assigned_to),
        deadline = COALESCE($5, deadline),
        status = COALESCE($6, status),
        project_id = COALESCE($7, project_id),
        start_date = COALESCE($8, start_date),
        end_date = COALESCE($9, end_date),
        reminder_at = COALESCE($10, reminder_at),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11 RETURNING *`,
      [
        title, description, priority, assignedTo, deadline, status,
        projectId, startDate, endDate, reminderAt, id
      ]
    );

    await logTaskActivity({
      taskId: id,
      action: "TASK_UPDATED",
      changedBy: req.user?.id,
      oldValue: { title: existingTask.title, description: existingTask.description, priority: existingTask.priority, status: existingTask.status },
      newValue: result.rows[0]
    });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE TASK
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch existing task to check permissions
    const taskCheck = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (taskCheck.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const existingTask = taskCheck.rows[0];

    // RBAC: Check if user is Admin OR assigned to this task
    if (req.user?.role !== "admin" && existingTask.assigned_to !== req.user?.id) {
      return res.status(403).json({ message: "Forbidden: Not authorized to delete this task" });
    }

    const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);

    await logTaskActivity({
      taskId: id,
      action: "TASK_DELETED",
      changedBy: req.user?.id,
      oldValue: result.rows[0],
      newValue: null
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE TASK STATUS
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id: userId, role } = req.user;
    const { id: taskId } = req.params;

    const allowedStatus = ["TODO", "IN_PROGRESS", "DONE"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const taskResult = await pool.query("SELECT * FROM tasks WHERE id = $1", [taskId]);

    if (taskResult.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = taskResult.rows[0];

    if (role !== "admin" && task.assigned_to !== userId) {
      return res.status(403).json({
        message: "Not authorized to update task status",
      });
    }

    const updateResult = await pool.query(
      "UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, taskId]
    );

    await logTaskActivity({
      taskId: taskId,
      action: "STATUS_CHANGED",
      changedBy: req.user?.id,
      oldValue: { status: task.status },
      newValue: { status: status }
    });

    res.json({
      message: "Task status updated successfully",
      task: updateResult.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADD SUBTASK
 */
export const addSubtask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    const taskCheck = await pool.query("SELECT id FROM tasks WHERE id = $1", [taskId]);
    if (taskCheck.rowCount === 0) return res.status(404).json({ message: "Task not found" });

    const result = await pool.query(
      "INSERT INTO subtasks (task_id, title) VALUES ($1, $2) RETURNING *",
      [taskId, title]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET GANTT DATA
 */
export const getGanttData = async (req, res) => {
  try {
    const { projectId } = req.query;

    const result = await pool.query(
      "SELECT * FROM tasks WHERE project_id = $1 AND start_date IS NOT NULL AND end_date IS NOT NULL",
      [projectId]
    );

    const ganttTasks = result.rows.map(task => ({
      id: task.id,
      name: task.title,
      start: task.start_date.toISOString().split("T")[0],
      end: task.end_date.toISOString().split("T")[0],
      progress: task.status === "DONE" ? 100 : 0
    }));

    res.json(ganttTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET UPCOMING REMINDERS
 */
export const getUpcomingReminders = async (req, res) => {
  try {
    const now = new Date();
    const upcoming = new Date();
    upcoming.setDate(now.getDate() + 3);

    const result = await pool.query(
      `SELECT * FROM tasks 
       WHERE status != 'DONE' 
       AND (
         (reminder_at >= $1 AND reminder_at <= $2) OR 
         (reminder_at IS NULL AND deadline >= $1 AND deadline <= $2)
       )`,
      [now, upcoming]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * START TASK
 */
export const startTask = async (req, res) => {
  try {
    const { id } = req.params;

    const depsResult = await pool.query(
      `SELECT d.status 
       FROM task_dependencies td 
       JOIN tasks d ON td.dependency_id = d.id 
       WHERE td.task_id = $1`,
      [id]
    );

    const blocked = depsResult.rows.some(dep => dep.status !== "DONE");

    if (blocked) {
      return res.status(400).json({
        message: "Cannot start task. Dependencies not completed.",
      });
    }

    const updateResult = await pool.query(
      "UPDATE tasks SET status = 'IN_PROGRESS', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updateResult.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET TASK ACTIVITY LOG
 */
export const getTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const taskCheck = await pool.query("SELECT id FROM tasks WHERE id = $1", [id]);
    if (taskCheck.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const result = await pool.query(
      `SELECT 
        tal.id,
        tal.action,
        tal.old_value,
        tal.new_value,
        tal.created_at,
        u.name as changed_by_name,
        u.email as changed_by_email
       FROM task_activity_log tal
       LEFT JOIN users u ON tal.changed_by = u.id
       WHERE tal.task_id = $1
       ORDER BY tal.created_at DESC`,
      [id]
    );

    res.json({
      taskId: id,
      totalActivities: result.rowCount,
      activities: result.rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
