import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Clock } from "lucide-react";
// ─── Sprint Velocity data ──────────────────────────────────────────────────────
const velocityData = [
  { day: "Day 1", planned: 4, completed: 2 },
  { day: "Day 3", planned: 10, completed: 6 },
  { day: "Day 5", planned: 17, completed: 13 },
  { day: "Day 7", planned: 24, completed: 20 },
  { day: "Day 10", planned: 34, completed: 30 },
  { day: "Day 12", planned: 42, completed: 37 },
  { day: "Day 14", planned: 50, completed: 45 },
];

// ─── Delivery donut ────────────────────────────────────────────────────────────
const deliveryDonut = [
  { name: "Delivered", value: 75, color: "#2563eb" },
  { name: "Remaining", value: 25, color: "#e2e8f0" },
];

// ─── Custom dot: big hollow ring at Day 10 (index 4) ──────────────────────────
const VelocityDot = (props) => {
  const { cx, cy, index } = props;
  if (index === 4) {
    return (
      <g key="marker">
        <circle cx={cx} cy={cy} r={16} fill="white" stroke="#16a34a" strokeWidth={3} />
        <circle cx={cx} cy={cy} r={6} fill="#16a34a" />
      </g>
    );
  }
  return <g key={`dot-${index}`} />;
};

// ─────────────────────────────────────────────────────────────────────────────
export default function AnalyticsSection() {
  const [dismissed, setDismissed] = useState([]);
  const dismiss = (id) => setDismissed((p) => [...p, id]);

  return (
    <div className="flex flex-col gap-4 font-sans pb-10 px-0 sm:px-2">

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 1 — 4 STAT CARDS
      ════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* ── Card 1: Total Tasks 50 ── */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-4 pt-3 pb-4">
          {/* top row: icon + badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              {/* clipboard icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="8" y="2" width="8" height="4" rx="1.5" fill="#93c5fd" />
                <rect x="4" y="5" width="16" height="16" rx="2" stroke="#93c5fd" strokeWidth="1.8" fill="none" />
                <line x1="8" y1="11" x2="16" y2="11" stroke="#93c5fd" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="8" y1="15" x2="13" y2="15" stroke="#93c5fd" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 px-2 py-0.5 rounded-full">
              +4 this week
            </span>
          </div>
          {/* bottom row: label + number */}
          <div className="flex items-end justify-between">
            <span className="text-[13px] text-slate-400 font-medium">Total Tasks</span>
            <span className="text-[32px] font-extrabold text-slate-700 dark:text-slate-200 leading-none">50</span>
          </div>
        </div>

        {/* ── Card 2: Total Tasks 10 (Completed) ── */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-4 pt-3 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              {/* circle checkmark */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#22c55e" strokeWidth="2" fill="none" />
                <path d="M7.5 12.5l3 3 6-6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 px-2 py-0.5 rounded-full whitespace-nowrap">
              +12% vs last sprint
            </span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-[13px] text-slate-400 font-medium">Total Tasks</span>
            <span className="text-[32px] font-extrabold text-slate-700 dark:text-slate-200 leading-none">10</span>
          </div>
        </div>

        {/* ── Card 3: Sprint Progress 42% ── */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-4 pt-3 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              {/* sun/sprint icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4.5" fill="#f59e0b" />
                <line x1="12" y1="2" x2="12" y2="5.5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="18.5" x2="12" y2="22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <line x1="2" y1="12" x2="5.5" y2="12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <line x1="18.5" y1="12" x2="22" y2="12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <line x1="5.3" y1="5.3" x2="7.8" y2="7.8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <line x1="16.2" y1="16.2" x2="18.7" y2="18.7" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <line x1="5.3" y1="18.7" x2="7.8" y2="16.2" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <line x1="16.2" y1="7.8" x2="18.7" y2="5.3" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 px-2 py-0.5 rounded-full">
              On Track
            </span>
          </div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-[13px] text-slate-400 font-medium">Sprint Progress</span>
            <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">42%</span>
          </div>
          {/* amber progress bar */}
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: "42%" }} />
          </div>
        </div>

        {/* ── Card 4: Active Risks 5 — red left border ── */}
        <div
          className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-4 pt-3 pb-4"
          style={{ borderLeft: "4px solid #ef4444" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              {/* warning triangle */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 3.5L21.5 20.5H2.5L12 3.5Z" fill="#fca5a5" stroke="#ef4444" strokeWidth="1.4" strokeLinejoin="round" />
                <line x1="12" y1="10" x2="12" y2="15" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="17.8" r="0.9" fill="#ef4444" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-full">
              Action Required
            </span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-[13px] text-slate-400 font-medium">Active Risks</span>
            <span className="text-[32px] font-extrabold text-slate-700 dark:text-slate-200 leading-none">5</span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 2 — ISSUES & ALERTS (segmented bar)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-4">
        {/* header */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-[16px] font-bold text-slate-800 dark:text-white">Issues &amp; Alerts</span>
          <button className="bg-transparent border-0 cursor-pointer text-slate-400 text-xl leading-none tracking-widest btn-hover">···</button>
        </div>

        {/* segmented bar — rounded overall, no gap between segments */}
        <div className="rounded-xl overflow-hidden flex mb-5" style={{ height: 80 }}>
          {/* To Do — 30% — light grey */}
          <div
            className="flex items-center justify-center bg-slate-200 dark:bg-slate-700"
            style={{ width: "30%" }}
          >
            <span className="text-[22px] font-extrabold text-slate-600 dark:text-slate-300">15</span>
          </div>
          {/* In Progress — 40% — blue */}
          <div
            className="flex items-center justify-center bg-blue-500"
            style={{ width: "40%" }}
          >
            <span className="text-[22px] font-extrabold text-white">20</span>
          </div>
          {/* Blocked — 10% — red */}
          <div
            className="flex items-center justify-center bg-red-500"
            style={{ width: "10%" }}
          >
            <span className="text-[22px] font-extrabold text-white">5</span>
          </div>
          {/* Done — 20% — green */}
          <div
            className="flex items-center justify-center bg-green-500"
            style={{ width: "20%" }}
          >
            <span className="text-[22px] font-extrabold text-white">10</span>
          </div>
        </div>

        {/* legend row */}
        <div className="flex flex-wrap items-start gap-8 sm:gap-36 ml-30">
          {[
            { dot: "#94a3b8", count: "15", label: "To Do(30%)" },
            { dot: "#3b82f6", count: "20", label: "In Progress(40%)" },
            { dot: "#ef4444", count: "5", label: "Blocked(10%)" },
            { dot: "#22c55e", count: "10", label: "Done (20%)" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-2.5">
              <div
                className="w-3.5 h-3.5 rounded-full shrink-0 mt-1"
                style={{ background: item.dot }}
              />
              <div>
                <p className="text-[20px] font-extrabold text-slate-700 dark:text-slate-200 leading-tight ">{item.count}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 3 — SPRINT VELOCITY TREND
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 pt-4 pb-3">
        {/* header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[16px] font-bold text-slate-800 dark:text-white">Sprint Velocity Trend</span>
          <div className="flex items-center gap-5">
            {/* Planned — blue dashed rect */}
            <div className="flex items-center gap-2">
              <div
                className="rounded-sm"
                style={{
                  width: 28, height: 10,
                  background: "repeating-linear-gradient(90deg, #93c5fd 0px, #93c5fd 8px, transparent 8px, transparent 13px)",
                }}
              />
              <span className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Planned</span>
            </div>
            {/* Completed — green solid */}
            <div className="flex items-center gap-2">
              <div className="rounded-sm" style={{ width: 28, height: 4, background: "#22c55e" }} />
              <span className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Completed</span>
            </div>
          </div>
        </div>

        <div style={{ height: 230 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={velocityData} margin={{ top: 20, right: 16, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="greenAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              {/* Horizontal grid lines only */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                ticks={["Day 1", "Day 5", "Day 10", "Day 14"]}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                }}
                labelStyle={{ fontWeight: 700, color: "#1e293b", marginBottom: 2 }}
              />
              {/* Green filled area — Completed */}
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#16a34a"
                strokeWidth={3}
                fill="url(#greenAreaGrad)"
                dot={VelocityDot}
                activeDot={{ r: 5, fill: "#16a34a", stroke: "white", strokeWidth: 2 }}
              />
              {/* Blue dashed — Planned (no fill) */}
              <Area
                type="monotone"
                dataKey="planned"
                stroke="#93c5fd"
                strokeWidth={3}
                strokeDasharray="10 6"
                fill="none"
                dot={false}
                activeDot={{ r: 4, fill: "#3b82f6" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 4 — TEAM WORKLOAD DISTRIBUTION
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-4">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[16px] font-bold text-slate-800 dark:text-white">Team Workload Distribution</span>
          <button className="text-[13px] text-blue-500 font-semibold bg-transparent border-0 cursor-pointer hover:underline btn-hover">
            View All Members
          </button>
        </div>

        {[
          {
            name: "Marcus L.",
            label: "8 Tasks (100%)",
            pct: 82,
            barColor: "#3b82f6",
            trackColor: "#dbeafe",
            isOver: false,
            // placeholder avatar bg
            avatarBg: "#e0e7ef",
            avatarText: "ML",
          },
          {
            name: "Mike Ross",
            label: "Overload (120%)",
            pct: 100,
            barColor: "#f87171",
            trackColor: "#fee2e2",
            isOver: true,
            avatarBg: "#e0e7ef",
            avatarText: "MR",
          },
          {
            name: "David Chen",
            label: "4 Tasks (50%)",
            pct: 50,
            barColor: "#22c55e",
            trackColor: "#dcfce7",
            isOver: false,
            avatarBg: "#e0e7ef",
            avatarText: "DC",
          },
        ].map((m, idx) => (
          <div key={m.name} className={`flex items-center gap-4 ${idx < 2 ? "mb-5" : ""}`}>
            {/* circular avatar */}
            <div
              className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-[12px] font-bold text-slate-500 dark:text-slate-400 overflow-hidden"
              style={{ background: m.avatarBg }}
            >
              {/* person silhouette SVG as avatar placeholder */}
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="13" r="7" fill="#94a3b8" />
                <path d="M4 34c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="#94a3b8" />
              </svg>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">{m.name}</span>
                <span
                  className="text-[12px] font-semibold flex items-center gap-1"
                  style={{ color: m.isOver ? "#ef4444" : "#64748b" }}
                >
                  {m.isOver && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2.2" />
                      <line x1="12" y1="7" x2="12" y2="13" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" />
                      <circle cx="12" cy="16.5" r="1.1" fill="#ef4444" />
                    </svg>
                  )}
                  {m.label}
                </span>
              </div>
              {/* bar track */}
              <div className="h-3 rounded-full overflow-hidden" style={{ background: m.trackColor }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${m.pct}%`, background: m.barColor }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 5 — CRITICAL ALERTS
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[16px] font-bold text-slate-800 dark:text-white">Critical Alerts</span>
          <span className="text-[10px] font-extrabold text-white bg-red-500 rounded-full px-2.5 py-0.5">
            3 New
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Alert 1 — API Integration Blocked */}
          {!dismissed.includes(1) && (
            <div className="flex-1 min-w-[280px] border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex items-start gap-3 bg-slate-50">
              {/* red no-entry icon */}
              <div className="shrink-0 mt-0.5">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="13" stroke="#ef4444" strokeWidth="2" fill="white" />
                  <line x1="7" y1="14" x2="21" y2="14" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-snug">API Integration Blocked</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">Waiting on backend deployment.</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">Overdue by 2 days</p>
              </div>
              <button
                onClick={() => dismiss(1)}
                className="text-slate-300 hover:text-slate-500 dark:text-slate-400 bg-transparent border-0 cursor-pointer text-base shrink-0 btn-hover"
              >×</button>
            </div>
          )}

          {/* Alert 2 — QA Bottleneck */}
          {!dismissed.includes(2) && (
            <div className="flex-1 min-w-[280px] border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex items-start gap-3 bg-slate-50">
              {/* amber warning triangle */}
              <div className="shrink-0 mt-0.5">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 4L26 24H2L14 4Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.8" strokeLinejoin="round" />
                  <line x1="14" y1="12" x2="14" y2="18" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="14" cy="21" r="1" fill="#f59e0b" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-snug">QA Bottleneck</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">High volume of tickets in QA stage</p>
              </div>
              <button
                onClick={() => dismiss(2)}
                className="text-slate-300 hover:text-slate-500 dark:text-slate-400 bg-transparent border-0 cursor-pointer text-base shrink-0 btn-hover"
              >×</button>
            </div>
          )}

          {/* Alert 3 — Resource Unavailable */}
          {!dismissed.includes(3) && (
            <div className="flex-1 min-w-[280px] border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex items-start gap-3 bg-slate-50">
              {/* grey person-off icon */}
              <div className="shrink-0 mt-0.5">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="11" cy="9" r="4" stroke="#94a3b8" strokeWidth="1.8" fill="none" />
                  <path d="M4 24c0-3.866 3.134-7 7-7" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  <line x1="19" y1="14" x2="25" y2="20" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="25" y1="14" x2="19" y2="20" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-snug">Resource Unavailable</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">Designer out sick today</p>
              </div>
              <button
                onClick={() => dismiss(3)}
                className="text-slate-300 hover:text-slate-500 dark:text-slate-400 bg-transparent border-0 cursor-pointer text-base shrink-0 btn-hover"
              >×</button>
            </div>
          )}

          {/* View all notifications — grey button */}
          <button
            className="flex-1 min-w-[130px] rounded-xl border-0 cursor-pointer font-semibold text-white text-[13px] leading-snug px-6 py-4 transition-colors btn-hover"
            style={{ background: "#94a3b8" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#64748b")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#94a3b8")}
          >
            View all<br className="hidden md:block" /> notifications
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 6 — DELIVERY REPORT
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-5">
        <p className="text-[16px] font-bold text-slate-800 dark:text-white mb-4">Delivery Report</p>
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          {/* donut */}
          <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryDonut}
                  cx="50%" cy="50%"
                  innerRadius={48} outerRadius={68}
                  startAngle={90} endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {deliveryDonut.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[26px] font-extrabold text-slate-700 dark:text-slate-200 leading-none">75%</span>
              <span className="text-[8px] font-bold text-slate-400 tracking-widest mt-0.5 uppercase">
                Delievered
              </span>
            </div>
          </div>

          {/* legend: Planned + Delivered */}
          <div className="flex flex-wrap gap-6 sm:gap-8">
            {[
              { dot: "#cbd5e1", label: "Planned", value: 24 },
              { dot: "#2563eb", label: "Delivered", value: 18 },
            ].map((d) => (
              <div key={d.label} className="flex items-start gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 mt-1"
                  style={{ background: d.dot }}
                />
                <div>
                  <p className="text-[12px] text-slate-400 leading-none">{d.label}</p>
                  <p className="text-[16px] sm:text-[18px] font-normal text-slate-400 dark:text-slate-500 leading-tight">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 7 — PROCESS FUNNEL
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-5">
        <p className="text-[16px] font-bold text-slate-800 dark:text-white mb-5">Process Funnel</p>

        <div className="flex flex-col gap-4">
          {[
            {
              label: "Backlog",
              text: "45 Tasks",
              fillPct: 100,
              indent: 0,
              fillColor: "bg-blue-200 dark:bg-blue-900/50",
              trackColor: "bg-blue-50 dark:bg-[#1c1c1e]",
              textColor: "text-blue-800 dark:text-blue-200",
            },
            {
              label: "Dev",
              text: "28 Tasks",
              fillPct: 65,
              indent: 40,
              fillColor: "bg-blue-500",
              trackColor: "bg-slate-100 dark:bg-slate-800",
              textColor: "text-white",
            },
            {
              label: "QA",
              text: "12 Stuck",
              fillPct: 70,
              indent: 120,
              fillColor: "bg-[#e9d8a6] dark:bg-amber-700",
              trackColor: "bg-slate-100 dark:bg-slate-800",
              textColor: "text-[#78350f] dark:text-amber-100",
            },
            {
              label: "Done",
              text: "18 Released",
              fillPct: 70,
              indent: 160,
              fillColor: "bg-green-200 dark:bg-green-900/60",
              trackColor: "bg-slate-100 dark:bg-slate-800",
              textColor: "text-green-800 dark:text-green-200",
            },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-4">
              <span className="text-[12px] text-slate-400 font-medium w-14 text-right shrink-0">
                {row.label}
              </span>
              {/* full-width track */}
              <div
                className={`flex-1 h-9 rounded-lg overflow-hidden ${row.trackColor}`} style={{ marginLeft: `${row.indent}px` }}
              >
                {/* filled portion */}
                <div
                  className={`h-full rounded-lg flex items-center pl-4 ${row.fillColor}`}
                  style={{
                    width: `${row.fillPct}%`,
                  }}
                >
                  <span
                    className={`text-[13px] font-semibold whitespace-nowrap ${row.textColor}`}
                  >
                    {row.text}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 8 — SPRINT HEALTH
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-5">
        <p className="text-[16px] font-bold text-slate-800 dark:text-white mb-5">Sprint Health</p>

        <div className="flex flex-col gap-5 mb-6">
          {[
            { label: "Code Coverage", value: "88%", pct: 88, color: "#22c55e" },
            { label: "Bug Rate", value: "12%", pct: 12, color: "#f59e0b" },
            { label: "Team Morale", value: "4.2/5", pct: 84, color: "#3b82f6" },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">{row.label}</span>
                <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">{row.value}</span>
              </div>
              {/* thick 8px bar */}
              <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${row.pct}%`, background: row.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Generate Sprint Report — full-width outlined button */}
        <button
          className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#1c1c1e] text-[13px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-[rgba(46,47,47,0.5)] transition-colors cursor-pointer btn-hover"
        >
          {/* download icon */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 4h-2v9.586l-3.293-3.293-1.414 1.414L12 17.414l5.707-5.707-1.414-1.414L13 13.586V4z" />
            <path d="M5 20h14v2H5v-2z" />
          </svg>
          Generate Sprint Report
        </button>
      </div>

    </div>
  );
}