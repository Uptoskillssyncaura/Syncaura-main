import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import api from "../../config/axios";

// ─── Animated count-up hook ───────────────────────────────────────────────────
function useCountUp(target, duration = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const tgt = Number(target) || 0;
    if (tgt === 0) {
      setCount(0);
      return;
    }
    const step = tgt / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= tgt) {
        setCount(tgt);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ─── Animated progress bar ────────────────────────────────────────────────────
function AnimatedBar({ pct, colorClass, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 100);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <div
        className={`h-full ${colorClass} rounded-full`}
        style={{ width: `${width}%`, transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </div>
  );
}

// ─── Tooltip wrapper ──────────────────────────────────────────────────────────
function TooltipHint({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded-md whitespace-nowrap z-50 shadow-lg"
          style={{ animation: "fadeIn 0.18s ease both" }}
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard Section ───────────────────────────────────────────────────
export default function DashboardSection() {
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Workload");
  const [expandedBottleneck, setExpandedBottleneck] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/tasks"),
      api.get("/notifications", { params: { limit: 5 } }),
      api.get("/users/all"),
    ])
      .then(([tasksRes, notifsRes, usersRes]) => {
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        setNotifications(notifsRes.data?.data || (Array.isArray(notifsRes.data) ? notifsRes.data : []));
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      })
      .catch((err) => {
        console.warn("Failed to load co-admin dashboard data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.status === "DONE").length;
  const inProgressTasksCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const blockedTasksCount = tasks.filter((t) => t.status === "BLOCKED").length;
  const todoTasksCount = tasks.filter((t) => t.status === "TODO").length;

  const totalTasks = useCountUp(totalTasksCount);
  const completed = useCountUp(completedTasksCount);
  const inProgress = useCountUp(inProgressTasksCount);
  const blocked = useCountUp(blockedTasksCount);

  const completionPct = totalTasksCount ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  const riskLevel = blockedTasksCount > 0 ? "High" : inProgressTasksCount > completedTasksCount ? "Moderate" : "Low";

  // Build member progress rows from users and their assigned tasks
  const progressRows = users.slice(0, 5).map((u, i) => {
    const uTasks = tasks.filter(
      (t) =>
        String(t.assigned_to).toLowerCase() === String(u.id).toLowerCase() ||
        String(t.assigned_to).toLowerCase() === String(u.email || "").toLowerCase() ||
        String(t.assigned_to).toLowerCase() === String(u.name || "").toLowerCase()
    );
    const uDone = uTasks.filter((t) => t.status === "DONE").length;
    const pct = uTasks.length ? Math.round((uDone / uTasks.length) * 100) : 0;
    const barColor = pct === 100 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-500" : "bg-amber-500";
    return {
      name: u.name || "Member",
      total: uTasks.length,
      done: uDone,
      pct,
      bar: barColor,
      label: uTasks.length ? `${pct}% (${uDone}/${uTasks.length})` : "No tasks",
      labelCls: pct === 100 ? "text-emerald-500" : "text-blue-500",
      delay: i * 80,
    };
  });

  const bottleneckRows = [
    {
      id: "backlog",
      label: "Backlog (To Do)",
      tasks: `${todoTasksCount} Tasks`,
      time: null,
      timeColor: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      leftBorder: "",
      indent: "w-[0%]",
      width: "w-full",
      stuck: false,
    },
    {
      id: "dev",
      label: "In Progress",
      tasks: `${inProgressTasksCount} Tasks`,
      time: null,
      timeColor: "text-emerald-500 dark:text-emerald-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      leftBorder: "border-l-[3px] border-emerald-400",
      indent: "w-[5%] sm:w-[10%]",
      width: "w-[90%] sm:w-[80%]",
      stuck: false,
    },
    {
      id: "devstuck",
      label: "Blocked / Stuck",
      tasks: `${blockedTasksCount} Blocked`,
      time: null,
      timeColor: "text-red-500 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/30",
      leftBorder: "border-l-[3px] border-red-400",
      indent: "w-[10%] sm:w-[20%]",
      width: "w-[85%] sm:w-[60%]",
      stuck: blockedTasksCount > 0,
    },
    {
      id: "done",
      label: "Done",
      tasks: `${completedTasksCount} Tasks`,
      time: null,
      timeColor: "",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      leftBorder: "",
      indent: "w-[30%]",
      width: "w-[40%]",
      stuck: false,
    },
  ];

  return (
    <div className="flex flex-col gap-4 font-sans pb-16 px-0 sm:px-2">
      <style>{`
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .hover-lift { transition: transform 0.16s ease, box-shadow 0.16s ease; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 22px -4px rgba(0,0,0,0.12); }
      `}</style>

      {/* ── 5 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total Tasks */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover-lift cursor-default">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 mb-1">Total Tasks</p>
            <TooltipHint text="All tasks">
              <div className="w-9 h-9 rounded-lg bg-blue-200 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="6" width="3" height="3" rx="0.5" fill="#ffffff" />
                  <rect x="9" y="7" width="11" height="1.5" rx="0.75" fill="#ffffff" />
                  <rect x="4" y="11" width="3" height="3" rx="0.5" fill="#ffffff" />
                  <rect x="9" y="12" width="11" height="1.5" rx="0.75" fill="#ffffff" />
                  <rect x="4" y="16" width="3" height="3" rx="0.5" fill="#ffffff" />
                  <rect x="9" y="17" width="11" height="1.5" rx="0.75" fill="#ffffff" />
                </svg>
              </div>
            </TooltipHint>
          </div>
          <div className="flex gap-3 items-end">
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none">
              {loading ? "..." : totalTasks}
            </p>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover-lift cursor-default">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 mb-1">Completed</p>
            <TooltipHint text="Tasks finished">
              <div className="w-9 h-9 rounded-2xl bg-green-200 dark:bg-green-900/50 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </TooltipHint>
          </div>
          <div className="flex gap-3 items-end">
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none">
              {loading ? "..." : completed}
            </p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover-lift cursor-default">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 mb-1">In Progress</p>
            <TooltipHint text="Actively being worked on">
              <div className="w-9 h-9 rounded-2xl bg-blue-200 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <circle cx="5" cy="12" r="2" fill="#ffffff" />
                  <circle cx="12" cy="12" r="2" fill="#ffffff" />
                  <circle cx="19" cy="12" r="2" fill="#ffffff" />
                </svg>
              </div>
            </TooltipHint>
          </div>
          <div className="flex gap-3 items-end">
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none">
              {loading ? "..." : inProgress}
            </p>
          </div>
        </div>

        {/* Blocked */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover-lift cursor-default">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 mb-1">Blocked</p>
            <TooltipHint text="Tasks currently blocked">
              <div className="w-9 h-9 rounded-2xl bg-red-200 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#ffffff" strokeWidth="2" />
                  <path d="M6 18L18 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </TooltipHint>
          </div>
          <div className="flex gap-3 items-end">
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none">
              {loading ? "..." : blocked}
            </p>
          </div>
        </div>

        {/* Risk Level */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover-lift cursor-default">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 mb-1">Risk Level</p>
            <TooltipHint text="Overall risk status">
              <div className="w-9 h-9 rounded-2xl bg-amber-200 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L22 21H2L12 3Z" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M12 10v4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="17" r="1" fill="#ffffff" />
                </svg>
              </div>
            </TooltipHint>
          </div>
          <div className="flex gap-3">
            <p className="text-3xl font-bold text-slate-800 dark:text-white leading-none">{riskLevel}</p>
          </div>
        </div>
      </div>

      {/* ── Sprint Status ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold text-slate-500 dark:text-slate-400">Task Completion Rate</p>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 sm:ml-8">Progress</span>
          <span className="text-xl font-extrabold sm:mr-10 text-slate-800 dark:text-white">
            {loading ? "..." : `${completionPct}%`}
          </span>
        </div>
        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden sm:w-[calc(100%-5rem)] sm:ml-[5rem]">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${completionPct}%` }} />
        </div>
      </div>

      {/* ── Project Progress Overview ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-slate-500 dark:text-slate-400">Team Workload Overview</span>
          <button
            onClick={() => setViewDetailsOpen((v) => !v)}
            className="text-xs text-blue-500 cursor-pointer border-0 bg-transparent hover:text-blue-700 transition-colors font-medium btn-hover"
          >
            {viewDetailsOpen ? "Hide Details ▲" : "View Details ▼"}
          </button>
        </div>

        {progressRows.length === 0 && !loading && (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-4">No team members available.</p>
        )}

        {progressRows.map((row) => (
          <div key={row.name} className="sm:ml-6 ml-2 sm:mr-4 mr-2 mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{row.name}</span>
              <span className={`text-[11px] font-semibold ${row.labelCls}`}>{row.label}</span>
            </div>
            <AnimatedBar pct={row.pct} colorClass={row.bar} delay={row.delay} />
          </div>
        ))}

        {viewDetailsOpen && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {progressRows.map((p) => (
                <div
                  key={p.name}
                  className="bg-slate-50 dark:bg-[rgba(46,47,47,0.5)] rounded-lg p-2.5 text-center hover-lift cursor-default"
                >
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{p.name}</p>
                  <p className="text-lg font-extrabold text-blue-500">
                    {p.done}
                    <span className="text-slate-300 font-normal text-sm">/{p.total}</span>
                  </p>
                  <p className="text-[10px] text-slate-400">tasks done</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottleneck Detection ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm w-full">
        <div className="flex justify-between items-center mb-5">
          <span className="text-base font-bold text-slate-500 dark:text-slate-400">Status Distribution</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {bottleneckRows.map((row) => (
            <div key={row.id} className="flex w-full">
              <div className={`${row.indent} shrink-0`} />
              <div
                className={`${row.width} h-9 ${row.bg} rounded-lg flex items-center justify-between px-2 sm:px-4 ${row.leftBorder}
                  cursor-pointer transition-all duration-200 hover:brightness-95 hover:shadow-sm`}
                style={{ paddingLeft: row.leftBorder ? "12px" : "16px" }}
              >
                <span className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">{row.label}</span>
                <span className={`text-[12px] ${row.stuck ? "font-semibold text-red-500" : "text-slate-400"}`}>
                  {row.tasks}
                </span>
              </div>
              {row.indent !== "w-[0%]" && <div className={`${row.indent} shrink-0`} />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Issues & Alerts ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-extrabold text-[#64748b] dark:text-slate-300">Issues & Alerts</span>
          <span className="text-[12px] bg-red-50 text-red-400 rounded-full px-3 py-1 font-bold">
            {notifications.length} Total
          </span>
        </div>

        {notifications.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-2">No active alerts.</p>
        )}

        <div className="flex flex-col md:flex-row flex-wrap gap-3">
          {notifications.map((a) => (
            <div
              key={a.id || a._id}
              className="flex-1 min-w-[240px] bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <p className="text-[14px] font-bold text-slate-700 dark:text-white">{a.title}</p>
              <p className="text-[12px] text-slate-400 mt-1">{a.message || a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}