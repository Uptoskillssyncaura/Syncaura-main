import { useState, useEffect } from "react";
import { Smile, Meh, Frown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import api from "../../config/axios";

// ─── Avatar circle ────────────────────────────────────────────────────────────
const Avatar = ({ color }) => (
  <div
    className="w-6 h-6 rounded-full border-2 border-white -ml-1.5 first:ml-0 shrink-0 flex items-center justify-center text-[10px] text-white font-bold"
    style={{ background: color || "#3b82f6" }}
  />
);

// ─── Workload Bar ─────────────────────────────────────────────────────────────
const WorkloadBar = ({ name, pct, initials, avatarColor, taskCount }) => {
  const isOver = pct > 100;
  const barColor = isOver ? "#ef4444" : pct >= 80 ? "#3b82f6" : "#22c55e";
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ background: avatarColor || "#3b82f6" }}
      >
        {initials}
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">{name}</span>
          <span className="text-[12px] font-bold" style={{ color: barColor }}>
            {taskCount} tasks ({pct}%)
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(pct, 100)}%`, background: barColor }}
          />
        </div>
      </div>
    </div>
  );
};

const PAGE_SIZE = 3;

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuIdx, setOpenMenuIdx] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/projects"),
      api.get("/tasks"),
      api.get("/users/all"),
      api.get("/notifications", { params: { limit: 5 } }),
    ])
      .then(([projectsRes, tasksRes, usersRes, notifsRes]) => {
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setNotifications(notifsRes.data?.data || (Array.isArray(notifsRes.data) ? notifsRes.data : []));
      })
      .catch((err) => {
        console.warn("Failed to load coadmin projects section data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const mappedProjects = projects.map((p) => {
    const pTasks = tasks.filter((t) => t.project_id === p.id || t.projectId === p.id);
    const pDone = pTasks.filter((t) => t.status === "DONE").length;
    const progress = pTasks.length
      ? Math.round((pDone / pTasks.length) * 100)
      : String(p.status).toUpperCase() === "COMPLETED"
      ? 100
      : 0;
    const isOverdue = pTasks.some((t) => t.status !== "DONE" && t.deadline && new Date(t.deadline) < new Date());

    let status = p.status || "In Progress";
    let statusColor = "text-green-600 dark:text-green-400";
    let statusBg = "bg-green-100 dark:bg-green-900/30";
    let health = "😊";
    let progressColor = "#22c55e";

    if (String(status).toUpperCase() === "COMPLETED" || progress === 100) {
      status = "Completed";
      statusColor = "text-blue-600 dark:text-blue-400";
      statusBg = "bg-blue-100 dark:bg-blue-900/30";
      progressColor = "#0ea5e9";
    } else if (isOverdue) {
      status = "Delayed";
      statusColor = "text-amber-600 dark:text-amber-400";
      statusBg = "bg-amber-100 dark:bg-amber-900/30";
      health = "😐";
      progressColor = "#f59e0b";
    }

    return {
      id: p.id,
      name: p.name || p.title || "Untitled Project",
      status,
      statusColor,
      statusBg,
      health,
      progress,
      progressColor,
      team: ["#8b5cf6", "#0ea5e9"],
    };
  });

  const healthyCount = mappedProjects.filter((p) => p.status === "Completed" || p.health === "😊").length;
  const warningCount = mappedProjects.filter((p) => p.health === "😐").length;
  const criticalCount = mappedProjects.filter((p) => p.health === "😟").length;

  const totalProjs = mappedProjects.length;
  const healthData = totalProjs
    ? [
        { name: "Healthy", value: Math.round((healthyCount / totalProjs) * 100), color: "#22c55e" },
        { name: "Warning", value: Math.round((warningCount / totalProjs) * 100), color: "#f59e0b" },
        { name: "Critical", value: Math.round((criticalCount / totalProjs) * 100), color: "#ef4444" },
      ]
    : [
        { name: "Healthy", value: 100, color: "#22c55e" },
        { name: "Warning", value: 0, color: "#f59e0b" },
        { name: "Critical", value: 0, color: "#ef4444" },
      ];

  const totalPages = Math.max(1, Math.ceil(mappedProjects.length / PAGE_SIZE));
  const paginatedProjects = mappedProjects.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Workload members
  const maxTaskCount = Math.max(1, ...users.map((u) => {
    return tasks.filter((t) => String(t.assigned_to).toLowerCase() === String(u.id).toLowerCase()).length;
  }));

  const workloadMembers = users.slice(0, 4).map((u) => {
    const uTasks = tasks.filter(
      (t) =>
        String(t.assigned_to).toLowerCase() === String(u.id).toLowerCase() ||
        String(t.assigned_to).toLowerCase() === String(u.email || "").toLowerCase() ||
        String(t.assigned_to).toLowerCase() === String(u.name || "").toLowerCase()
    );
    const pct = Math.round((uTasks.length / maxTaskCount) * 100);
    const initials = (u.name || "U")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return {
      name: u.name || "Member",
      pct,
      taskCount: uTasks.length,
      initials,
      avatarColor: "#8b5cf6",
    };
  });

  return (
    <div className="flex flex-col gap-4 font-sans pb-16 px-0 sm:px-2">
      {/* ── Top Row: Health & Workload ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Project Health Status */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Project Health Overview</h2>
          <div className="flex items-center gap-6">
            <div className="w-[140px] h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={healthData} dataKey="value" innerRadius={45} outerRadius={65} paddingAngle={3}>
                    {healthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2">
              {healthData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workload Capacity */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Team Workload Distribution</h2>
          {workloadMembers.length === 0 && !loading && (
            <p className="text-xs text-slate-400 py-4">No team member workload to show.</p>
          )}
          {workloadMembers.map((m) => (
            <WorkloadBar key={m.name} {...m} />
          ))}
        </div>
      </div>

      {/* ── Projects List ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">All Active Projects</h2>
        {loading && <p className="text-sm text-slate-400 py-6 text-center">Loading projects...</p>}
        {!loading && mappedProjects.length === 0 && (
          <p className="text-sm text-slate-400 py-6 text-center">No projects available.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedProjects.map((p, i) => (
            <div
              key={p.id || i}
              className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/30"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-[14px] font-bold text-slate-700 dark:text-slate-200">{p.name}</h3>
                  <span className={`inline-block mt-1 text-[10px] rounded-full px-2 py-0.5 font-bold uppercase ${p.statusBg} ${p.statusColor}`}>
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {p.health === "😊" && <Smile size={20} className="text-green-500" />}
                  {p.health === "😐" && <Meh size={20} className="text-amber-400" />}
                  {p.health === "😟" && <Frown size={20} className="text-red-500" />}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-slate-400 font-medium">Progress</span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${p.progress}%`, background: p.progressColor }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {mappedProjects.length > 0 && (
          <div className="flex justify-between items-center mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[12px] text-slate-400">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, mappedProjects.length)} of {mappedProjects.length} projects
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1c1c1e] text-[12px] text-slate-600 dark:text-slate-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed btn-hover"
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1c1c1e] text-[12px] text-slate-600 dark:text-slate-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed btn-hover"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Issues & Alerts ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[15px] font-bold text-slate-700 dark:text-slate-200">Issues & Alerts</span>
          <span className="text-[10px] bg-red-500 text-white rounded-full px-2.5 py-0.5 font-bold">
            {notifications.length} Total
          </span>
        </div>

        {notifications.length === 0 ? (
          <p className="text-[13px] text-slate-400 text-center py-6">No active alerts</p>
        ) : (
          <div className="flex flex-wrap gap-4 m-0 sm:m-3 pb-1">
            {notifications.map((alert) => (
              <div
                key={alert.id || alert._id}
                className="flex-1 min-w-[280px] p-3 flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-slate-800 dark:text-white leading-tight">{alert.title}</p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 leading-[1.4]">
                    {alert.message || alert.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}