import { useState, useEffect } from "react";
import { GiOpenFolder } from "react-icons/gi";
import { FaCirclePlay } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { BsXOctagonFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import CreateNewProject from "../../projects/Model/CreateNewProject";
import Pagination from "../../common/Pagination";
import api from "../../../config/axios";

/* ─────────────────────────────────────────────────────────────
   DONUT CHART
───────────────────────────────────────────────────────────── */
function DonutChart({ onTrackPct = 0, warningPct = 0, criticalPct = 0, healthyScore = 0 }) {
  const R = 48, CX = 64, CY = 64, SW = 15;
  const C = 2 * Math.PI * R;

  const slices = [
    { pct: onTrackPct / 100, color: "#39ff14" },
    { pct: warningPct / 100, color: "#ffff00" },
    { pct: criticalPct / 100, color: "#ff3131" },
  ];

  let cumulativeOffset = 0;

  return (
    <div className="relative w-36 h-36 shrink-0">
      <svg width={144} height={144} viewBox="0 0 128 128">
        <circle cx={CX} cy={CY} r={R} fill="none" className="stroke-gray-100 dark:stroke-zinc-800" strokeWidth={SW} />

        {slices.map((s, i) => {
          const dash = s.pct * C;
          const currentOffset = cumulativeOffset;
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
              strokeDashoffset={-currentOffset}
              className="transition-all duration-500 shadow-glow"
              transform={`rotate(-90 ${CX} ${CY})`}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[26px] font-bold text-gray-900 dark:text-white leading-none">{healthyScore}%</span>
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
);

const IcoTriangle = ({ show }) => {
  if (!show) return <span className="inline-block w-3" />;
  return (
    <svg width="12" height="14" fill="none" viewBox="0 0 14 16" className="stroke-[#c8cdd6] dark:stroke-zinc-600" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="1" x2="2" y2="15" />
      <path d="M2 2 L12 4 L12 9 L2 7 Z" />
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────── */
function StatCard({ label, value, borderColor, highlight, iconBg, iconColor, Icon, footerText, footerColor, footerBg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-[rgb(35,36,36)] rounded-[10px] px-3 py-[10px] flex flex-col flex-1 min-w-0 gap-1 border border-gray-200 dark:border-zinc-800 shadow-sm transition-all duration-200"
      style={{ borderLeft: highlight ? `4px solid ${borderColor}` : undefined }}
    >
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 dark:text-gray-400">{label}</span>
        <div className="w-9 h-6 rounded-[6px] py-4 px-1 flex items-center justify-center" style={{ background: iconBg }}>
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>
      <span className="text-[32px] font-bold text-gray-900 dark:text-white leading-none mt-1">{value}</span>
      {footerText && (
        <div className="mt-1">
          {typeof footerText === "string" ? (
            <span className="text-[11px] font-semibold px-[6px] py-[1px] rounded-[5px]" style={{ background: footerBg, color: footerColor }}>
              {footerText}
            </span>
          ) : (
            footerText
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alloc, setAlloc] = useState("By Team");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/projects"), api.get("/tasks")])
      .then(([projectsResponse, tasksResponse]) => {
        setProjects(Array.isArray(projectsResponse.data) ? projectsResponse.data : []);
        setTasks(Array.isArray(tasksResponse.data) ? tasksResponse.data : []);
      })
      .catch((err) => {
        console.warn("Failed to load projects dashboard data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalCount = projects.length;
  const completedCount = projects.filter((p) => String(p.status || "").toUpperCase() === "COMPLETED").length;
  const activeCount = projects.filter((p) => String(p.status || "").toUpperCase() !== "COMPLETED").length;
  const delayedCount = projects.filter((p) =>
    tasks.some((t) => (t.project_id === p.id || t.projectId === p.id) && t.status !== "DONE" && t.deadline && new Date(t.deadline) < new Date())
  ).length;
  const atRiskCount = delayedCount;

  const onTrackPct = totalCount ? Math.round(((totalCount - delayedCount) / totalCount) * 100) : 100;
  const warningPct = totalCount ? Math.round((delayedCount / totalCount) * 100) : 0;
  const criticalPct = totalCount ? Math.round((atRiskCount / totalCount) * 100) : 0;
  const healthyScore = onTrackPct;

  const mappedProjects = projects.map((p) => {
    const pTasks = tasks.filter((t) => t.project_id === p.id || t.projectId === p.id);
    const pDone = pTasks.filter((t) => t.status === "DONE").length;
    const prog = pTasks.length ? Math.round((pDone / pTasks.length) * 100) : (String(p.status).toUpperCase() === "COMPLETED" ? 100 : 0);
    const isOverdue = pTasks.some((t) => t.status !== "DONE" && t.deadline && new Date(t.deadline) < new Date());
    const ownerName = p.owner?.name || (typeof p.owner === "string" ? p.owner : "Unassigned");
    const ownerInit = (ownerName || "U")[0]?.toUpperCase();

    let status = p.status || "In Progress";
    let sBg = "#bfdbfe", sColor = "#1d4ed8", health = "#22c55e";
    if (String(status).toUpperCase() === "COMPLETED") {
      sBg = "#dcfce7"; sColor = "#16a34a"; health = "#22c55e";
    } else if (isOverdue) {
      status = "Delayed"; sBg = "#fee2e2"; sColor = "#dc2626"; health = "#ef4444";
    }

    return {
      id: p.id,
      name: p.name || p.title || "Untitled Project",
      sub: p.description || p.department || "General",
      av: ownerInit,
      avBg: "#3b82f6",
      owner: ownerName,
      prog,
      progColor: prog === 100 ? "#22c55e" : "#3b82f6",
      status,
      sBg,
      sColor,
      health,
      deadline: p.created_at ? new Date(p.created_at).toLocaleDateString() : "—",
      risk: isOverdue,
    };
  });

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = mappedProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.owner.toLowerCase().includes(search.toLowerCase())
  );

  const totalTablePages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginatedTableProjects = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const thClass =
    "px-[10px] py-[6px] text-left text-[9px] font-medium uppercase tracking-[0.06em] text-gray-400 dark:text-zinc-500 border-b border-gray-200 dark:border-zinc-800 whitespace-nowrap bg-white dark:bg-[#1c2128]";
  const tdClass = "px-[10px] py-2 align-middle";

  return (
    <div className="bg-white dark:bg-[#08090ac7] min-h-screen font-sans transition-colors duration-300">
      <div className="w-full">
        {/* STAT CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-[10px] mb-[14px]">
          <StatCard
            label="Total Projects"
            value={loading ? "..." : totalCount}
            highlight={false}
            iconBg="#eff6ff"
            iconColor="#3b82f6"
            Icon={GiOpenFolder}
          />
          <StatCard
            label="Active"
            value={loading ? "..." : activeCount}
            highlight={false}
            iconBg="#eff6ff"
            iconColor="#3b82f6"
            Icon={FaCirclePlay}
          />
          <StatCard
            label="Completed"
            value={loading ? "..." : completedCount}
            highlight={false}
            iconBg="#dcfce7"
            iconColor="#16a34a"
            Icon={FaCheckCircle}
          />
          <StatCard
            label="Delayed"
            value={loading ? "..." : delayedCount}
            borderColor="#d97706"
            highlight={true}
            iconBg="#fef9c3"
            iconColor="#d97706"
            Icon={TbAlertTriangleFilled}
          />
          <StatCard
            label="At Risk"
            value={loading ? "..." : atRiskCount}
            borderColor="#dc2626"
            highlight={true}
            iconBg="#fee2e2"
            iconColor="#dc2626"
            Icon={BsXOctagonFill}
          />
        </div>

        {/* PROJECT HEALTH STATUS */}
        <div className="bg-white dark:bg-[#1c1d1d] border border-gray-200 dark:border-zinc-800 rounded-[10px] px-5 py-4 mb-3 shadow-sm">
          <p className="text-2xl font-bold text-black dark:text-white mb-4 tracking-normal leading-none">
            Project Health Status
          </p>
          <div className="flex items-center gap-11 pl-[6px]">
            <DonutChart
              onTrackPct={onTrackPct}
              warningPct={warningPct}
              criticalPct={criticalPct}
              healthyScore={healthyScore}
            />
            <div className="flex gap-10">
              {[
                ["#22c55e", "On Track", `(${onTrackPct}%)`],
                ["#f59e0b", "Warning", `(${warningPct}%)`],
                ["#ef4444", "Critical", `(${criticalPct}%)`],
              ].map(([c, lbl, pct]) => (
                <div key={lbl} className="flex items-center gap-[7px]">
                  <span
                    className="w-[14px] h-[14px] rounded-full inline-block shrink-0"
                    style={{ background: c }}
                  />
                  <div>
                    <div className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-[1.4]">
                      {lbl}
                    </div>
                    <div className="text-[11px] font-bold text-gray-900 dark:text-gray-100 leading-[1.4]">
                      {pct}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROJECTS TABLE */}
        <div className="bg-white dark:bg-[#1c1d1d] border border-gray-200 dark:border-zinc-800 rounded-[10px] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-[14px] py-3 border-b border-gray-200 dark:border-zinc-800">
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-normal leading-none">
              All Projects
            </span>
            <div className="flex gap-2 items-center">
              <div className="relative flex items-center">
                <span className="absolute left-2 flex pointer-events-none">
                  <IcoSearch />
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter projects..."
                  className="pl-[26px] pr-[10px] py-[5px] border border-gray-200 dark:border-zinc-800 rounded-[6px] text-xs font-medium text-gray-900 dark:text-gray-200 bg-white dark:bg-[#0c192e] w-[155px] outline-none"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-[5px] bg-[#2457C5] dark:bg-[#73FBFD] rounded-[6px] flex items-center justify-center gap-1 cursor-pointer btn-hover text-white dark:text-black font-semibold text-[11px]"
              >
                <Plus size={13} />
                <span>New Project</span>
              </button>
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["", "PROJECT NAME", "OWNER", "PROGRESS", "STATUS", "HEALTH", "CREATED", "RISK"].map((h, i) => (
                  <th key={i} className={thClass}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {loading && (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-xs text-gray-500">
                    Loading projects...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-xs text-gray-500">
                    No projects available.
                  </td>
                </tr>
              )}
              {!loading &&
                paginatedTableProjects.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 bg-white dark:bg-[#1c1d1d] transition-colors"
                  >
                    <td className={tdClass}>
                      <div className="w-[18px] h-[18px] border-[1.5px] border-gray-300 dark:border-zinc-700 rounded-[5px] bg-white dark:bg-[#0c192e]" />
                    </td>
                    <td className={tdClass}>
                      <div className="text-[11.5px] font-semibold text-gray-900 dark:text-zinc-200">
                        {p.name}
                      </div>
                      <div className="text-[9.5px] font-normal text-gray-400 dark:text-zinc-500 mt-[1px]">
                        {p.sub}
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-[6px]">
                        <div
                          className="w-[25px] h-[25px] rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                          style={{ background: p.avBg }}
                        >
                          {p.av}
                        </div>
                        <span className="text-[10.5px] font-normal text-gray-700 dark:text-zinc-400">
                          {p.owner}
                        </span>
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className="flex flex-col w-[80px]">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 mb-1">
                          {p.prog}%
                        </span>
                        <div className="w-full h-1 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${p.prog}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ background: p.progColor }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className={tdClass}>
                      <span
                        className="text-[10px] font-semibold px-[10px] py-[2px] rounded-full whitespace-nowrap shadow-sm"
                        style={{ background: p.sBg, color: p.sColor }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className={tdClass}>
                      <span
                        className="w-[9px] h-[9px] rounded-full inline-block shadow-sm"
                        style={{ background: p.health }}
                      />
                    </td>
                    <td className={`${tdClass} text-[10px] font-normal text-gray-500 dark:text-zinc-500 whitespace-nowrap`}>
                      {p.deadline}
                    </td>
                    <td className={tdClass}>
                      <IcoTriangle show={p.risk} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="px-[14px] py-2 bg-white dark:bg-[#1c1d1d] border-t border-gray-200 dark:border-zinc-800">
            <Pagination
              currentPage={currentPage}
              totalPages={totalTablePages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemLabel="projects"
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CreateNewProject
          onClose={() => setIsModalOpen(false)}
          onAddProject={(newProj) => {
            setProjects((prev) => [newProj, ...prev]);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
