import { logTaskActivity } from "../utils/taskActivityLogger.js";
import pool from "../config/db.js";
import { validate as isUUID } from "uuid";

/**
 * Helper: Check if user has Admin or Co-Admin privileges
 */
const isUserAdminOrCoAdmin = (user) => {
  const role = String(user?.role || "").toLowerCase();
  return role === "admin" || role === "co-admin" || role === "coadmin";
};

/**
 * Helper: Check if a task is assigned to the given user
 */
const isTaskAssignedToUser = (task, user) => {
  if (!task || !user) return false;
  const assigned = String(task.assigned_to || "").trim().toLowerCase();
  const userId = String(user.id || "").trim().toLowerCase();
  const userEmail = String(user.email || "").trim().toLowerCase();
  const userName = String(user.name || "").trim().toLowerCase();

  return (
    (userId && assigned === userId) ||
    (userEmail && assigned === userEmail) ||
    (userName && assigned === userName)
  );
};

/**
 * CREATE TASK
 */
export const createTask = async (req, res) => {
  try {
    const { 
      title, description, priority, assignedTo, deadline, status, 
      projectId, project_id, startDate, endDate, dependencies, reminderAt 
    } = req.body;
 
    const isAdminOrCoAdmin = isUserAdminOrCoAdmin(req.user);
    // If not Admin/Co-Admin, task is always assigned to the user themselves
    const finalAssignedTo = isAdminOrCoAdmin
      ? (assignedTo || req.user?.email || req.user?.id)
      : (req.user?.email || req.user?.id || req.user?.name);
 
    const resolvedProjectId = (projectId || project_id) && isUUID(String(projectId || project_id))
      ? String(projectId || project_id)
      : null;

    const result = await pool.query(
      `INSERT INTO tasks (
        title, description, priority, assigned_to, deadline, status, 
        project_id, start_date, end_date, reminder_at, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *, assigned_to AS "assignedTo"`,
      [
        title, description, priority || "medium", finalAssignedTo, deadline, 
        status || "TODO", resolvedProjectId, startDate || null, 
        endDate || null, reminderAt || deadline || null, req.user?.id || null
      ]
    );
 
    const task = result.rows[0];

    // Attach creator details
    if (req.user) {
      task.creator_user_name = req.user.name;
      task.creator_user_email = req.user.email;
      task.creator_user_role = req.user.role;
    }

    // Attach project name if project_id exists
    if (task.project_id) {
      const pRes = await pool.query("SELECT name FROM projects WHERE id = $1", [task.project_id]);
      if (pRes.rowCount > 0) {
        task.project_name = pRes.rows[0].name;
        task.project_title = pRes.rows[0].name;
      }
    }
 
    // Handle dependencies
    if (dependencies && Array.isArray(dependencies)) {
      for (const depId of dependencies) {
        await pool.query(
          "INSERT INTO task_dependencies (task_id, dependency_id) VALUES ($1, $2)",
          [task.id, depId]
        );
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
    res.status(500).json({ message: error.message });
  }
};
 
/**
 * GET ALL TASKS
 * Admins/Co-Admins: Can see all tasks (or filter by assignedTo)
 * Regular users: ONLY see tasks assigned to them!
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

    const isAdminOrCoAdmin = isUserAdminOrCoAdmin(req.user);
 
    let query = `
      SELECT t.*, t.assigned_to AS "assignedTo",
        u.name AS assigned_user_name, u.email AS assigned_user_email,
        u_creator.name AS creator_user_name, u_creator.email AS creator_user_email, u_creator.role AS creator_user_role,
        p.name AS project_name, p.name AS project_title,
        latest_issue.status AS task_issue_status, latest_issue.id AS task_issue_id, latest_issue.resolution AS task_issue_resolution
      FROM tasks t
      LEFT JOIN users u ON (t.assigned_to = u.id::text OR t.assigned_to = u.email OR LOWER(t.assigned_to) = LOWER(u.name))
      LEFT JOIN users u_creator ON (t.created_by = u_creator.id)
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN LATERAL (
        SELECT id, status, resolution FROM complaints WHERE task_id = t.id ORDER BY created_at DESC LIMIT 1
      ) latest_issue ON true
    `;
    const conditions = [];
    const values = [];

    // Role-based visibility: Non-admins ONLY see tasks assigned to their user ID, email, or name
    if (!isAdminOrCoAdmin) {
      const userConditions = [];
      if (req.user?.id) {
        values.push(String(req.user.id));
        userConditions.push(`t.assigned_to = $${values.length}`);
      }
      if (req.user?.email) {
        values.push(req.user.email);
        userConditions.push(`LOWER(t.assigned_to) = LOWER($${values.length})`);
      }
      if (req.user?.name) {
        values.push(req.user.name);
        userConditions.push(`LOWER(t.assigned_to) = LOWER($${values.length})`);
      }
      if (userConditions.length > 0) {
        conditions.push(`(${userConditions.join(" OR ")})`);
      } else {
        conditions.push("1 = 0");
      }
    } else if (assignedTo) {
      values.push(assignedTo);
      conditions.push(`(t.assigned_to = $${values.length} OR LOWER(t.assigned_to) = LOWER($${values.length}))`);
    }
 
    // Project Filter
    if (projectId) {
      values.push(projectId);
      conditions.push(`t.project_id = $${values.length}`);
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
    const tasksList = result.rows;
 
    // Attach subtasks to each task
    if (tasksList.length > 0) {
      const taskIds = tasksList.map((t) => t.id);
      const subtasksResult = await pool.query(
        `SELECT * FROM subtasks WHERE task_id = ANY($1::uuid[])`,
        [taskIds]
      );
      const subtasksByTaskId = {};
      for (const st of subtasksResult.rows) {
        if (!subtasksByTaskId[st.task_id]) subtasksByTaskId[st.task_id] = [];
        subtasksByTaskId[st.task_id].push(st);
      }
      for (const t of tasksList) {
        t.subtasks = subtasksByTaskId[t.id] || [];
      }
    }
 
    return res.status(200).json(tasksList);
 
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
    const isAdminOrCoAdmin = isUserAdminOrCoAdmin(req.user);

    const taskResult = await pool.query(
      `SELECT t.*, t.assigned_to AS "assignedTo", 
        u.name AS assigned_user_name, u.email AS assigned_user_email,
        u_creator.name AS creator_user_name, u_creator.email AS creator_user_email, u_creator.role AS creator_user_role,
        p.name AS project_name, p.name AS project_title,
        latest_issue.status AS task_issue_status, latest_issue.id AS task_issue_id, latest_issue.resolution AS task_issue_resolution
       FROM tasks t
       LEFT JOIN users u ON (t.assigned_to = u.id::text OR t.assigned_to = u.email OR LOWER(t.assigned_to) = LOWER(u.name))
       LEFT JOIN users u_creator ON (t.created_by = u_creator.id)
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN LATERAL (
         SELECT id, status, resolution FROM complaints WHERE task_id = t.id ORDER BY created_at DESC LIMIT 1
       ) latest_issue ON true
       WHERE t.id = $1`,
      [id]
    );
 
    if (taskResult.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
 
    const task = taskResult.rows[0];

    // Non-admins can only view tasks assigned to them
    if (!isAdminOrCoAdmin && !isTaskAssignedToUser(task, req.user)) {
      return res.status(403).json({ message: "Forbidden: Not authorized to view this task" });
    }
 
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
    const isAdminOrCoAdmin = isUserAdminOrCoAdmin(req.user);
 
    // RBAC: Check if user is Admin/Co-Admin OR assigned to this task
    if (!isAdminOrCoAdmin && !isTaskAssignedToUser(existingTask, req.user)) {
      return res.status(403).json({ message: "Forbidden: Not authorized to update this task" });
    }
 
    await pool.query(
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
      WHERE id = $11`,
      [
        title, description, priority, assignedTo, deadline, status, 
        projectId, startDate, endDate, reminderAt, id
      ]
    );
 
    const updatedRes = await pool.query(
      `SELECT t.*, t.assigned_to AS "assignedTo",
        u.name AS assigned_user_name, u.email AS assigned_user_email,
        u_creator.name AS creator_user_name, u_creator.email AS creator_user_email, u_creator.role AS creator_user_role,
        p.name AS project_name, p.name AS project_title,
        latest_issue.status AS task_issue_status, latest_issue.id AS task_issue_id, latest_issue.resolution AS task_issue_resolution
       FROM tasks t
       LEFT JOIN users u ON (t.assigned_to = u.id::text OR t.assigned_to = u.email OR LOWER(t.assigned_to) = LOWER(u.name))
       LEFT JOIN users u_creator ON (t.created_by = u_creator.id)
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN LATERAL (
         SELECT id, status, resolution FROM complaints WHERE task_id = t.id ORDER BY created_at DESC LIMIT 1
       ) latest_issue ON true
       WHERE t.id = $1`,
      [id]
    );
    const updatedTask = updatedRes.rows[0];

    const subtasksResult = await pool.query("SELECT * FROM subtasks WHERE task_id = $1", [id]);
    updatedTask.subtasks = subtasksResult.rows;

    await logTaskActivity({
      taskId: id,
      action: "TASK_UPDATED",
      changedBy: req.user?.id,
      oldValue: { title: existingTask.title, description: existingTask.description, priority: existingTask.priority, status: existingTask.status },
      newValue: updatedTask
    });
 
    res.json(updatedTask);
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
    const isAdminOrCoAdmin = isUserAdminOrCoAdmin(req.user);
 
    // RBAC: Only Admin/Co-Admin OR the user who created this task can delete it
    const isCreator = String(existingTask.created_by || "").trim() === String(req.user?.id || "").trim();
    if (!isAdminOrCoAdmin && !isCreator) {
      return res.status(403).json({ 
        message: "Forbidden: You can only delete tasks you created. Tasks assigned by an admin cannot be deleted." 
      });
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
    const isAdminOrCoAdmin = isUserAdminOrCoAdmin(req.user);
 
    if (!isAdminOrCoAdmin && !isTaskAssignedToUser(task, req.user)) {
      return res.status(403).json({
        message: "Not authorized to update task status",
      });
    }
 
    const updateResult = await pool.query(
      `UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *, assigned_to AS "assignedTo"`,
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
 
    const taskCheck = await pool.query("SELECT * FROM tasks WHERE id = $1", [taskId]);
    if (taskCheck.rowCount === 0) return res.status(404).json({ message: "Task not found" });
 
    const task = taskCheck.rows[0];
    const isAdminOrCoAdmin = isUserAdminOrCoAdmin(req.user);
    if (!isAdminOrCoAdmin && !isTaskAssignedToUser(task, req.user)) {
      return res.status(403).json({ message: "Not authorized to add subtasks to this task" });
    }

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
 * TOGGLE / UPDATE SUBTASK STATUS
 */
export const updateSubtaskStatus = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const { status } = req.body;
 
    if (!["TODO", "DONE"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
 
    const taskCheck = await pool.query("SELECT * FROM tasks WHERE id = $1", [taskId]);
    if (taskCheck.rowCount === 0) return res.status(404).json({ message: "Task not found" });

    const task = taskCheck.rows[0];
    const isAdminOrCoAdmin = isUserAdminOrCoAdmin(req.user);
    if (!isAdminOrCoAdmin && !isTaskAssignedToUser(task, req.user)) {
      return res.status(403).json({ message: "Not authorized to update subtasks for this task" });
    }

    const result = await pool.query(
      "UPDATE subtasks SET status = $1 WHERE id = $2 AND task_id = $3 RETURNING *",
      [status, subtaskId, taskId]
    );
 
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Subtask not found" });
    }
 
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
    const isAdminOrCoAdmin = isUserAdminOrCoAdmin(req.user);

    let query = "SELECT * FROM tasks WHERE project_id = $1 AND start_date IS NOT NULL AND end_date IS NOT NULL";
    const params = [projectId];

    if (!isAdminOrCoAdmin) {
      params.push(String(req.user?.id), req.user?.email || "", req.user?.name || "");
      query += ` AND (assigned_to = $2 OR LOWER(assigned_to) = LOWER($3) OR LOWER(assigned_to) = LOWER($4))`;
    }
 
    const result = await pool.query(query, params);
 
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
    const isAdminOrCoAdmin = isUserAdminOrCoAdmin(req.user);
 
    let query = `SELECT * FROM tasks 
       WHERE status != 'DONE' 
       AND (
         (reminder_at >= $1 AND reminder_at <= $2) OR 
         (reminder_at IS NULL AND deadline >= $1 AND deadline <= $2)
       )`;
    const params = [now, upcoming];

    if (!isAdminOrCoAdmin) {
      params.push(String(req.user?.id), req.user?.email || "", req.user?.name || "");
      query += ` AND (assigned_to = $3 OR LOWER(assigned_to) = LOWER($4) OR LOWER(assigned_to) = LOWER($5))`;
    }

    const result = await pool.query(query, params);
 
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
 
    const taskCheck = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (taskCheck.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = taskCheck.rows[0];
    const isAdminOrCoAdmin = isUserAdminOrCoAdmin(req.user);
    if (!isAdminOrCoAdmin && !isTaskAssignedToUser(task, req.user)) {
      return res.status(403).json({ message: "Not authorized to start this task" });
    }

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
 
    const taskCheck = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (taskCheck.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = taskCheck.rows[0];
    const isAdminOrCoAdmin = isUserAdminOrCoAdmin(req.user);
    if (!isAdminOrCoAdmin && !isTaskAssignedToUser(task, req.user)) {
      return res.status(403).json({ message: "Not authorized to view activity for this task" });
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