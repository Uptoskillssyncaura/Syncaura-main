import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Download,
  Dot,
} from "lucide-react";

const PAGE_SIZE = 4;

const statusStyles = {
  "On Track": "bg-green-50 text-green-700 border border-green-200 dark:bg-[#064e3b]/30 dark:text-[#4ade80] dark:border-[#064e3b]",
  "Delayed": "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-[#451a03]/30 dark:text-[#fbbf24] dark:border-[#78350f]",
  "At Risk": "bg-red-50 text-red-700 border border-red-200 dark:bg-[#450a0a]/30 dark:text-[#f87171] dark:border-[#7f1d1d]",
  "Complete": "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-[#065f46]/40 dark:text-[#10b981] dark:border-[#059669]",
};

export default function ActiveEngagementTable({ projects = [], loading = false }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  const filteredData = useMemo(() => {
    const projectRows = projects.map((project) => ({ ...project, status: project.overdue ? "At Risk" : project.progress === 100 ? "Complete" : "On Track", tasks: `${project.completed}/${project.total}` }));
    if (filter === "All") return projectRows;
    return projectRows.filter((project) => project.status === filter);
  }, [filter, projects]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExport = () => {
    const csv = filteredData.map((p) => [p.name, p.tasks, p.progress, p.status].join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projects.csv";
    a.click();
  };

  return (
    <div className="w-full bg-white dark:bg-[#0f1113] transition-colors">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white text-black dark:bg-[#1E1E1E] dark:text-white rounded-xl shadow-none border border-slate-200 dark:border-[#2d2f31] overflow-hidden"
      >

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-slate-200 dark:border-[#2d2f31]">
          <h2 className="text-2xl font-bold">Active Engagement Table</h2>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowFilter((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-300 text-black dark:bg-[#242628] dark:border-[#3e4042] dark:text-white rounded-md text-sm hover:bg-slate-200 dark:hover:bg-[#2d2f31] btn-hover"
            >
              <Filter size={14} /> Filter
            </button>

            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-10 z-20 bg-white border border-slate-300 dark:bg-[#1a1c1e] dark:border-[#3e4042] rounded-lg shadow-xl w-40"
              >
                {["All", "On Track", "Delayed", "At Risk", "Complete"].map((item) => (
                  <button
                    key={item}
                    onClick={() => { setFilter(item); setPage(1); setShowFilter(false); }}
                    className={`btn-hover w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-[#2d2f31] ${
                      filter === item ? "font-bold" : "text-gray-400 dark:text-gray-400"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-300 text-black dark:bg-[#242628] dark:border-[#3e4042] dark:text-white rounded-md text-sm hover:bg-slate-200 dark:hover:bg-[#2d2f31] btn-hover"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 dark:bg-[#1a1c1e] dark:border-[#2d2f31] dark:text-[#94a3b8] uppercase text-[11px]">
              <tr>
                <th className="px-6 py-4 text-left">Project Name</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Tasks</th>
                <th className="px-6 py-4 text-left">Progress</th>
                <th className="px-6 py-4 text-left">Sprint</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-[#2d2f31]">
              <AnimatePresence mode="wait">
                {loading && <tr><td colSpan="6" className="p-6 text-center text-slate-500">Loading projects...</td></tr>}
                {!loading && paginatedData.length === 0 && <tr><td colSpan="6" className="p-6 text-center text-slate-500">No projects found.</td></tr>}
                {!loading && paginatedData.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50 dark:hover:bg-[#1c1e21]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-slate-100 dark:bg-[#242628] border border-slate-300 dark:border-[#3e4042] rounded">
                          <Dot size={16} />
                        </div>
                        {item.name}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs border rounded text-slate-600 border-slate-300">
                        {item.role || 'Member'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-[#94a3b8]">
                      {item.tasks}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-slate-200 dark:bg-[#2d2f31] rounded">
                          <div
                            className="h-full bg-blue-500 dark:bg-[#00d2ff]"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="text-xs">{item.progress}%</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-[#94a3b8]">
                      {item.sprint || 'Not assigned'}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded ${statusStyles[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-[#2d2f31] bg-white dark:bg-[#141517] flex justify-between text-xs">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredData.length)} of {filteredData.length}
          </span>

          <div className="flex gap-2 text-slate-600 dark:text-[#94a3b8]">
            <button 
              className="hover:text-black dark:hover:text-white disabled:opacity-30 btn-hover" 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
            >
              Prev
            </button>
            <button 
              className="hover:text-black dark:hover:text-white disabled:opacity-30 btn-hover"
              onClick={() => setPage(page + 1)} 
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}