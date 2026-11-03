export const permit = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRole = String(req.user.role).toLowerCase();
    const normalizedAllowed = allowedRoles.map((r) => String(r).toLowerCase());

    const isAllowed =
      normalizedAllowed.includes(userRole) ||
      (userRole === "coadmin" && normalizedAllowed.includes("co-admin")) ||
      (userRole === "co-admin" && normalizedAllowed.includes("coadmin")) ||
      (userRole === "employee" && (normalizedAllowed.includes("user") || normalizedAllowed.includes("employee"))) ||
      (userRole === "user" && (normalizedAllowed.includes("user") || normalizedAllowed.includes("employee")));

    if (!isAllowed) {
      return res.status(403).json({ message: "Forbidden: Access denied for this role." });
    }

    next();
  };
};
