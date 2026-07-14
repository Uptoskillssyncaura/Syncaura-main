import pool from "../config/db.js";
import { validate as isUUID } from "uuid";

/**
 * CREATE PROJECT
 */
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const result = await pool.query(
      `INSERT INTO projects (name, description, created_by) 
       VALUES ($1, $2, $3) RETURNING *`,
      [name, description, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL PROJECTS
 */
export const getAllProjects = async (req, res) => {
  try {
  const result = await pool.query(
  `SELECT *
  FROM projects
  WHERE created_by = $1
  ORDER BY created_at DESC`,
  [req.user.id]
);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET SINGLE PROJECT
 */


export const getProjectById = async (req, res) => {
  try {
 feature/project-health-score
    const { id } = req.params;

    if (!isUUID(id)) {
      return res.status(400).json({
        message: "Invalid project ID"
      });
    }



    if (!isUUID(req.params.id)) {
  return res.status(400).json({
    message: "Invalid project ID"
  });
}
 main
    const result = await pool.query(
      `SELECT *
      FROM projects
      WHERE id = $1
      AND created_by = $2`,
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


/**
 * UPDATE PROJECT
 */
export const updateProject = async (req, res) => {
  try {
 feature/project-health-score
    const { id } = req.params;

if (!isUUID(id)) {
    return res.status(400).json({
        message: "Invalid project ID"
    });
}


    if (!isUUID(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID"
      });
    }

 main
    const { name, description, status } = req.body;
    let updateFields = [];
    let values = [];
    let idx = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${idx++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${idx++}`);
      values.push(description);
    }
    if (status !== undefined) {
      updateFields.push(`status = $${idx++}`);
      values.push(status);
    }

    if (updateFields.length === 0) {
      const current = await pool.query(`SELECT * FROM projects WHERE id = $1 AND created_by = $2`,[id, req.user.id]);
      if (current.rowCount === 0) return res.status(404).json({ message: "Project not found" });
      return res.json(current.rows[0]);
    }

    values.push(id);
    const query = `
    UPDATE projects
    SET ${updateFields.join(", ")},
    updated_at = CURRENT_TIMESTAMP
    WHERE id = $${idx}
    AND created_by = $${idx + 1}
    RETURNING *`;
    
    values.push(req.user.id);

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE PROJECT
 */
export const deleteProject = async (req, res) => {
  try {
 feature/project-health-score
    const { id } = req.params;


    if (!isUUID(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID"
      });
    }
    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [req.params.id]
    );
 main

if (!isUUID(id)) {
    return res.status(400).json({
        message: "Invalid project ID"
    });
}

const result = await pool.query(
    `DELETE FROM projects
    WHERE id = $1
    AND created_by = $2
    RETURNING *`,
    [id, req.user.id]
);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectHealth = async (req, res) => {
  try {
    const { id } = req.params;

    // Check project exists
    if (!isUUID(id)) {
    return res.status(400).json({
        message: "Invalid project ID"
    });
}

const project = await pool.query(
    `SELECT *
    FROM projects
    WHERE id = $1
    AND created_by = $2`,
    [id, req.user.id]
);

    if (project.rowCount === 0) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    // Fetch project tasks
    // Fetch only required task fields
const tasks = await pool.query(
  `SELECT status, priority, deadline
  FROM tasks
  WHERE project_id = $1`,
  [id]
);

const allTasks = tasks.rows;

    const totalTasks = allTasks.length;
    if (totalTasks === 0) {
  return res.json({
    projectId: project.rows[0].id,
    projectName: project.rows[0].name,
    projectDescription: project.rows[0].description,
    projectStatus: project.rows[0].status,
    healthScore: 0,
    status: "No Tasks",
    riskLevel: "Unknown",
    recommendation: "No tasks have been created for this project yet.",

    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    highPriorityPending: 0,

    completionPercentage: 0
  });
}

    const completedTasks =
      allTasks.filter(task => task.status === "DONE").length;

    const pendingTasks =
      allTasks.filter(task => task.status === "TODO").length;

    const inProgressTasks =
      allTasks.filter(task => task.status === "IN_PROGRESS").length;

    const today = new Date();

    const overdueTasks =
      allTasks.filter(task =>
        task.status !== "DONE" &&
        task.deadline &&
        new Date(task.deadline) < today
      ).length;

    const highPriorityPending =
      allTasks.filter(task =>
        task.priority === "high" &&
        task.status !== "DONE"
      ).length;

    const completionPercentage =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    // Health Score
    let healthScore = completionPercentage;

    healthScore -= overdueTasks * 10;
    healthScore -= highPriorityPending * 5;

    if (healthScore < 0) healthScore = 0;
    if (healthScore > 100) healthScore = 100;

    let status;

if (healthScore >= 80) {
    status = "Healthy";
} else if (healthScore >= 50) {
    status = "Moderate";
} else {
    status = "Critical";
}

    let riskLevel;
    let recommendation;

    if (healthScore >= 80) {
    riskLevel = "Low";
    recommendation =
        "Project is progressing well. Keep monitoring pending tasks.";
}
else if (healthScore >= 50) {
    riskLevel = "Medium";
    recommendation =
        "Project needs attention. Complete pending tasks and reduce overdue items.";
}
else {
    riskLevel = "High";
    recommendation =
        "Immediate action required. Resolve overdue and high-priority tasks.";
}

    res.json({
  projectId: project.rows[0].id,
  projectName: project.rows[0].name,
  projectDescription: project.rows[0].description,
  projectStatus: project.rows[0].status,

  healthScore,
  status,
  riskLevel,
  recommendation,

  totalTasks,
  completedTasks,
  pendingTasks,
  inProgressTasks,
  overdueTasks,
  highPriorityPending,

  completionPercentage
});

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
