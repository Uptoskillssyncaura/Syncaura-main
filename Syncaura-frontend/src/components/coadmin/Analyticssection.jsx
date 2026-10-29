import { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import api from "../../config/axios";

export default function AnalyticsSection() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/tasks"), api.get("/projects"), api.get("/users/all")])
      .then(([tasksRes, projsRes, usersRes]) => {
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        setProjects(Array.isArray(projsRes.data) ? projsRes.data : []);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      })
      .catch((err) => console.warn("Failed to load analytics data:", err))
      .finally(() => setLoading(false));
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const blockedTasks = tasks.filter((t) => t.status === "BLOCKED").length;
  const todoTasks = tasks.filter((t) => t.status === "TODO").length;
  const overdueTasks = tasks.filter((t) => t.status !== "DONE" && t.deadline && new Date(t.deadline) < new Date()).length;

  const progressPct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const inProgressPct = totalTasks ? Math.round((inProgressTasks / totalTasks) * 100) : 0;
  const blockedPct = totalTasks ? Math.round((blockedTasks / totalTasks) * 100) : 0;
  const todoPct = totalTasks ? Math.round((todoTasks / totalTasks) * 100) : 0;

  const deliveryDonut = totalTasks
    ? [
        { name: "Delivered", value: progressPct, color: "#2563eb" },
        { name: "Remaining", value: 100 - progressPct, color: "#e2e8f0" },
      ]
    : [
        { name: "Delivered", value: 0, color: "#2563eb" },
        { name: "Remaining", value: 100, color: "#e2e8f0" },
      ];

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
    const isOver = pct >= 100 && uTasks.length > 5;
    return {
      name: u.name || "Member",
      label: `${uTasks.length} Tasks (${pct}%)`,
      pct: Math.min(pct, 100),
      barColor: isOver ? "#f87171" : pct >= 50 ? "#3b82f6" : "#22c55e",
      trackColor: isOver ? "#fee2e2" : "#dbeafe",
      isOver,
    };
  });

  return (
    <div className="flex flex-col gap-4 font-sans pb-10 px-0 sm:px-2">
      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-4 pt-3 pb-4">
          <span className="text-[13px] text-slate-400 font-medium">Total Tasks</span>
          <p className="text-[32px] font-extrabold text-slate-700 dark:text-slate-200 leading-none mt-2">
            {loading ? "..." : totalTasks}
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-4 pt-3 pb-4">
          <span className="text-[13px] text-slate-400 font-medium">Completed</span>
          <p className="text-[32px] font-extrabold text-slate-700 dark:text-slate-200 leading-none mt-2">
            {loading ? "..." : completedTasks}
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-4 pt-3 pb-4">
          <span className="text-[13px] text-slate-400 font-medium">Overall Progress</span>
          <p className="text-[32px] font-extrabold text-slate-700 dark:text-slate-200 leading-none mt-2">
            {loading ? "..." : `${progressPct}%`}
          </p>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div
          className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-4 pt-3 pb-4"
          style={{ borderLeft: "4px solid #ef4444" }}
        >
          <span className="text-[13px] text-slate-400 font-medium">Overdue Tasks</span>
          <p className="text-[32px] font-extrabold text-slate-700 dark:text-slate-200 leading-none mt-2">
            {loading ? "..." : overdueTasks}
          </p>
        </div>
      </div>

      {/* ── Status Distribution ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-4">
        <span className="text-[16px] font-bold text-slate-800 dark:text-white">Task Status Breakdown</span>

        <div className="rounded-xl overflow-hidden flex my-5" style={{ height: 60 }}>
          <div
            className="flex items-center justify-center bg-slate-200 dark:bg-slate-700"
            style={{ width: `${todoPct || (totalTasks === 0 ? 25 : 0)}%` }}
          >
            <span className="text-[18px] font-extrabold text-slate-600 dark:text-slate-300">{todoTasks}</span>
          </div>
          <div
            className="flex items-center justify-center bg-blue-500"
            style={{ width: `${inProgressPct || (totalTasks === 0 ? 25 : 0)}%` }}
          >
            <span className="text-[18px] font-extrabold text-white">{inProgressTasks}</span>
          </div>
          <div
            className="flex items-center justify-center bg-red-500"
            style={{ width: `${blockedPct || (totalTasks === 0 ? 25 : 0)}%` }}
          >
            <span className="text-[18px] font-extrabold text-white">{blockedTasks}</span>
          </div>
          <div
            className="flex items-center justify-center bg-green-500"
            style={{ width: `${progressPct || (totalTasks === 0 ? 25 : 0)}%` }}
          >
            <span className="text-[18px] font-extrabold text-white">{completedTasks}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-8 justify-around">
          {[
            { dot: "#94a3b8", count: todoTasks, label: `To Do (${todoPct}%)` },
            { dot: "#3b82f6", count: inProgressTasks, label: `In Progress (${inProgressPct}%)` },
            { dot: "#ef4444", count: blockedTasks, label: `Blocked (${blockedPct}%)` },
            { dot: "#22c55e", count: completedTasks, label: `Done (${progressPct}%)` },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full shrink-0 mt-1" style={{ background: item.dot }} />
              <div>
                <p className="text-[20px] font-extrabold text-slate-700 dark:text-slate-200 leading-tight">
                  {item.count}
                </p>
                <p className="text-[11px] text-slate-400 leading-tight">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Team Workload Distribution ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-4">
        <span className="text-[16px] font-bold text-slate-800 dark:text-white mb-4 block">
          Team Workload Distribution
        </span>

        {workloadMembers.length === 0 && !loading && (
          <p className="text-xs text-slate-400 py-4">No team workload data available.</p>
        )}

        {workloadMembers.map((m, idx) => (
          <div key={m.name} className={`flex items-center gap-4 ${idx < workloadMembers.length - 1 ? "mb-5" : ""}`}>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">{m.name}</span>
                <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
                  {m.label}
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: m.trackColor }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${m.pct}%`, background: m.barColor }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Delivery Report ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-5">
        <p className="text-[16px] font-bold text-slate-800 dark:text-white mb-4">Task Completion Rate</p>
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryDonut}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {deliveryDonut.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[26px] font-extrabold text-slate-700 dark:text-slate-200 leading-none">
                {progressPct}%
              </span>
              <span className="text-[8px] font-bold text-slate-400 tracking-widest mt-0.5 uppercase">
                Completed
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 sm:gap-8">
            {[
              { dot: "#2563eb", label: "Completed Tasks", value: completedTasks },
              { dot: "#cbd5e1", label: "Remaining Tasks", value: totalTasks - completedTasks },
            ].map((d) => (
              <div key={d.label} className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded-full shrink-0 mt-1" style={{ background: d.dot }} />
                <div>
                  <p className="text-[12px] text-slate-400 leading-none">{d.label}</p>
                  <p className="text-[18px] font-bold text-slate-700 dark:text-slate-200 leading-tight mt-1">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}