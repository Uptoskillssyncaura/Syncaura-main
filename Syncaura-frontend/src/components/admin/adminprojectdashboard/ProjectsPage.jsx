import { useState } from 'react'
import { GiOpenFolder } from "react-icons/gi"
import { FaCirclePlay } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { BsXOctagonFill } from "react-icons/bs";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   DONUT CHART
───────────────────────────────────────────────────────────── */
function DonutChart() {
  const R = 48, CX = 64, CY = 64, SW = 15;
  const C = 2 * Math.PI * R;
  
  const slices = [
    { pct: 0.65, color: '#39ff14' }, // Neon Green
    { pct: 0.20, color: '#ffff00' }, // Neon Yellow
    { pct: 0.15, color: '#ff3131' }, // Neon Red
  ];

  // 1. Offset ko yahan define karein (map ke bahar)
  let cumulativeOffset = 0;

  return (
    <div className="relative w-36 h-36 shrink-0">
      <svg width={144} height={144} viewBox="0 0 128 128">
        <circle cx={CX} cy={CY} r={R} fill="none" className="stroke-gray-100 dark:stroke-zinc-800" strokeWidth={SW} />
        
        {slices.map((s, i) => {
          const dash = s.pct * C;
          
          // Current slice ka offset save karein
          const currentOffset = cumulativeOffset;
          
          // 2. Cumulative offset ko agle slice ke liye update karein
          cumulativeOffset += dash;

          return (
            <circle
              key={i}
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={SW}
              strokeDasharray={`${dash} ${C - dash}`}
              // 3. Yahan variable ka naam sahi karein
              strokeDashoffset={-currentOffset}
              className="transition-all duration-500 shadow-glow"
              transform={`rotate(-90 ${CX} ${CY})`}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[26px] font-bold text-gray-900 dark:text-white leading-none">85%</span>
        <span className="text-[12px] font-semibold text-gray-400 dark:text-gray-500 mt-[3px]">Healthy</span>
      </div>
    </div>
  );
}
    

const IcoSearch = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" className="stroke-[#9ca3af] dark:stroke-zinc-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const IcoTriangle = ({ show }) => {
  if (!show) return <span className="inline-block w-3" />
  return (
    <svg width="12" height="14" fill="none" viewBox="0 0 14 16" className="stroke-[#c8cdd6] dark:stroke-zinc-600" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="1" x2="2" y2="15"/>
      <path d="M2 2 L12 4 L12 9 L2 7 Z"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const PROJECTS = [
  { id: 1, name: 'Website Redesign', sub: 'Marketing Q3 Priority', av: 'S', avBg: '#ef4444', owner: 'Sarah J.', prog: 50, progColor: '#3b82f6', status: 'Active', sBg: '#bfdbfe', sColor: '#1d4ed8', health: '#22c55e', deadline: 'Oct 24, 2023', risk: true },
  { id: 2, name: 'Mobile App Migration', sub: 'Engineering Critical', av: 'M', avBg: '#3b82f6', owner: 'Mike T.', prog: 25, progColor: '#f97316', status: 'At Risk', sBg: '#fee2e2', sColor: '#dc2626', health: '#fca5a5', deadline: 'Nov 12, 2023', risk: false },
  { id: 3, name: 'Q4 Marketing Campaign', sub: 'Marketing', av: 'E', avBg: '#f97316', owner: 'Emily R.', prog: 75, progColor: '#3b82f6', status: 'Delayed', sBg: '#fef9c3', sColor: '#92400e', health: '#fbbf24', deadline: 'Oct 10, 2023', risk: false },
  { id: 4, name: 'Design System V2', sub: 'Design Internal', av: 'D', avBg: '#8b5cf6', owner: 'David L.', prog: 90, progColor: '#22c55e', status: 'Review', sBg: '#dcfce7', sColor: '#16a34a', health: '#22c55e', deadline: 'Sep 30, 2023', risk: true },
  { id: 5, name: 'API Integration', sub: 'Engineering', av: 'J', avBg: '#22c55e', owner: 'James K.', prog: 100, progColor: '#22c55e', status: 'Completed', sBg: '#f3f4f6', sColor: '#6b7280', health: '#22c55e', deadline: 'Sep 15, 2023', risk: true },
]

const RESOURCES = [
  { label: 'Engineering', pct: 85, color: '#3b82f6', dark: '#00d4ff' }, // Cyan
  { label: 'Design', pct: 92, color: '#a855f7', dark: '#bc13fe' },      // Purple
  { label: 'Marketing', pct: 45, color: '#ef4444', dark: '#ff00ff' },    // Pink/Magenta
  { label: 'Product Management', pct: 60, color: '#f97316', dark: '#ff6b00' }, // Orange
]

/* ─────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────── */
function StatCard({ label, value, borderColor, highlight, iconBg, iconColor, Icon, footerText, footerColor, footerBg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-[rgb(35,36,36)] rounded-[10px] px-3 py-[10px] flex flex-col flex-1 min-w-0 gap-1 border border-gray-200 dark:border-zinc-800 shadow-sm transition-all duration-200"
      style={{ borderLeft: highlight ? `4px solid ${borderColor}` : undefined }}
    >
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-400 dark:text-zinc-500">{label}</span>
        <div className="w-9 h-6 rounded-[6px] py-4 px-1 flex items-center justify-center" style={{ background: iconBg }}>
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>
      {label === "Active" ? (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[36px] font-bold text-gray-900 dark:text-white leading-none">{value}</span>
          <div className="h-[6px] w-[95px] bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-[28px]">
            <div className="h-full w-[55%] bg-blue-500 rounded-full"></div>
          </div>
        </div>
      ) : (
        <span className="text-[32px] font-bold text-gray-900 dark:text-white leading-none ">{value}</span>
      )}
      {footerText && (
        <div className="mt-1">
          {typeof footerText === "string" ? (
            <span className="text-[11px] font-semibold px-[6px] py-[1px] rounded-[5px]" style={{ background: footerBg, color: footerColor }}>{footerText}</span>
          ) : ( footerText )}
        </div>
      )}
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [alloc, setAlloc] = useState('By Team')
  const [search, setSearch] = useState('')

  const filtered = PROJECTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.owner.toLowerCase().includes(search.toLowerCase())
  )

  const thClass = "px-[10px] py-[6px] text-left text-[9px] font-medium uppercase tracking-[0.06em] text-gray-400 dark:text-zinc-500 border-b border-gray-200 dark:border-zinc-800 whitespace-nowrap bg-white dark:bg-[#1c2128]"
  const tdClass = "px-[10px] py-2 align-middle"

  return (
    <div className="bg-white dark:bg-[#08090ac7] min-h-screen  font-sans transition-colors duration-300">
      <div className="w-full">

        {/* STAT CARDS GRID */}
        <div className="grid grid-cols-5 gap-[10px] mb-[14px]">
          <StatCard label="Total Projects" 
          value="42" 
          highlight={false} 
          iconBg="#eff6ff" 
          iconColor="#3b82f6" 
          Icon={GiOpenFolder} 
          footerText={<div className="flex items-center gap-[6px] mt-[4px]">
            <span className="flex items-center gap-[3px] text-[10px] font-semibold px-[6px] py-[2px] rounded-[5px]" 
            style={{ background: "#dcfce7", color: "#16a34a" }}>
              <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,13 8,8 11,11 17,5" />
                <polyline points="14,5 17,5 17,8" />
                </svg>12%</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                  vs. last month
                  </span>
                  </div>
                } 
                />
          <StatCard label="Active" 
          value="12" 
          highlight={false} 
          iconBg="#eff6ff" 
          iconColor="#3b82f6" 
          Icon={FaCirclePlay} />
          <StatCard label="Completed" 
          value="24" 
          highlight={false} 
          iconBg="#dcfce7" 
          iconColor="#16a34a" 
          Icon={FaCheckCircle} 
          footerText="+3 this week" 
          footerColor="#16a34a" 
          footerBg="#dcfce7" />
          <StatCard label="Delayed" 
          value="4" 
          borderColor="#d97706" 
          highlight={true} 
          iconBg="#fef9c3" 
          iconColor="#d97706" 
          Icon={TbAlertTriangleFilled} 
          footerText="Needs attention" 
          footerColor="#94a3b8" />
          <StatCard label="At Risk" 
          value="2" 
          borderColor="#dc2626" 
          highlight={true} 
          iconBg="#fee2e2" 
          iconColor="#dc2626" 
          Icon={BsXOctagonFill} 
          footerText="Critical action required" 
          footerColor="#ef4444" />
        </div>

        {/* PROJECT HEALTH STATUS (ONE BELOW ANOTHER LAYOUT) */}
        <div className="bg-white dark:bg-[#1c1d1d] border border-gray-200 dark:border-zinc-800 rounded-[10px] px-5 py-4 mb-3 shadow-sm">
          <p className="text-2xl font-bold text-black dark:text-white mb-4 tracking-normal leading-none">Project Health Status</p>
          <div className="flex items-center gap-11 pl-[6px]">
            <DonutChart />
            <div className="flex gap-10">
              {[['#22c55e', 'On Track', '(65%)'], ['#f59e0b', 'Warning', '(20%)'], ['#ef4444', 'Critical', '(15%)']].map(([c, lbl, pct]) => (
                <div key={lbl} className="flex items-center gap-[7px]">
                  <span className="w-[14px] h-[14px] rounded-full inline-block shrink-0" style={{ background: c }} />
                  <div>
                    <div className="text-[11px] font-medium text-gray-400 dark:text-zinc-500 leading-[1.4]">{lbl}</div>
                    <div className="text-[11px] font-normal text-gray-700 dark:text-zinc-300 leading-[1.4]">{pct}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RESOURCE ALLOCATION (ONE BELOW ANOTHER LAYOUT) */}
        <div className="bg-white dark:bg-[#1c1d1d] border border-gray-200 dark:border-zinc-800 rounded-[10px] px-5 py-4 mb-3 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-2xl font-bold text-black dark:text-white tracking-normal leading-none">Resource Allocation</p>
            <div className="flex bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg p-0.5">
              {['By Team', 'By Project'].map(t => (
                <button key={t} onClick={() => setAlloc(t)} className={`btn-hover px-[10px] py-[3px] text-[10.5px] font-medium rounded-[6px] ${alloc === t ? 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-white shadow-sm' : 'text-gray-400'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
         {RESOURCES.map(r => (
  <div key={r.label} className="mb-[13px]">
    <div className="flex justify-between mb-[5px]">
      <span className="text-[11.5px] font-semibold text-gray-700 dark:text-gray-300">{r.label}</span>
      <span className="text-[11px] font-bold text-black dark:text-white">{r.pct}% Capacity</span>
    </div>
    <div className="h-2 bg-gray-100 dark:bg-[#0d1117] rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: `${r.pct}%` }} 
        className="h-full rounded-full transition-colors duration-300" 
        // Style tag se light/dark mode color switch
        style={{ 
          backgroundColor: document.documentElement.classList.contains('dark') ? r.dark : r.color 
        }} 
      />
    </div>
  </div>
))}
        </div>

        {/* PROJECTS TABLE */}
        <div className="bg-white dark:bg-[#1c1d1d] border border-gray-200 dark:border-zinc-800 rounded-[10px] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-[14px] py-3 border-b border-gray-200 dark:border-zinc-800">
            <span className="text-2xl font-bold text-zinc-500 dark:text-zinc-600 tracking-normal leading-none">All Projects</span>
            <div className="flex gap-2 items-center">
              <div className="relative flex items-center">
                <span className="absolute left-2 flex pointer-events-none"><IcoSearch /></span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter projects..." className="pl-[26px] pr-[10px] py-[5px] border border-gray-200 dark:border-zinc-800 rounded-[6px] text-[11px] font-normal text-gray-700 dark:text-zinc-300 bg-white dark:bg-[#0c192e] w-[155px] outline-none" />
              </div>
              <button className="px-3 py-[5px] border border-gray-200 dark:border-zinc-800 rounded-[6px] text-[11px] font-medium bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-500 btn-hover">Filters</button>
            </div>
          </div>
          <table className="w-full border-collapse  ">
            <thead ><tr >{['', 'PROJECT NAME', 'OWNER', 'PROGRESS', 'STATUS', 'HEALTH', 'DEADLINE', 'RISK'].map((h, i) => (<th key={i}  className={thClass}  >{h}</th>))}</tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50 ">
              {filtered.map((p, idx) => (
                <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 bg-white dark:bg-[#1c1d1d] transition-colors">
                  <td className={tdClass}><div className="w-[18px] h-[18px] border-[1.5px] border-gray-300 dark:border-zinc-700 rounded-[5px] bg-white dark:bg-[#0c192e]" /></td>
                  <td className={tdClass}><div className="text-[11.5px] font-semibold text-gray-900 dark:text-zinc-200">{p.name}</div><div className="text-[9.5px] font-normal text-gray-400 dark:text-zinc-500 mt-[1px]">{p.sub}</div></td>
                  <td className={tdClass}><div className="flex items-center gap-[6px]"><div className="w-[25px] h-[25px] rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm" style={{ background: p.avBg }}>{p.av}</div><span className="text-[10.5px] font-normal text-gray-700 dark:text-zinc-400">{p.owner}</span></div></td>
                  <td className={tdClass}><div className="flex flex-col w-[80px]"><span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 mb-1">{p.prog}%</span><div className="w-full h-1 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${p.prog}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ background: p.progColor }} /></div></div></td>
                  <td className={tdClass}><span className="text-[10px] font-semibold px-[10px] py-[2px] rounded-full whitespace-nowrap shadow-sm" style={{ background: p.sBg, color: p.sColor }}>{p.status}</span></td>
                  <td className={tdClass}><span className="w-[9px] h-[9px] rounded-full inline-block shadow-sm" style={{ background: p.health }} /></td>
                  <td className={`${tdClass} text-[10px] font-normal text-gray-500 dark:text-zinc-500 whitespace-nowrap`}>{p.deadline}</td>
                  <td className={tdClass}><IcoTriangle show={p.risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-[14px] py-[9px] text-[10px] font-normal text-gray-500 dark:text-zinc-500 flex items-center bg-white dark:bg-[#1c1d1d] justify-between border-t border-gray-600 ">
            <span>Showing 1-5 of 42 projects</span>
            <div className="flex gap-[5px]"><button className="px-[14px] py-[2px] border border-zinc-100 dark:border-zinc-800 rounded-[4px] bg-white dark:bg-zinc-900 text-black dark:text-zinc-400 btn-hover">Prev</button><button className="px-[14px] py-[2px] border border-zinc-200 dark:border-zinc-800 rounded-[4px] bg-white dark:bg-zinc-900 text-black dark:text-zinc-400 btn-hover">Next</button></div>
          </div>
        </div>

      </div>
    </div>
  )
}
