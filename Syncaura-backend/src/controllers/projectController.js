import pool from "../config/db.js";
import { validate as isUUID } from "uuid";

/**
 * Helper to normalize roles
 */
const getRole = (user) => {
  const role = String(user?.role || "").toLowerCase().trim();
  if (role === "admin") return "admin";
  if (role === "co-admin" || role === "coadmin") return "co-admin";
  return "user";
};

/**
 * Helper to fetch owner and members for a project or list of projects
 */
const attachProjectOwnerAndMembers = async (projects) => {
  if (!projects || projects.length === 0) return [];
  const isArray = Array.isArray(projects);
  const projectList = isArray ? projects : [projects];
  const projectIds = projectList.map((p) => p.id).filter(Boolean);

  if (projectIds.length === 0) return projects;

  try {
    // 1. Fetch owners
    const ownerIds = [...new Set(projectList.map((p) => p.owner_id || p.created_by).filter(Boolean))];
    let ownerMap = {};
    if (ownerIds.length > 0) {
      const ownerRes = await pool.query(
        "SELECT id, name, email, role FROM users WHERE id = ANY($1::uuid[])",
        [ownerIds]
      );
      for (const u of ownerRes.rows) {
        ownerMap[u.id] = u;
      }
    }

    // 2. Fetch project members
    const membersRes = await pool.query(
      `SELECT pm.project_id, u.id, u.name, u.email, u.role
       FROM project_members pm
       JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = ANY($1::uuid[])
       ORDER BY u.name ASC`,
      [projectIds]
    );

    const membersMap = {};
    for (const row of membersRes.rows) {
      if (!membersMap[row.project_id]) {
        membersMap[row.project_id] = [];
      }
      membersMap[row.project_id].push({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
      });
    }

    const detailedList = projectList.map((p) => {
      const resolvedOwnerId = p.owner_id || p.created_by;
      return {
        ...p,
        owner: ownerMap[resolvedOwnerId] || null,
        members: membersMap[p.id] || [],
      };
    });

    return isArray ? detailedList : detailedList[0];
  } catch (err) {
    console.error("Error attaching owner and members to projects:", err);
    return projects;
  }
};

/**
 * Check if a user has view access to a specific project
 */
const canUserViewProject = async (project, user) => {
  const role = getRole(user);
  if (role === "admin") return true;
  if (role === "co-admin") {
    return String(project.created_by) === String(user.id) || String(project.owner_id) === String(user.id);
  }
  
  // Normal user: allowed if creator, owner, in project_members, or assigned to a task in this project
  if (String(project.created_by) === String(user.id) || String(project.owner_id) === String(user.id)) return true;
  
  const userIdentifier = user?.id ? String(user.id) : "";
  const userEmail = user?.email ? String(user.email).toLowerCase() : "";
  const userName = user?.name ? String(user.name).toLowerCase() : "";

  try {
    const memberCheck = await pool.query(
      `SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2 LIMIT 1`,
      [project.id, userIdentifier]
    );
    if (memberCheck.rowCount > 0) return true;

    const taskCheck = await pool.query(
      `SELECT 1 FROM tasks 
       WHERE project_id = $1 
         AND (assigned_to = $2 OR LOWER(assigned_to) = $3 OR LOWER(assigned_to) = $4) 
       LIMIT 1`,
      [project.id, userIdentifier, userEmail, userName]
    );
    return taskCheck.rowCount > 0;
  } catch (err) {
    console.error("Error checking user project task membership:", err);
    return false;
  }
};

/**
 * Check if a user has management (edit/delete/archive) access to a project
 */
const canUserManageProject = (project, user) => {
  const role = getRole(user);
  if (role === "admin") return true;
  if (role === "co-admin") {
    return String(project.created_by) === String(user.id) || String(project.owner_id) === String(user.id);
  }
  return false;
};

/**
 * CREATE PROJECT
 * Only Admin and Co-Admin can create projects.
 */
export const createProject = async (req, res) => {
  try {
    const role = getRole(req.user);
    if (role !== "admin" && role !== "co-admin") {
      return res.status(403).json({ message: "Forbidden: Normal users cannot create projects." });
    }

    const { name, title, projectName, description, status, owner, owner_id, members } = req.body;
    const finalName = name || title || projectName;

    if (!finalName || !String(finalName).trim()) {
      return res.status(400).json({ message: "Project name is required" });
    }

    // Restrict initial creation status to valid initial statuses only
    const VALID_INITIAL_STATUSES = new Set([
      "not started",
      "planning",
      "backlog",
      "active",
    ]);

    let initialStatus = "Not Started";
    if (status && String(status).trim()) {
      const normStatus = String(status).trim().toLowerCase().replace(/_/g, " ");
      if (!VALID_INITIAL_STATUSES.has(normStatus)) {
        return res.status(400).json({
          message: `Invalid initial status: "${status}". Project creation only allows initial statuses: "Not Started", "Planning", or "Backlog".`,
        });
      }
      if (normStatus === "planning") initialStatus = "Planning";
      else if (normStatus === "backlog") initialStatus = "Backlog";
      else initialStatus = "Not Started";
    }

    // Resolve owner_id
    let resolvedOwnerId = req.user.id;
    const rawOwner = owner_id || owner;
    if (rawOwner) {
      if (typeof rawOwner === "object" && rawOwner.id && isUUID(String(rawOwner.id))) {
        resolvedOwnerId = rawOwner.id;
      } else if (typeof rawOwner === "string" && isUUID(rawOwner)) {
        resolvedOwnerId = rawOwner;
      }
    }

    const result = await pool.query(
      `INSERT INTO projects (name, description, status, created_by, owner_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [String(finalName).trim(), description || "", initialStatus, req.user.id, resolvedOwnerId]
    );

    const createdProject = result.rows[0];

    // Insert assigned members into project_members table
    if (Array.isArray(members) && members.length > 0) {
      for (const m of members) {
        let memberId = null;
        if (m && typeof m === "object" && m.id && isUUID(String(m.id))) {
          memberId = m.id;
        } else if (typeof m === "string" && isUUID(m)) {
          memberId = m;
        }

        if (memberId) {
          await pool.query(
            `INSERT INTO project_members (project_id, user_id) 
             VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [createdProject.id, memberId]
          );
        }
      }
    }

    const fullProject = await attachProjectOwnerAndMembers(createdProject);
    res.status(201).json(fullProject);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL PROJECTS
 * - Admin: sees ALL active projects
 * - Co-Admin: sees ONLY projects created by that Co-Admin
 * - Normal User: sees ONLY projects assigned to them / where they are a member
 */
export const getAllProjects = async (req, res) => {
  try {
    const role = getRole(req.user);
    const userId = req.user.id;

    let rows = [];

    if (role === "admin") {
      const result = await pool.query(
        "SELECT * FROM projects WHERE is_archived = false ORDER BY created_at DESC"
      );
      rows = result.rows;
    } else if (role === "co-admin") {
      const result = await pool.query(
        "SELECT * FROM projects WHERE (created_by = $1 OR owner_id = $1) AND is_archived = false ORDER BY created_at DESC",
        [userId]
      );
      rows = result.rows;
    } else {
      // Normal user: projects assigned to them via project_members, tasks, or created by them
      const userEmail = req.user.email ? String(req.user.email).toLowerCase() : "";
      const userName = req.user.name ? String(req.user.name).toLowerCase() : "";

      const result = await pool.query(
        `SELECT DISTINCT p.* FROM projects p
         LEFT JOIN project_members pm ON p.id = pm.project_id
         LEFT JOIN tasks t ON p.id = t.project_id
         WHERE p.is_archived = false 
           AND (
             p.created_by = $1
             OR p.owner_id = $1
             OR pm.user_id = $1
             OR t.assigned_to = $1::text
             OR LOWER(t.assigned_to) = $2
             OR LOWER(t.assigned_to) = $3
           )
         ORDER BY p.created_at DESC`,
        [userId, userEmail, userName]
      );
      rows = result.rows;
    }

    const detailedProjects = await attachProjectOwnerAndMembers(rows);
    return res.json(detailedProjects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET SINGLE PROJECT
 * Enforces visibility authorization per role.
 */
export const getProjectById = async (req, res) => {
  try {
    if (!isUUID(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const result = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = result.rows[0];
    const allowed = await canUserViewProject(project, req.user);

    if (!allowed) {
      return res.status(403).json({ message: "Forbidden: Access denied to this project." });
    }

    const detailedProject = await attachProjectOwnerAndMembers(project);
    res.json(detailedProject);
  } catch (err) {
    console.error("Error fetching project by ID:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE PROJECT
 * Admin can update any project. Co-admin can only update their own project.
 */
export const updateProject = async (req, res) => {
  try {
    if (!isUUID(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const currentResult = await pool.query("SELECT * FROM projects WHERE id = $1", [req.params.id]);
    if (currentResult.rowCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = currentResult.rows[0];
    if (!canUserManageProject(project, req.user)) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to modify this project." });
    }

    const { name, title, projectName, description, status } = req.body;
    const finalName = name || title || projectName;

    let updateFields = [];
    let values = [];
    let idx = 1;

    if (finalName !== undefined) {
      updateFields.push(`name = $${idx++}`);
      values.push(finalName);
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
      return res.json(project);
    }

    values.push(req.params.id);
    const query = `UPDATE projects SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`;
    
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE PROJECT
 * Admin can delete any project. Co-admin can only delete their own project.
 */
export const deleteProject = async (req, res) => {
  try {
    if (!isUUID(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const currentResult = await pool.query("SELECT * FROM projects WHERE id = $1", [req.params.id]);
    if (currentResult.rowCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = currentResult.rows[0];
    if (!canUserManageProject(project, req.user)) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to delete this project." });
    }

    await pool.query("DELETE FROM projects WHERE id = $1", [req.params.id]);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ARCHIVE PROJECT
 */
export const archiveProject = async (req, res) => {
  try {
    if (!isUUID(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const currentResult = await pool.query("SELECT * FROM projects WHERE id = $1", [req.params.id]);
    if (currentResult.rowCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = currentResult.rows[0];
    if (!canUserManageProject(project, req.user)) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to archive this project." });
    }

    const result = await pool.query(
      "UPDATE projects SET is_archived = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    res.json({ message: "Project archived successfully", project: result.rows[0] });
  } catch (err) {
    console.error("Error archiving project:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * RESTORE PROJECT
 */
export const restoreProject = async (req, res) => {
  try {
    if (!isUUID(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const currentResult = await pool.query("SELECT * FROM projects WHERE id = $1", [req.params.id]);
    if (currentResult.rowCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = currentResult.rows[0];
    if (!canUserManageProject(project, req.user)) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to restore this project." });
    }

    const result = await pool.query(
      "UPDATE projects SET is_archived = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    res.json({ message: "Project restored successfully", project: result.rows[0] });
  } catch (err) {
    console.error("Error restoring project:", err);
    res.status(500).json({ message: err.message });
  }
};
