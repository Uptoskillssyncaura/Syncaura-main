import { useState, useRef } from "react";
import { Smile, Meh, Frown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// ─── Data ─────────────────────────────────────────────────────────────────────
const healthData = [
  { name: "Healthy", value: 60, color: "#22c55e" },
  { name: "Warning", value: 30, color: "#f59e0b" },
  { name: "Critical", value: 10, color: "#ef4444" },
];

const workloadMembers = [
  { name: "Marcus L.", pct: 120, avatarColor: "#8b5cf6", initials: "ML" },
  { name: "Sarah J.", pct: 80, avatarColor: "#0ea5e9", initials: "SJ" },
  { name: "David K", pct: 45, avatarColor: "#10b981", initials: "DK" },
];

// Extended projects list for pagination (12 total)
const ALL_PROJECTS = [
  { name: "Alpha Initiative", status: "In Progress", statusColor: "text-green-600 dark:text-green-400", statusBg: "bg-green-100 dark:bg-green-900/30", health: "😊", progress: 75, progressColor: "#22c55e", team: ["#8b5cf6", "#0ea5e9","#10b981"] },
  { name: "Beta Launch", status: "Delayed", statusColor: "text-amber-600 dark:text-amber-400", statusBg: "bg-amber-100 dark:bg-amber-900/30", health: "😐", progress: 40, progressColor: "#f59e0b", team: ["#ef4444"] },
 { name: "Project Gamma", status: "At Risk", statusColor: "text-red-600 dark:text-red-400", statusBg: "bg-red-100 dark:bg-red-900/30", health: "😟", progress: 25, progressColor: "#ef4444", team: ["#3b82f6", "#10b981"] },
  { name: "Delta Pipeline", status: "In Progress", statusColor: "text-green-600 dark:text-green-400", statusBg: "bg-green-100 dark:bg-green-900/30", health: "😊", progress: 62, progressColor: "#22c55e", team: ["#8b5cf6"] },
  { name: "Epsilon UI", status: "Completed", statusColor: "text-blue-600 dark:text-blue-400", statusBg: "bg-blue-100 dark:bg-blue-900/30", health: "😊", progress: 100, progressColor: "#0ea5e9", team: ["#0ea5e9", "#8b5cf6"] },
  { name: "Zeta Backend", status: "In Progress", statusColor: "text-green-600 dark:text-green-400", statusBg: "bg-green-100 dark:bg-green-900/30", health: "😐", progress: 55, progressColor: "#22c55e", team: ["#ef4444", "#10b981"] },
 { name: "Eta Analytics", status: "In Progress", statusColor: "text-green-600 dark:text-green-400", statusBg: "bg-green-100 dark:bg-green-900/30", health: "😊", progress: 33, progressColor: "#22c55e", team: ["#3b82f6"] },
  { name: "Theta DevOps", status: "In Progress", statusColor: "text-green-600 dark:text-green-400", statusBg: "bg-green-100 dark:bg-green-900/30", health: "😊", progress: 88, progressColor: "#22c55e", team: ["#8b5cf6", "#0ea5e9", "#10b981"] },
 { name: "Iota Mobile", status: "In Progress", statusColor: "text-green-600 dark:text-green-400", statusBg: "bg-green-100 dark:bg-green-900/30", health: "😊", progress: 18, progressColor: "#22c55e", team: ["#ef4444"] },
  { name: "Kappa Infra", status: "Completed", statusColor: "text-blue-600 dark:text-blue-400", statusBg: "bg-blue-100 dark:bg-blue-900/30", health: "😊", progress: 100, progressColor: "#0ea5e9", team: ["#3b82f6", "#8b5cf6"] },
  { name: "Lambda Security", status: "In Progress", statusColor: "text-green-600 dark:text-green-400", statusBg: "bg-green-100 dark:bg-green-900/30", health: "😊", progress: 70, progressColor: "#22c55e", team: ["#10b981"] },
  { name: "Mu Testing", status: "In Progress", statusColor: "text-green-600 dark:text-green-400", statusBg: "bg-green-100 dark:bg-green-900/30", health: "😊", progress: 40, progressColor: "#22c55e", team: ["#0ea5e9", "#ef4444"] },
];

const PAGE_SIZE = 3;

// ─── Timeline data per view ────────────────────────────────────────────────────
const TIMELINE_DATA = {
  Month: {
    headers: ["Oct", "Nov", "Dec", "Jan"],
    cols: 4,
    projects: [
      { name: "Alpha Initiative", start: 0, span: 2.3, bgClass: "bg-green-200 dark:bg-green-900/50", textClass: "text-green-800 dark:text-green-200" },
      { name: "Beta Launch", start: 0.8, span: 1.5, bgClass: "bg-blue-200 dark:bg-blue-900/50", textClass: "text-blue-800 dark:text-blue-200" },
      { name: "Gamma Testing", start: 2, span: 1.1, bgClass: "bg-amber-200 dark:bg-amber-900/50", textClass: "text-amber-800 dark:text-amber-200" },
    ],
  },
  Quarter: {
    headers: ["Q1", "Q2", "Q3", "Q4"],
    cols: 4,
    projects: [
      { name: "Alpha Initiative", start: 0, span: 1.5, bgClass: "bg-green-200 dark:bg-green-900/50", textClass: "text-green-800 dark:text-green-200" },
      { name: "Beta Launch", start: 0.5, span: 2.5, bgClass: "bg-blue-200 dark:bg-blue-900/50", textClass: "text-blue-800 dark:text-blue-200" },
      { name: "Gamma Testing", start: 2, span: 2, bgClass: "bg-amber-200 dark:bg-amber-900/50", textClass: "text-amber-800 dark:text-amber-200" },
      { name: "Delta Pipeline", start: 1, span: 1, bgClass: "bg-pink-200 dark:bg-pink-900/50", textClass: "text-pink-800 dark:text-pink-200" },
    ],
  },
};

const ALL_ALERTS = [
  { id: 1, type: "red", title: "Dependency Blocked", desc: "Backend API delay is blocking Alpha Initiative timeline." },
  { id: 2, type: "amber", title: "Over-allocation", desc: "Designer Marcus is at 120% capacity this week." },
  { id: 3, type: "blue", title: "Budget Update", desc: "Q4 budget allocation needs review by Friday." },
  { id: 4, type: "red", title: "Deadline Missed", desc: "Beta Launch missed its Oct 30 milestone delivery." },
  { id: 5, type: "amber", title: "Resource Gap", desc: "No QA engineer assigned to Gamma Testing sprint." },
];

const cardStyles = {
  red: "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30",
  amber: "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30",
  blue: "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30",
};

const iconWrapperStyles = {
  red: "bg-red-100 dark:bg-red-900/50 border-2 border-red-300 dark:border-red-800",
  amber: "bg-amber-100 dark:bg-amber-900/50 border-2 border-amber-300 dark:border-amber-800",
  blue: "bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-300 dark:border-blue-800",
};

// ─── Avatar circle ────────────────────────────────────────────────────────────
const Avatar = ({ color }) => (
  <div
    className="w-6 h-6 rounded-full border-2 border-white -ml-1.5 first:ml-0 shrink-0"
    style={{ background: color }}
  />
);

// ─── Workload Bar ─────────────────────────────────────────────────────────────
const WorkloadBar = ({ name, pct, initials, avatarColor }) => {
  const isOver = pct > 100;
  const barColor = isOver ? "#ef4444" : pct >= 80 ? "#3b82f6" : "#22c55e";
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ background: avatarColor }}
      >
        {initials}
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">{name}</span>
          <span className={`text-xs font-semibold ${isOver ? "text-red-500" : "text-slate-500 dark:text-slate-400"}`}>{pct}%</span>
        </div>
        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(pct, 100)}%`, background: barColor }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Alert Icon ───────────────────────────────────────────────────────────────
function AlertIcon({ type }) {
  if (type === "red") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="8.1" y="4" width="1.8" height="6" rx="0.9" fill="red" />
        <circle cx="9" cy="13" r="1.1" fill="red" />
      </svg>
    );
  }
  if (type === "amber") {
    return (
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <circle cx="8" cy="5" r="3" className="fill-amber-400" />
        <path d="M2 16c0-3.314 2.686-6 6-6s6 2.686 6 6" className="fill-amber-400" />
        <rect x="13.8" y="1.8" width="1.4" height="2.8" rx="0.7" fill="#ffbf00" />
        <circle cx="14.5" cy="5.3" r="0.8" fill="#ffbf00" />
      </svg>
    );
  }
  if (type === "blue") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="5.5" r="1.1" fill="#64748b" />
        <rect x="8.1" y="8" width="1.8" height="5.5" rx="0.9" fill="#64748b" />
      </svg>
    );
  }
  return null;
}

// ─── Action Dropdown ──────────────────────────────────────────────────────────
function ActionMenu({ projectName, onClose }) {
  const actions = [
    { label: "👁 View", color: "#3b82f6" },
    { label: "✏️ Edit", color: "#10b981" },
    { label: "🗑 Delete", color: "#ef4444" },
  ];
  return (
    <div
      className="absolute right-8 z-50 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 w-36"
      style={{ top: "50%", transform: "translateY(-50%)" }}
    >
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={() => { alert(`${a.label.split(" ")[1]}: ${projectName}`); onClose(); }}
          className="w-full text-left px-4 py-2 text-[13px] hover:bg-slate-50 dark:bg-[rgba(46,47,47,0.5)] transition-colors border-0 bg-transparent cursor-pointer btn-hover"
          style={{ color: a.color }}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const [timelineView, setTimelineView] = useState("Month");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuIdx, setOpenMenuIdx] = useState(null);
  const [alerts, setAlerts] = useState(ALL_ALERTS.slice(0, 3));
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const tableRef = useRef(null);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(ALL_PROJECTS.length / PAGE_SIZE);
  const pagedProjects = ALL_PROJECTS.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ── Alert dismiss ───────────────────────────────────────────────────────────
  const dismissAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  // ── Show all / collapse alerts ──────────────────────────────────────────────
  const handleViewAllAlerts = () => {
    setShowAllAlerts(true);
    setAlerts(ALL_ALERTS);
  };

  // ── Timeline data ───────────────────────────────────────────────────────────
  const tl = TIMELINE_DATA[timelineView];

  return (
    <div className="flex flex-col gap-4 font-sans pb-16 bg-slate-50 dark:bg-[rgba(46,47,47,0.5)] min-h-screen px-0 sm:px-2">
      <style>{`
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── 5 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

        {/* Total Projects */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl px-4 py-3.5 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
          <div className="flex items-center justify-between gap-2 mb-5">
            <span className="text-[12px] text-slate-400 font-semibold tracking-wide uppercase">Total Projects</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="#94a3b8" strokeWidth="1.6" fill="#94a3b8" />
            </svg>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-500 dark:text-slate-400">{ALL_PROJECTS.length}</span>
            <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 rounded">↑ 2</span>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl px-4 py-3.5 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Active</span>
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <svg width="9" height="10" viewBox="0 0 8 9" fill="none">
                <path d="M1.5 1.5l5 3-5 3V1.5z" fill="white" />
              </svg>
            </div>
          </div>
          <span className="text-4xl font-bold text-slate-500 dark:text-slate-400">
            {ALL_PROJECTS.filter(p => p.status === "In Progress").length}
          </span>
        </div>

        {/* Completed */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl px-4 py-3.5 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
          <div className="flex items-center justify-between gap-2 mb-5">
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Completed</span>
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-500 dark:text-slate-400">
              {ALL_PROJECTS.filter(p => p.status === "Completed").length}
            </span>
            <span className="text-[11px] text-slate-400">This month</span>
          </div>
        </div>

        {/* Delayed */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl px-4 py-3.5 border border-slate-100 dark:border-slate-800 border-l-4 border-l-amber-400 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
          <div className="flex justify-between items-center mb-5">
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Delayed</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L22 21H2L12 3Z" fill="#f59e0b" />
              <path d="M12 10v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="17.5" r="1" fill="white" />
            </svg>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-3xl font-extrabold text-amber-500 mb-0.5">
              {ALL_PROJECTS.filter(p => p.status === "Delayed").length}
            </div>
            <p className="text-[11px] mt-3 text-slate-400">This month</p>
          </div>
        </div>

        {/* At Risk */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl px-4 py-3.5 border border-slate-100 dark:border-slate-800 border-l-4 border-l-red-500 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
          <div className="flex justify-between items-center mb-5">
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">At Risk</span>
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 1.5l6 6M7.5 1.5l-6 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-3xl font-extrabold text-red-500 mb-0.5">
              {ALL_PROJECTS.filter(p => p.status === "At Risk").length}
            </div>
            <p className="text-[11px] mt-3 text-slate-400">This month</p>
          </div>
        </div>
      </div>

      {/* ── Project Progress Overview ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-xl px-5 py-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[18px] font-bold text-slate-500 dark:text-slate-400">Project Progress Overview</span>
          {/* ✅ "View Details" scrolls to the All Projects table */}
          <button
            onClick={() => tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="text-xs text-blue-500 cursor-pointer font-medium bg-transparent border-0 hover:underline btn-hover"
          >
            View Details ↓
          </button>
        </div>
        {[
  { name: "Website Redesign", pct: 75, color: "#22c55e", lightColor: "#86efac" },
  { name: "Mobile App Launch", pct: 40, color: "#3b82f6", lightColor: "#93c5fd" },
  { name: "Mobile App Launch", pct: 40, color: "#3b82f6", lightColor: "#93c5fd" },
].map((p) => (
  <div key={p.name + p.color} className="mb-3.5 sm:mr-10 sm:ml-10">
    <div className="flex justify-between mb-1.5">
      <span className="text-[13px] text-slate-500 dark:text-slate-400">{p.name}</span>
      <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">{p.pct}%</span>
    </div>
    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
      <div className="h-full rounded-l-full" style={{ width: `${p.pct * 0.6}%`, background: p.color }} />
      <div className="h-full" style={{ width: `${p.pct * 0.4}%`, background: p.lightColor }} />
    </div>
  </div>
))}
      </div>

      {/* ── Health Status ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-xl px-5 py-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
        <p className="text-[18px] font-bold text-slate-500 dark:text-slate-400 mb-4">Health Status</p>
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20">
          <div className="relative shrink-0 w-[140px] h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%" cy="50%"
                  innerRadius={46} outerRadius={66}
                  dataKey="value"
                  startAngle={90} endAngle={-270}
                  strokeWidth={0}
                >
                  {healthData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white leading-none">{ALL_PROJECTS.length}</span>
              <span className="text-[9px] font-semibold text-slate-400 tracking-wider mt-0.5">PROJECTS</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-15">
            {healthData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 sm:gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: d.color }} />
                <div>
                  <p className="text-[12px] sm:text-[13px] font-semibold text-slate-700 dark:text-slate-200 leading-none">{d.name}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 ml-1 sm:ml-2 mt-0.5">({d.value}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Team Workload ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-xl px-5 py-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
        <p className="text-[18px] font-bold text-slate-500 dark:text-slate-400 mb-4">Team Workload</p>
        {workloadMembers.map((m) => (
          <WorkloadBar key={m.name} {...m} />
        ))}
      </div>

      {/* ── Project Timeline ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-xl px-5 py-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[18px] font-bold text-slate-500 dark:text-slate-400">Project Timeline</span>
          {/* ✅ Month/Quarter toggle now renders different data */}
          <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {["Month", "Quarter"].map((v) => (
              <button
                key={v}
                onClick={() => setTimelineView(v)}
                className={`btn-hover px-4 py-1.5 text-xs font-semibold border-0 cursor-pointer ${timelineView === v
                    ? "bg-slate-800 text-white"
                    : "bg-white dark:bg-[#1c1c1e] text-slate-400 hover:text-slate-600 dark:text-slate-300"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic headers based on view */}
        <div className={`grid grid-cols-${tl.cols} mb-3 px-1`} style={{ display: "grid", gridTemplateColumns: `repeat(${tl.cols}, 1fr)` }}>
          {tl.headers.map((m) => (
            <span key={m} className="text-[10px] sm:text-[12px] text-slate-400 font-medium">{m}</span>
          ))}
        </div>

        {/* Timeline bars */}
        <div className="flex flex-col gap-2.5 relative">
          <div className="absolute inset-0 pointer-events-none" style={{ display: "grid", gridTemplateColumns: `repeat(${tl.cols}, 1fr)` }}>
            {Array.from({ length: tl.cols }).map((_, i) => (
              <div key={i} className="border-r border-slate-100 dark:border-slate-800 h-full last:border-r-0" />
            ))}
          </div>
          {tl.projects.map((p, i) => (
            <div key={i} className="h-8 sm:h-9 relative">
              <div
                className={`absolute h-full rounded-lg flex items-center pl-2 sm:pl-3 transition-all duration-500 ${p.bgClass}`}
                style={{
                  left: `${(p.start / tl.cols) * 100}%`,
                  width: `${(p.span / tl.cols) * 100}%`,
                }}
              >
                <span className={`text-[10px] sm:text-[12px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis ${p.textClass}`}>
                  {p.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── All Projects Table ── */}
      <div
        ref={tableRef}
        className="bg-white dark:bg-[#1c1c1e] rounded-xl px-5 py-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.07)]"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-[15px] font-bold text-slate-700 dark:text-slate-200">All Projects</span>
          <button className="bg-transparent border-0 cursor-pointer text-slate-400 text-xl leading-none tracking-widest btn-hover">···</button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["PROJECT NAME", "STATUS", "HEALTH", "PROGRESS", "TEAM", "ACTIONS"].map((h) => (
                  <th key={h} className="text-[10px] text-slate-400 font-semibold px-2 py-2 text-left tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedProjects.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-50 hover:bg-slate-50 dark:bg-[rgba(46,47,47,0.5)] transition-colors"
                  style={{ position: "relative" }}
                >
                  <td className="px-2 py-3 text-[13px] text-slate-700 dark:text-slate-200 font-semibold">{p.name}</td>
                  <td className="px-2 py-3">
                    <span
                      className={`text-[11px] rounded-full px-3 py-1 font-semibold whitespace-nowrap ${p.statusBg} ${p.statusColor}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    {p.health === "😊" && <Smile size={22} className="text-green-500" />}
                    {p.health === "😐" && <Meh size={22} className="text-amber-400" />}
                    {p.health === "😟" && <Frown size={22} className="text-red-500" />}
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.progressColor }} />
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex pl-1.5">
                      {p.team.map((c, j) => <Avatar key={j} color={c} />)}
                    </div>
                  </td>
                  <td className="px-2 py-3" style={{ position: "relative" }}>
                    <button
                      onClick={() => setOpenMenuIdx(openMenuIdx === i ? null : i)}
                      className="bg-transparent border-0 cursor-pointer text-slate-400 text-lg leading-none hover:text-slate-600 dark:text-slate-300 transition-colors btn-hover"
                    >
                      ⋮
                    </button>
                    {openMenuIdx === i && (
                      <ActionMenu
                        projectName={p.name}
                        onClose={() => setOpenMenuIdx(null)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-4">
          {pagedProjects.map((p, i) => (
            <div key={i} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-[14px] font-bold text-slate-700 dark:text-slate-200">{p.name}</h3>
                  <span className={`inline-block mt-1 text-[10px] rounded-full px-2 py-0.5 font-bold uppercase ${p.statusBg} ${p.statusColor}`}>
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {p.health === "😊" && <Smile size={22} className="text-green-500" />}
                  {p.health === "😐" && <Meh size={22} className="text-amber-400" />}
                  {p.health === "😟" && <Frown size={22} className="text-red-500" />}
                  <button
                    onClick={() => setOpenMenuIdx(openMenuIdx === i ? null : i)}
                    className="bg-transparent border-0 cursor-pointer text-slate-400 text-lg p-1 btn-hover"
                  >⋮</button>
                </div>
              </div>
              
              <div className="mb-3">
                 <div className="flex justify-between mb-1">
                   <span className="text-[11px] text-slate-400 font-medium">Progress</span>
                   <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{p.progress}%</span>
                 </div>
                 <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.progressColor }} />
                 </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex pl-1.5">
                   {p.team.map((c, j) => <Avatar key={j} color={c} />)}
                </div>
                <span className="text-[10px] text-slate-400 italic">Project Details →</span>
              </div>
              
              {openMenuIdx === i && (
                <div className="relative mt-2">
                   <ActionMenu projectName={p.name} onClose={() => setOpenMenuIdx(null)} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ✅ Pagination — functional Prev / Next with page count */}
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-slate-50">
          <span className="text-[12px] text-slate-400">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, ALL_PROJECTS.length)} of {ALL_PROJECTS.length} projects
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => { setCurrentPage((p) => p - 1); setOpenMenuIdx(null); }}
              className="px-3.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1c1c1e] text-[12px] text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:bg-[rgba(46,47,47,0.5)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed btn-hover"
            >
              Prev
            </button>
            {/* Page number pills */}
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrentPage(idx + 1); setOpenMenuIdx(null); }}
                className={`btn-hover w-7 h-7 rounded-md text-[12px] font-semibold border transition-colors cursor-pointer ${currentPage === idx + 1
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white dark:bg-[#1c1c1e] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-[rgba(46,47,47,0.5)]"}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => { setCurrentPage((p) => p + 1); setOpenMenuIdx(null); }}
              className="px-3.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1c1c1e] text-[12px] text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:bg-[rgba(46,47,47,0.5)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed btn-hover"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── Issues & Alerts ── */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[15px] font-bold text-slate-700 dark:text-slate-200">Issues & Alerts</span>
          <span className="text-[10px] bg-red-500 text-white rounded-full px-2.5 py-0.5 font-bold">
            5 New
          </span>
        </div>

        {alerts.length === 0 ? (
          <p className="text-[13px] text-slate-400 text-center py-6">✅ No active alerts</p>
        ) : (
          <div className="flex flex-wrap gap-4 m-0 sm:m-3 pb-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex-1 min-w-[280px] p-3 flex items-start gap-3 rounded-lg ${cardStyles[alert.type]}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${iconWrapperStyles[alert.type]}`}
                >
                  <AlertIcon type={alert.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-slate-800 dark:text-white leading-tight">{alert.title}</p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 leading-[1.4]">{alert.desc}</p>
                </div>
                {/* ✅ Dismiss button */}
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-slate-300 hover:text-slate-500 dark:text-slate-400 text-lg leading-none bg-transparent border-0 cursor-pointer flex-shrink-0 mt-0.5 transition-colors btn-hover"
                  title="Dismiss"
                >
                  ×
                </button>
              </div>
            ))}

            {/* ✅ "View all notifications" — loads remaining alerts */}
            {!showAllAlerts && (
              <div className="flex items-center">
                <button
                  onClick={handleViewAllAlerts}
                  className="bg-slate-600 hover:bg-slate-700 text-white text-[12px] font-semibold h-[80px] px-5 transition-colors whitespace-nowrap cursor-pointer border-0 btn-hover"
                >
                  View all<br />notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}