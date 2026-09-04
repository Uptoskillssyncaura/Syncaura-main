import { useMemo, useState, useEffect, useRef } from "react";
import { Search, ChevronUp, ChevronDown, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/features/taskThunks";
import api from "../config/axios";
import { toast } from "react-toastify";

// --- Data & Config ---
const STATUS_CONFIG = {
  TODO: { label: "To Do", pillClass: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400", textClass: "text-slate-600 dark:text-slate-400" },
  IN_PROGRESS: { label: "In Progress", pillClass: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", textClass: "text-amber-600 dark:text-amber-400" },
  DONE: { label: "Done", pillClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", textClass: "text-emerald-600 dark:text-emerald-400" },
};

const PRIORITY_CONFIG = {
  high: { label: "High", className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  medium: { label: "Medium", className: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  low: { label: "Low", className: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

const formatDate = (date) => {
  if (!date) return "—"; // Added fallback boundary check
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// --- Isolated Dropdown Component ---
function StatusDropdown({ currentStatus, onStatusChange, statusConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeConfig = statusConfig[currentStatus];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border border-transparent transition-all duration-200 hover:scale-105 ${activeConfig.pillClass}`}
      >
        {activeConfig.label}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-36 z-50 bg-white dark:bg-black rounded-2xl shadow-[0_0_10px_1px_#ACACAC33] border border-gray-100 dark:border-[#2E2F2F] overflow-hidden py-1"
          >
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  onStatusChange(key);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-[#2E2F2F]
                  ${currentStatus === key ? "bg-gray-50 dark:bg-[#2E2F2F]" : ""}
                  ${config.textClass}
                `}
              >
                {config.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const IssueStatus = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("ALL");   
  const [priorityFilter, setPriorityFilter] = useState("ALL"); 
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      dispatch(fetchTasks()); 
      toast.success("Task status updated!");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };
    const toggleDateOrder = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  };

const filteredIssues = useMemo(() => {
  const uniqueTasksMap = new Map();
  tasks.forEach((task) => {
    const id = task.id || task._id;
    if (id) {
      uniqueTasksMap.set(id, task);
    } else {
      uniqueTasksMap.set(JSON.stringify(task), task);
    }
  });
  
  let result = Array.from(uniqueTasksMap.values());
  if (statusFilter !== "ALL") {
    result = result.filter((task) => (task.status || "TODO") === statusFilter);
  }

  if (priorityFilter !== "ALL") {
    result = result.filter((task) => (task.priority || "medium") === priorityFilter);
  }
  if (search.trim()) {
    const query = search.toLowerCase();
    result = result.filter((task) => {
      const titleMatch = task.title?.toLowerCase().includes(query);
      
      const assigneeText = String(
        task.assignedTo || 
        task.assigned_to || 
        task.assigned_user_name || 
        ""
      ).toLowerCase();
      
      return titleMatch || assigneeText.includes(query);
    });
  }
  result.sort((a, b) => {
    const dateA = new Date(a.createdAt || a.deadline || 0).getTime();
    const dateB = new Date(b.createdAt || b.deadline || 0).getTime();
    return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
  });

  return result;
}, [tasks, search, statusFilter, priorityFilter, sortDirection]);

  return (
    <div className="w-full min-h-full bg-[#F7F8FA] dark:bg-[#111214] transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white">Issue Status</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and track all reported issues</p>
        </div>

        {/* Search */}
        <div className="mb-5">
          <div className="flex items-center gap-2 w-full sm:max-w-md bg-white dark:bg-[#1e1f22] border border-[#E8EAED] dark:border-[#2d2f33] rounded-xl px-3.5 py-2.5">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issues..."
              className="flex-1 text-sm bg-transparent outline-none text-[#0A0A0A] dark:text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#1a1b1e] border border-[#E8EAED] dark:border-[#2d2f33] rounded-2xl overflow-visible">
          {filteredIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-400 dark:text-gray-500 text-sm">No issues found</p>
            </div>
          ) : (
            <div className="overflow-visible">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-[#2d2f33] select-none text-left">
                    {/* Date Column - Clickable Toggle */}
                    <th 
                      onClick={toggleDateOrder} 
                      className="py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      Date {sortDirection === "desc" ? "▼ (Recent)" : "▲ (Old)"}
                    </th>

                    <th className="py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide text-gray-400">
                      Name
                    </th>
                    <th className="py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide text-gray-400">
                      Project
                    </th>
                    <th className="py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide text-gray-400">
                      Title
                    </th>

                    {/* Status Filter Column - Interactive Dropdown */}
                    <th className="py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide relative">
                      <div 
                        onClick={() => {
                          setIsStatusDropdownOpen(!isStatusDropdownOpen);
                          setIsPriorityDropdownOpen(false); // Close priority dropdown
                        }}
                        className="flex items-center gap-1 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      >
                        Status <ChevronDown className="w-3.5 h-3.5 inline opacity-70" />
                      </div>

                      <AnimatePresence>
                        {isStatusDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full left-5 mt-1 w-40 z-50 bg-white dark:bg-[#1a1b1e] border border-gray-200 dark:border-[#2d2f33] rounded-xl shadow-xl overflow-hidden py-1 normal-case text-sm font-medium"
                          >
                            {[
                              { key: "ALL", val: "All Statuses" },
                              { key: "TODO", val: "To Do" },
                              { key: "IN_PROGRESS", val: "In Progress" },
                              { key: "DONE", val: "Done" }
                            ].map((opt) => (
                              <button
                                key={opt.key}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setStatusFilter(opt.key);
                                  setIsStatusDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#2d2f33] ${statusFilter === opt.key ? "text-blue-500 font-bold bg-blue-50/50 dark:bg-blue-900/10" : "text-gray-700 dark:text-gray-300"}`}
                              >
                                {opt.val}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </th>

                    {/* Priority Filter Column - Interactive Dropdown */}
                    <th className="py-4 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wide relative">
                      <div 
                        onClick={() => {
                          setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
                          setIsStatusDropdownOpen(false); // Close status dropdown
                        }}
                        className="flex items-center gap-1 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      >
                        Priority <ChevronDown className="w-3.5 h-3.5 inline opacity-70" />
                      </div>

                      <AnimatePresence>
                        {isPriorityDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full left-5 mt-1 w-40 z-50 bg-white dark:bg-[#1a1b1e] border border-gray-200 dark:border-[#2d2f33] rounded-xl shadow-xl overflow-hidden py-1 normal-case text-sm font-medium"
                          >
                            {/* Filter options mapping */}
                          {[
                            { key: "ALL", val: "All Priorities" },
                            { key: "low", val: "Low" },
                            { key: "medium", val: "Medium" },
                            { key: "high", val: "High" }
                          ].map((opt) => (
                            <button
                              key={opt.key}
                              onClick={(e) => {
                                e.stopPropagation(); 
                                setPriorityFilter(opt.key);
                                setIsPriorityDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#2d2f33] capitalize ...`}
                            >
                              {opt.val}
                            </button>
                          ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredIssues.map((task) => {
                    // Fallback properties for live Redux data items
                    const priorityKey = task.priority || "medium";
                    const priority = PRIORITY_CONFIG[priorityKey] || PRIORITY_CONFIG.medium;
                    const statusKey = task.status || "TODO";

                    return (
                      <tr 
                        key={task.id || task._id || `task-fallback-${index}`} 
                        className="border-b border-gray-50 dark:border-[#2d2f33] hover:bg-gray-50/80 dark:hover:bg-[#1e1f22] transition-colors relative"
                      >
                        {/* Date */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CalendarDays className="w-4 h-4 text-gray-400" />
                            {formatDate(task.createdAt || task.deadline)}
                          </div>
                        </td>

                        {/* Name (Assignee ID or Username) */}
                        <td className="py-4 px-5">
                          <span className="text-sm font-medium text-[#0A0A0A] dark:text-white">
                            {task.assignedTo || task.assigned_to || task.assigned_user_name || "Unassigned"}
                          </span>
                        </td>

                        {/* Project Column mapping */}
                        <td className="py-4 px-5">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {task.project || task.projectName || "General"}
                          </span>
                        </td>

                        {/* Title */}
                        <td className="py-4 px-5">
                          <span className="text-sm font-medium text-[#0A0A0A] dark:text-white">
                            {task.title}
                          </span>
                        </td>

                        {/* Custom Dropdown Status */}
                        <td className="py-4 px-5 relative">
                          <StatusDropdown 
                            currentStatus={statusKey}
                            onStatusChange={(newStatus) => handleStatusChange(task.id || task._id, newStatus)}
                            statusConfig={STATUS_CONFIG}
                          />
                        </td>

                        {/* Priority Block */}
                        <td className="py-4 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${priority.className}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {priority.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          {statusFilter === "ALL" && priorityFilter === "ALL" && !search.trim() 
            ? `Showing all ${tasks.length} issues` 
            : `Showing ${filteredIssues.length} of ${tasks.length} filtered issues`
          }
        </p>
      </div>
    </div>
  );
};

export default IssueStatus;