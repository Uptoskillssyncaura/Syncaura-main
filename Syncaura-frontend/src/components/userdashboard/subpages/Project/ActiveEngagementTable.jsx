import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Download,
  Dot,
  Smartphone,
  Database,
  Globe,
  ShieldCheck,
  LayoutDashboard,
  CreditCard,
} from "lucide-react";

const PAGE_SIZE = 4;

const projectsData = [
  { id: 1, name: "Mobile Banking App", role: "UI LEAD", tasks: "5/8", progress: 75, sprint: "Q3 Sprint 4", status: "On Track", icon: Smartphone, roleStyles: "text-blue-600 border-blue-300 bg-blue-50 dark:text-[#00d2ff] dark:border-[#00d2ff]/50 dark:bg-[#00d2ff]/10" },
  { id: 2, name: "CMR Integration", role: "DEV", tasks: "2/12", progress: 40, sprint: "Q3 Sprint 3", status: "Delayed", icon: Database, roleStyles: "text-purple-600 border-purple-300 bg-purple-50 dark:text-[#c084fc] dark:border-[#c084fc]/50 dark:bg-[#c084fc]/10" },
  { id: 3, name: "Global Site Localization", role: "REVIEWER", tasks: "1/15", progress: 15, sprint: "Q4 Planning", status: "At Risk", icon: Globe, roleStyles: "text-slate-600 border-slate-300 bg-slate-50 dark:text-[#94a3b8] dark:border-[#94a3b8]/50 dark:bg-[#94a3b8]/10" },
  { id: 4, name: "HR Security Audit", role: "CONSULTANT", tasks: "18/20", progress: 90, sprint: "Q3 Sprint 4", status: "Complete", icon: ShieldCheck, roleStyles: "text-cyan-600 border-cyan-300 bg-cyan-50 dark:text-[#38bdf8] dark:border-[#38bdf8]/50 dark:bg-[#38bdf8]/10" },
  { id: 5, name: "Marketing Dashboard", role: "UI LEAD", tasks: "6/10", progress: 60, sprint: "Q4 Sprint 1", status: "On Track", icon: LayoutDashboard, roleStyles: "text-blue-600 border-blue-300 bg-blue-50 dark:text-[#00d2ff] dark:border-[#00d2ff]/50 dark:bg-[#00d2ff]/10" },
  { id: 6, name: "Payment Gateway", role: "DEV", tasks: "3/14", progress: 25, sprint: "Q4 Sprint 2", status: "At Risk", icon: CreditCard, roleStyles: "text-purple-600 border-purple-300 bg-purple-50 dark:text-[#c084fc] dark:border-[#c084fc]/50 dark:bg-[#c084fc]/10" },
];

const statusStyles = {
  "On Track": "bg-green-50 text-green-700 border border-green-200 dark:bg-[#064e3b]/30 dark:text-[#4ade80] dark:border-[#064e3b]",
  "Delayed": "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-[#451a03]/30 dark:text-[#fbbf24] dark:border-[#78350f]",
  "At Risk": "bg-red-50 text-red-700 border border-red-200 dark:bg-[#450a0a]/30 dark:text-[#f87171] dark:border-[#7f1d1d]",
  "Complete": "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-[#065f46]/40 dark:text-[#10b981] dark:border-[#059669]",
};

export default function ActiveEngagementTable() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  const filteredData = useMemo(() => {
    if (filter === "All") return projectsData;
    return projectsData.filter((p) => p.status === filter);
  }, [filter]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExport = () => {
    const csv = filteredData.map((p) => [p.name, p.role, p.tasks, p.progress, p.sprint, p.status].join(",")).join("\n");
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
                {paginatedData.map((item) => (
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
                          <item.icon size={16} />
                        </div>
                        {item.name}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs border rounded ${item.roleStyles}`}>
                        {item.role}
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
                      {item.sprint}
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