export const isUUID = (str) => {
  if (!str || typeof str !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
};

export const resolveAssignee = (task, usersList = [], currentUser = null) => {
  if (!task) return null;

  let name = "";
  let email = "";

  // 1. Direct joined fields from backend
  if (task.assigned_user_name) name = String(task.assigned_user_name).trim();
  if (task.assigned_user_email) email = String(task.assigned_user_email).trim();
  if (task.assignedUserName && !name) name = String(task.assignedUserName).trim();
  if (task.user?.name && !name) name = String(task.user.name).trim();
  if (task.user?.email && !email) email = String(task.user.email).trim();

  const rawAssigned = String(task.assignedTo || task.assigned_to || "").trim();

  // If rawAssigned is an email
  if (rawAssigned.includes("@") && !email) {
    email = rawAssigned;
  }

  // 2. Search usersList (by id, email, or name)
  if (usersList && usersList.length > 0 && (!name || !email)) {
    const matchedUser = usersList.find((u) => {
      const uId = String(u.id || "").toLowerCase();
      const uEmail = String(u.email || "").toLowerCase();
      const uName = String(u.name || "").toLowerCase();
      const rawLower = rawAssigned.toLowerCase();

      return (
        (uId && (uId === rawLower || uId === String(task.assigned_to || "").toLowerCase())) ||
        (uEmail && (uEmail === rawLower || (email && uEmail === email.toLowerCase()))) ||
        (uName && (uName === rawLower || (name && uName === name.toLowerCase())))
      );
    });

    if (matchedUser) {
      if (!name && matchedUser.name) name = matchedUser.name;
      if (!email && matchedUser.email) email = matchedUser.email;
    }
  }

  // 3. Search currentUser
  if (currentUser && (!name || !email)) {
    const curId = String(currentUser.id || "").toLowerCase();
    const curEmail = String(currentUser.email || "").toLowerCase();
    const curName = String(currentUser.name || "").toLowerCase();
    const rawLower = rawAssigned.toLowerCase();

    if (
      (curId && (curId === rawLower || curId === String(task.assigned_to || "").toLowerCase())) ||
      (curEmail && (curEmail === rawLower || (email && curEmail === email.toLowerCase()))) ||
      (curName && (curName === rawLower || (name && curName === name.toLowerCase())))
    ) {
      if (!name && currentUser.name) name = currentUser.name;
      if (!email && currentUser.email) email = currentUser.email;
    }
  }

  // 4. If rawAssigned is a human name (not UUID and not email)
  if (!name && rawAssigned && !isUUID(rawAssigned) && !rawAssigned.includes("@")) {
    name = rawAssigned;
  }

  // 5. If we have email but still no name, format a clean name from email
  // e.g. "soham.patil@gmail.com" -> "Soham Patil"
  if (!name && email) {
    const prefix = email.split("@")[0];
    name = prefix
      .replace(/[._-]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  // 6. Fallback if still empty
  if (!name && !email) {
    if (rawAssigned && !isUUID(rawAssigned)) {
      name = rawAssigned;
    } else {
      name = "Assigned Employee";
    }
  }

  return {
    name: name || "Assigned Employee",
    email: email || "",
  };
};

export const getAssigneeDisplay = (task, usersList = [], currentUser = null) => {
  const info = resolveAssignee(task, usersList, currentUser);
  if (!info) return "Unassigned";
  if (info.name && info.email) {
    return `${info.name} (${info.email})`;
  }
  return info.name || info.email || "Unassigned";
};

export const getAssigneeBadge = (task, usersList = [], currentUser = null) => {
  return resolveAssignee(task, usersList, currentUser);
};

export const getTaskCreatorInfo = (task, usersList = [], currentUser = null) => {
  if (!task) return null;

  const assignee = resolveAssignee(task, usersList, currentUser);

  let creatorName = task.creator_user_name || "";
  let creatorEmail = task.creator_user_email || "";
  let creatorRole = task.creator_user_role || "";

  if (!creatorName && task.created_by) {
    const matched = (usersList || []).find((u) => String(u.id) === String(task.created_by));
    if (matched) {
      creatorName = matched.name;
      creatorEmail = matched.email;
      creatorRole = matched.role;
    } else if (currentUser && String(currentUser.id) === String(task.created_by)) {
      creatorName = currentUser.name;
      creatorEmail = currentUser.email;
      creatorRole = currentUser.role;
    }
  }

  const isSelfAssigned =
    (task.created_by && task.assigned_to && String(task.created_by) === String(task.assigned_to)) ||
    (creatorEmail && assignee?.email && creatorEmail.toLowerCase() === assignee.email.toLowerCase()) ||
    (creatorName && assignee?.name && creatorName.toLowerCase() === assignee.name.toLowerCase());

  return {
    name: creatorName,
    email: creatorEmail,
    role: creatorRole,
    isSelfAssigned: Boolean(isSelfAssigned),
    label: isSelfAssigned
      ? "Self-created"
      : creatorName
      ? `Assigned by ${creatorName}${creatorRole ? ` (${creatorRole})` : ""}`
      : "Assigned by Admin",
  };
};
