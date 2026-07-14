import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";

const names = ["Sarah", "Mike", "Jess", "David"];

// ─── Animated count-up hook ───────────────────────────────────────────────────
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
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
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded-md whitespace-nowrap z-50 shadow-lg"
          style={{ animation: "fadeIn 0.18s ease both" }}>
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard Section ───────────────────────────────────────────────────
export default function DashboardSection() {
  const [activeTab, setActiveTab] = useState("Workload");
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [expandedBottleneck, setExpandedBottleneck] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);


  // Count-up numbers
  const totalTasks = useCountUp(142);
  const completed = useCountUp(89);
  const inProgress = useCountUp(89);
  const blocked = useCountUp(11);

  const alerts = [
    {
      id: 1, bg: "bg-[#fff1f1] dark:bg-red-900/10", border: "border-red-100 dark:border-red-900/20",
      badgeBg: "bg-red-100 dark:bg-red-900/30 text-red-500", badge: "HIGH SEVERITY",
      icon: (
        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
             <path d="M12 8v4" stroke="white" strokeWidth="3" strokeLinecap="round" />
             <circle cx="12" cy="16" r="1.5" fill="white" />
          </svg>
        </div>
      ),
      title: "API Dependency Failure",
      desc: "Payment gateway integration is failing due to 500 errors from provider. Blocking checkout flow.",
      team: "DevOps Team", time: "2 hours ago",
    },
    {
      id: 2, bg: "bg-[#fffbeb] dark:bg-amber-900/10", border: "border-amber-100 dark:border-amber-900/20",
      badgeBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-500", badge: "MEDIUM",
      icon: (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
             <path d="M12 3L2 21h20L12 3z" fill="#f59e0b" />
             <path d="M12 10v4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
             <circle cx="12" cy="17" r="1.2" fill="white" />
          </svg>
        </div>
      ),
      title: "QA Environment Latency",
      desc: "Staging environment is experiencing high latency, slowing down the QA review process significantly.",
      team: "Infra Team", time: "5 hours ago",
    },
    {
      id: 3, bg: "bg-[#f8fafc] dark:bg-slate-800/20", border: "border-slate-200 dark:border-slate-700",
      badgeBg: "bg-slate-200 dark:bg-slate-700 text-slate-500", badge: "LOW",
      icon: (
        <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
             <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2.5" />
             <path d="M9 10c0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3v2" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
             <circle cx="12" cy="18" r="1.2" fill="white" />
          </svg>
        </div>
      ),
      title: "Missing Assets for Sprint 25",
      desc: "Design assets for the upcoming sprint are incomplete in Figma.",
      team: "UX Team", time: "3 hours ago",
    },
  ];

  const visibleAlerts = alerts.filter(a => !dismissedAlerts.includes(a.id));

  const bottleneckRows = [
    { id: "backlog", label: "Backlog", tasks: "42 Tasks", time: "1.2 days", timeColor: "text-blue-500 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", leftBorder: "", indent: "w-[0%]", width: "w-full", stuck: false },
    { id: "dev", label: "Development", tasks: "28 Tasks", time: "3.5 days", timeColor: "text-emerald-500 dark:text-emerald-400", bg: "bg-blue-100 dark:bg-blue-900/30", leftBorder: "border-l-[3px] border-emerald-400", indent: "w-[5%] sm:w-[10%]", width: "w-[90%] sm:w-[80%]", stuck: false },
    { id: "devstuck", label: "Development", tasks: "15 Stuck", time: "5.2 days", timeColor: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/30", leftBorder: "border-l-[3px] border-red-400", indent: "w-[10%] sm:w-[20%]", width: "w-[85%] sm:w-[60%]", stuck: true },
    { id: "done", label: "Done", tasks: "89 Tasks", time: null, timeColor: "", bg: "bg-blue-100 dark:bg-blue-900/30", leftBorder: "", indent: "w-[30%]", width: "w-[40%]", stuck: false },
  ];

  const progressRows = [
    { name: "Sarah Jenkins", pct: 100, bar: "bg-red-500", label: "100%(Over)", labelCls: "text-red-500", delay: 0 },
    { name: "Mike Ross", pct: 85, bar: "bg-emerald-500", label: "85%(Optimal)", labelCls: "text-emerald-500", delay: 100 },
    { name: "Jessica Chang", pct: 92, bar: "bg-blue-500", label: "92%(High)", labelCls: "text-blue-500", delay: 200 },
    { name: "David Kim", pct: 60, bar: "bg-blue-400", label: "60%(Available)", labelCls: "text-slate-500 dark:text-slate-400", delay: 300 },
  ];

  return (
    <div className="flex flex-col gap-4 font-sans pb-16 px-0 sm:px-2">
      <style>{`
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; }

        @keyframes fadeIn    { from { opacity:0; transform:translateY(6px);  } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeInUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideInX  { from { opacity:0; transform:translateX(-10px);} to { opacity:1; transform:translateX(0); } }
        @keyframes pulseSoft { 0%,100%{ opacity:1; } 50%{ opacity:0.5; } }

        .anim-fade-in    { animation: fadeIn   0.22s ease both; }
        .anim-fade-in-up { animation: fadeInUp 0.42s ease both; }
        .anim-slide-in   { animation: slideInX 0.32s ease both; }
        .anim-pulse      { animation: pulseSoft 2s ease-in-out infinite; }

        .card-stagger:nth-child(1) { animation: fadeInUp 0.4s ease both 0ms;   }
        .card-stagger:nth-child(2) { animation: fadeInUp 0.4s ease both 60ms;  }
        .card-stagger:nth-child(3) { animation: fadeInUp 0.4s ease both 120ms; }
        .card-stagger:nth-child(4) { animation: fadeInUp 0.4s ease both 180ms; }
        .card-stagger:nth-child(5) { animation: fadeInUp 0.4s ease both 240ms; }

        .hover-lift { transition: transform 0.16s ease, box-shadow 0.16s ease; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 22px -4px rgba(0,0,0,0.12); }
        .btn-press:active { transform: scale(0.95); transition: transform 0.1s ease; }
      `}</style>

      {/* ── 5 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

        {/* Total Tasks */}
        <div className="card-stagger bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-[0_6px_8px_-2px_rgba(0,0,0,0.18)] hover-lift cursor-default">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 mb-1">Total Tasks</p>
            <TooltipHint text="All tasks this sprint">
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
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none">{totalTasks}</p>
            <p className="text-xs font-bold text-emerald-500 mb-0.5 flex items-center gap-1">
              <TrendingUp size={12}/> 5%
            </p>
          </div>
        </div>

        {/* Completed */}
        <div className="card-stagger bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-[0_6px_8px_-2px_rgba(0,0,0,0.18)] hover-lift cursor-default">
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
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none">{completed}</p>
            <p className="text-xs font-bold text-emerald-500 mb-0.5 flex items-center gap-1">
                <TrendingUp size={12} /> 12%
            </p>
          </div>
        </div>

        {/* In Progress */}
        <div className="card-stagger bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-[0_6px_8px_-2px_rgba(0,0,0,0.18)] hover-lift cursor-default">
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
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none">{inProgress}</p>
            <p className="text-xs font-bold text-blue-500 mb-0.5">→3%</p>
          </div>
        </div>

        {/* Blocked */}
        <div className="card-stagger bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-[0_6px_8px_-2px_rgba(0,0,0,0.18)] hover-lift cursor-default">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 mb-1">Blocked</p>
            <TooltipHint text="Needs immediate attention">
              <div className="w-9 h-9 rounded-2xl bg-red-200 dark:bg-red-900/50 flex items-center justify-center shrink-0 anim-pulse">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#ffffff" strokeWidth="2" />
                  <path d="M6 18L18 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </TooltipHint>
          </div>
          <div className="flex gap-3 items-end">
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none">{blocked}</p>
            <p className="text-xs font-bold text-red-500 mb-0.5 flex items-center gap-1">
                <TrendingUp size={12} /> 2%
            </p>
          </div>
        </div>

        {/* Risk Level */}
        <div className="card-stagger bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-[0_6px_8px_-2px_rgba(0,0,0,0.18)] hover-lift cursor-default">
          <div className="flex justify-between items-start">
            <p className="text-xs text-slate-400 mb-1">Risk Level</p>
            <TooltipHint text="Overall sprint risk">
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
            <p className="text-3xl font-bold text-slate-800 dark:text-white leading-none">Moderate</p>
          </div>
        </div>
      </div>

      {/* ── Sprint Status ── */}
      <div className="anim-fade-in-up bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-[0_6px_8px_-2px_rgba(0,0,0,0.18)]"
        style={{ animationDelay: "150ms" }}>
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold text-slate-500 dark:text-slate-400">Sprint Status</p>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 sm:ml-8">Sprint Completion</span>
          <span className="text-xl font-extrabold sm:mr-10 text-slate-800 dark:text-white">62%</span>
        </div>
        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden sm:w-[calc(100%-5rem)] sm:ml-[5rem]">
          <div className="h-full w-[62%] bg-blue-500 rounded-full" />
        </div>
        <div className="flex justify-between mt-2 sm:w-[calc(100%-5rem)] sm:ml-[5rem]">
          <span className="text-[12px] text-slate-500 dark:text-slate-400">Day 8 of 14</span>
          <span className="text-[12px] text-slate-500 dark:text-slate-400">6 days remaining</span>
        </div>
      </div>

      {/* ── Sprint Health (Planned vs Actual) ── */}
      <div className="anim-fade-in-up bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-[0_6px_8px_-2px_rgba(0,0,0,0.18)]"
        style={{ animationDelay: "200ms" }}>
        <p className="font-bold text-slate-500 dark:text-slate-400 mb-4">Sprint Health (Planned vs Actual)</p>
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="relative shrink-0 w-[160px] h-[160px] md:w-[200px] md:h-[200px]">
            <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: "rotate(-165deg)" }}>
              <circle cx="18" cy="18" r="13" fill="none" stroke="#e9e7e7" strokeWidth="4.5" />
              <circle cx="18" cy="18" r="13" fill="none" stroke="#22c55e" strokeWidth="4.5"
                strokeDasharray="55 82" strokeDashoffset="5" />
              <circle cx="18" cy="18" r="13" fill="none" stroke="#3b82f6" strokeWidth="4.5"
                strokeDasharray="19 82" strokeDashoffset="-49" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-600 dark:text-slate-300">90%</span>
              <span className="text-[11px] text-slate-400 text-center leading-tight">Adherence</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-10">
            {[
              { color: "bg-emerald-500", label: "Healthy", tip: "45 story points" },
              { color: "bg-blue-500", label: "Planned", tip: "67 story points" },
              { color: "bg-slate-300", label: "Remaining", tip: "33 story points" },
            ].map((item) => (
              <TooltipHint key={item.label} text={item.tip}>
                <div className="flex items-center gap-2 cursor-default hover:opacity-75 transition-opacity">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-[13px] text-slate-500 dark:text-slate-400">{item.label}</span>
                </div>
              </TooltipHint>
            ))}
          </div>
        </div>
      </div>

      {/* ── Project Progress Overview ── */}
      <div className="anim-fade-in-up bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-[0_6px_8px_-2px_rgba(0,0,0,0.18)]"
        style={{ animationDelay: "250ms" }}>
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-slate-500 dark:text-slate-400">Project Progress Overview</span>
          <button
            onClick={() => setViewDetailsOpen(v => !v)}
            className="text-xs text-blue-500 cursor-pointer border-0 bg-transparent hover:text-blue-700 transition-colors font-medium btn-press btn-hover"
          >
            {viewDetailsOpen ? "Hide Details ▲" : "View Details ▼"}
          </button>
        </div>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 ml-3 mb-3">Sprint Completion</p>

        {progressRows.map((row) => (
          <div key={row.name} className="sm:ml-6 ml-2 sm:mr-4 mr-2 mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{row.name}</span>
              <span className={`text-[11px] font-semibold ${row.labelCls}`}>{row.label}</span>
            </div>
            <AnimatedBar pct={row.pct} colorClass={row.bar} delay={row.delay} />
          </div>
        ))}

        {/* Expandable detail cards */}
        {viewDetailsOpen && (
          <div className="anim-fade-in mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { name: "Sarah", tasks: 18, done: 18, color: "text-red-500" },
                { name: "Mike", tasks: 20, done: 17, color: "text-emerald-500" },
                { name: "Jess", tasks: 15, done: 8, color: "text-blue-500" },
                { name: "David", tasks: 13, done: 8, color: "text-slate-500 dark:text-slate-400" },
              ].map(p => (
                <div key={p.name} className="bg-slate-50 dark:bg-[rgba(46,47,47,0.5)] rounded-lg p-2.5 text-center hover-lift cursor-default">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{p.name}</p>
                  <p className={`text-lg font-extrabold ${p.color}`}>
                    {p.done}<span className="text-slate-300 font-normal text-sm">/{p.tasks}</span>
                  </p>
                  <p className="text-[10px] text-slate-400">tasks done</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Team Completed vs Avg Time ── */}
      <div className="anim-fade-in-up bg-white dark:bg-[#1c1c1e] rounded-xl p-4 border border-slate-100 dark:border-slate-800 shadow-[0_6px_8px_-2px_rgba(0,0,0,0.18)]"
        style={{ animationDelay: "300ms" }}>
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-slate-500 dark:text-slate-400">Team Completed vs Avg Time</span>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 gap-0.5">
            {["Workload", "Productivity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn-hover px-3 py-1 text-[11px] font-semibold rounded-md cursor-pointer border-0 btn-press ${activeTab === tab
                    ? "bg-white dark:bg-[#1c1c1e] text-slate-800 dark:text-white shadow-sm"
                    : "bg-transparent text-slate-400 hover:text-slate-600 dark:text-slate-300"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full">
          <div className="mt-6 sm:mt-10 pt-8 pb-0">
               <svg width="100%" viewBox="-30 0 960 230" preserveAspectRatio="xMidYMid meet" className="w-full h-auto">              {[0, 97, 195].map((y, i) => (
                <line key={`h-${i}`} x1={0} y1={y} x2={900} y2={y}
                  stroke="#c8d9e6" strokeWidth={1.4} strokeDasharray="7 6" />
              ))}
              {names.map((name, i) => {
                const x = (i / (names.length - 1)) * 900;
                return (
                <text key={`label-${i}`} x={x} y={220}
                  textAnchor={i === 0 ? "start" : i === names.length - 1 ? "end" : "middle"}
                  fontSize={13} fill="#94a3b8" fontWeight={500} fontFamily="sans-serif">
                  {name}
                </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* ── Bottleneck Detection ── */}
      <div className="anim-fade-in-up bg-white dark:bg-[#1c1c1e] rounded-xl p-5 border border-slate-100 dark:border-slate-800 shadow-[0_6px_8px_-2px_rgba(0,0,0,0.18)] w-full"
        style={{ animationDelay: "350ms" }}>
        <div className="flex justify-between items-center mb-5">
          <span className="text-base font-bold text-slate-500 dark:text-slate-400">Bottleneck Detection</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 rounded-lg px-3 py-1.5 bg-slate-100 dark:bg-slate-800">
            Avg Wait Time
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {bottleneckRows.map((row) => (
            <div key={row.id} className="flex w-full">
              <div className={`${row.indent} shrink-0`} />
              <div
                className={`${row.width} h-9 ${row.bg} rounded-lg flex items-center justify-between px-2 sm:px-4 ${row.leftBorder}
                  cursor-pointer transition-all duration-200 hover:brightness-95 hover:shadow-sm
                  ${expandedBottleneck === row.id ? "ring-2 ring-blue-300" : ""}
                  ${row.stuck ? "anim-pulse" : ""}`}
                style={{ paddingLeft: row.leftBorder ? "12px" : "16px" }}
                onClick={() => setExpandedBottleneck(expandedBottleneck === row.id ? null : row.id)}
              >
                <div className="flex items-center gap-2 sm:gap-10">
                  {row.stuck && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3L22 21H2L12 3Z" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
                      <path d="M12 10v4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="17" r="1" fill="#ef4444" />
                    </svg>
                  )}
                  <span className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">{row.label}</span>
                </div>
                <div className="flex items-center gap-10">
                  <span className={`text-[12px] ${row.stuck ? "font-semibold text-red-500" : "text-slate-400"}`}>{row.tasks}</span>
                  {row.time && <span className={`text-[13px] font-bold ${row.timeColor}`}>{row.time}</span>}
                </div>
              </div>
              {row.indent !== "w-[0%]" && <div className={`${row.indent} shrink-0`} />}
            </div>
          ))}

          {/* Expandable info panel */}
          {expandedBottleneck && (
            <div className="anim-fade-in bg-slate-50 dark:bg-[rgba(46,47,47,0.5)] rounded-lg p-3 border border-slate-200 dark:border-slate-700 mt-1">
              {expandedBottleneck === "backlog" && <p className="text-[12px] text-slate-500 dark:text-slate-400">42 tasks waiting. Avg age: <strong className="text-slate-700 dark:text-slate-200">1.2 days</strong>. Recommend assigning 5 to available members.</p>}
              {expandedBottleneck === "dev" && <p className="text-[12px] text-slate-500 dark:text-slate-400">28 tasks in active development. Velocity is healthy. <strong className="text-slate-700 dark:text-slate-200">3 PRs</strong> pending review.</p>}
              {expandedBottleneck === "devstuck" && <p className="text-[12px] text-red-500 dark:text-red-400">⚠ 15 tasks stuck &gt;5 days. Top blocker: <strong className="text-slate-700 dark:text-slate-200">API Dependency Failure</strong>. Escalate to DevOps.</p>}
              {expandedBottleneck === "done" && <p className="text-[12px] text-slate-500 dark:text-slate-400">89 tasks completed. <strong className="text-slate-700 dark:text-slate-200">62%</strong> of sprint goal achieved.</p>}
            </div>
          )}
        </div>
      </div>

      {/* ── Issues & Alerts ── */}
      <div
        className="anim-fade-in-up bg-white dark:bg-[#1c1c1e] rounded-xl border border-slate-100 dark:border-slate-800 shadow-[0_6px_8px_-2px_rgba(0,0,0,0.18)]"
        style={{ animationDelay: "400ms", minHeight: "155px", padding: "12px 16px", boxSizing: "border-box" }}
      >
        <div className="flex justify-between items-center mb-6">
          <span className="text-3xl font-extrabold text-[#64748b] dark:text-slate-300">Issues & Alerts</span>
          <span className="text-[12px] bg-red-50 text-red-400 rounded-full px-3 py-1 font-bold">
            {visibleAlerts.length} New
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-3">

          {visibleAlerts.length === 0 && (
            <div className="anim-fade-in flex items-center justify-center w-full py-6">
              <p className="text-[12px] text-emerald-500 font-semibold">✓ All alerts dismissed</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row flex-1 gap-3">
            {visibleAlerts.map((a) => (
              <div
                key={a.id}
                className={`flex-1 min-w-[280px] ${a.bg} border-0 p-4 relative anim-slide-in rounded-2xl shadow-sm`}
              >
                <div className="flex gap-4 items-start mb-4">
                  {a.icon}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[16px] font-extrabold text-slate-600 dark:text-white leading-tight">{a.title}</p>
                      <span className={`text-[8px] ${a.badgeBg} rounded-full px-2 py-0.5 font-bold tracking-tight uppercase whitespace-nowrap`}>
                        {a.badge}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-400 dark:text-slate-400 leading-[1.5] line-clamp-2">{a.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-slate-300 font-medium">
                  <span>Assigned: <span className="text-slate-400">{a.team}</span></span>
                  <span className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    {a.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="flex-shrink-0 flex items-stretch">
            <button
              className="bg-[#94a3b8] hover:bg-slate-500 text-white rounded-xl text-[12px] font-bold cursor-pointer border-0 w-full md:w-[65px] flex md:flex-col items-center justify-center gap-2 md:gap-1 btn-press py-3 md:py-0 btn-hover"
            >
              <span className="leading-none text-center">View<br className="hidden md:block"/>All</span>
              <span className="text-sm md:text-sm font-black">12</span>
              <span className="leading-none text-center">Issues</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}