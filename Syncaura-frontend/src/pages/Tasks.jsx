import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Flag,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  User,
  ChevronUp,
  ChevronDown,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  fetchTasks,
  createTask,
  deleteTask,
} from "../redux/features/taskThunks";
import KanbanColumn from "../components/tasks/KanbanColumn";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import TaskDetailModal from "../components/tasks/TaskDetailModal";
import RaiseTaskIssueModal from "../components/tasks/RaiseTaskIssueModal";
import { getAssigneeBadge, getAssigneeDisplay, getTaskCreatorInfo } from "../components/tasks/taskUtils";
import Pagination from "../components/common/Pagination";
import { toast } from "react-toastify";
import api from "../config/axios";

// ── Priority config ──────────────────────────────────────────────────────────
const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  medium:
    "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const STATUS_LABELS = {
  TODO: { label: "To Do", dot: "bg-slate-400" },
  IN_PROGRESS: { label: "In Progress", dot: "bg-blue-500" },
  DONE: { label: "Done", dot: "bg-emerald-500" },
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isOverdue = (dateStr, status) => {
  if (!dateStr || status === "DONE") return false;
  return new Date(dateStr) < new Date();
};

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="flex items-center gap-3 bg-white dark:bg-[#1e1f22] border border-[#E8EAED] dark:border-[#2d2f33] rounded-xl px-4 py-3">
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xl font-bold text-[#0A0A0A] dark:text-white leading-none">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  </div>
);

// ── List Row ─────────────────────────────────────────────────────────────────
const ListRow = ({
  task,
  onOpen,
  onDelete,
  canDelete,
  usersList = [],
  currentUser = null,
  onRaiseIssue,
}) => {
  const status = STATUS_LABELS[task.status] || STATUS_LABELS.TODO;
  const overdue = isOverdue(task.deadline, task.status);
  const assigneeInfo = getAssigneeBadge(task, usersList, currentUser);
  const creatorInfo = getTaskCreatorInfo(task, usersList, currentUser);

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onOpen(task)}
      className="border-b border-gray-50 dark:border-[#2d2f33] hover:bg-gray-50/80 dark:hover:bg-[#1e1f22] cursor-pointer group transition-colors"
    >
      <td className="py-3 px-4">
        <span className="text-sm font-medium text-[#0A0A0A] dark:text-white line-clamp-1">
          {task.title}
        </span>
      </td>
      <td className="py-3 px-3 hidden md:table-cell">
        {task.project_name || task.project_title ? (
          <span className="text-xs font-semibold text-blue-600 dark:text-[#73FBFD] bg-blue-50 dark:bg-[#73FBFD]/10 border border-blue-200 dark:border-[#73FBFD]/20 px-2 py-0.5 rounded-md truncate max-w-[140px] inline-block">
            📁 {task.project_name || task.project_title}
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>
      <td className="py-3 px-3 hidden md:table-cell">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${task.priority === "high" ? "bg-red-500" : task.priority === "low" ? "bg-emerald-500" : "bg-amber-500"}`}
          />
          {task.priority || "medium"}
        </span>
      </td>
      <td className="py-3 px-3">
        <span className="flex items-center gap-1.5 text-xs font-medium">
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          <span className="text-gray-600 dark:text-gray-400">
            {status.label}
          </span>
        </span>
      </td>
      <td className="py-3 px-3 hidden lg:table-cell">
        <span
          className={`flex items-center gap-1 text-xs ${overdue ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}
        >
          {overdue && <Clock className="w-3 h-3" />}
          {formatDate(task.deadline)}
        </span>
      </td>
      <td className="py-3 px-3 hidden lg:table-cell">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
            {assigneeInfo?.name || "Unassigned"}
          </span>
          {creatorInfo && (
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              {creatorInfo.isSelfAssigned ? (
                <span className="text-purple-600 dark:text-purple-400 font-medium">Self-created</span>
              ) : (
                <span>{creatorInfo.label}</span>
              )}
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRaiseIssue?.(task);
            }}
            title="Raise an issue for this task"
            className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-red-600 dark:hover:text-red-400 bg-amber-50 dark:bg-amber-950/30 hover:bg-red-50 dark:hover:bg-red-950/40 border border-amber-200 dark:border-amber-800/40 px-2 py-1 rounded-lg transition-colors btn-hover"
          >
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span>Issue</span>
          </button>
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 btn-hover"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

// ── Main Tasks Page ───────────────────────────────────────────────────────────
const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.tasks);
  const isDark = useSelector((state) => state.theme.isDark);
  const currentUser = useSelector((state) => state.auth?.user);
  const userRole = (currentUser?.role || "").toLowerCase();
  const isAdminOrCoAdmin =
    userRole === "admin" || userRole === "co-admin" || userRole === "coadmin";
  const isAdmin = userRole === "admin";

  const canDeleteTask = (task) =>
    isAdminOrCoAdmin ||
    (currentUser?.id && (String(task?.created_by) === String(currentUser.id) || String(task?.createdBy) === String(currentUser.id)));

  const [view, setView] = useState("kanban"); 
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [issueTask, setIssueTask] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [createLoading, setCreateLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);

  useEffect(() => {
    api
      .get("/users/all")
      .then((res) => setUsersList(res.data || []))
      .catch(() => {});

    api
      .get("/projects")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setProjectsList(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.toLowerCase()), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Initial load
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Live-update selectedTask when store changes
  useEffect(() => {
    if (!selectedTask) return;
    const updated = tasks.find((t) => t.id === selectedTask.id);
    if (updated) setSelectedTask(updated);
  }, [tasks]);

  // Filtered & sorted tasks
  const filtered = useMemo(() => {
    let result = [...tasks];

    if (!isAdminOrCoAdmin && currentUser) {
      const uId = String(currentUser.id || currentUser._id || "").toLowerCase();
      const uEmail = String(currentUser.email || "").toLowerCase();
      const uName = String(currentUser.name || "").toLowerCase();

      result = result.filter((t) => {
        const assigned = String(
          t.assignedTo || 
          t.assigned_to || 
          t.assigned_user_name || 
          t.assigned_user_email || 
          t.userId || 
          t.user_id || 
          ""
        ).toLowerCase();
        
        const assigneeId = String(t.assignee?.id || t.assignee?._id || t.user?.id || t.user?._id || "").toLowerCase();

        return (
          (uId && assigned === uId) ||
          (uId && assigneeId === uId) ||
          (uEmail && (assigned === uEmail || assigned.includes(uEmail))) ||
          (uName && (assigned === uName || assigned.includes(uName)))
        );
      });
    }

    if (debouncedSearch) {
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(debouncedSearch) ||
          t.description?.toLowerCase().includes(debouncedSearch),
      );
    }
    if (priorityFilter !== "all") {
      result = result.filter((t) => t.priority === priorityFilter);
    }
    if (projectFilter !== "all") {
      result = result.filter(
        (t) => String(t.project_id || t.projectId) === String(projectFilter),
      );
    }
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === "deadline" || sortField === "createdAt") {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [tasks, debouncedSearch, priorityFilter, projectFilter, sortField, sortDir, isAdminOrCoAdmin, currentUser]);

  const [listPage, setListPage] = useState(1);
  const LIST_PAGE_SIZE = 10;

  useEffect(() => {
    setListPage(1);
  }, [debouncedSearch, priorityFilter, projectFilter, sortField, sortDir]);

  const totalListPages = Math.ceil(filtered.length / LIST_PAGE_SIZE) || 1;
  const paginatedListTasks = useMemo(() => {
    const startIndex = (listPage - 1) * LIST_PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + LIST_PAGE_SIZE);
  }, [filtered, listPage, LIST_PAGE_SIZE]);

  const tasksByStatus = useMemo(
    () => ({
      TODO: filtered.filter((t) => t.status === "TODO"),
      IN_PROGRESS: filtered.filter((t) => t.status === "IN_PROGRESS"),
      DONE: filtered.filter((t) => t.status === "DONE"),
    }),
    [filtered],
  );

  // Stats
  const stats = useMemo(
    () => ({
      total: filtered.length,
      todo: filtered.filter((t) => t.status === "TODO").length,
      inProgress: filtered.filter((t) => t.status === "IN_PROGRESS").length,
      done: filtered.filter((t) => t.status === "DONE").length,
    }),
    [filtered],
  );

  const handleCreate = async (data) => {
    setCreateLoading(true);
    try {
      await dispatch(createTask(data)).unwrap();
      setShowCreate(false);
      toast.success("Task created!");
    } catch (err) {
      toast.error(err || "Failed to create task");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!canDeleteTask(task)) {
      toast.error("You don't have permission to delete this task");
      return;
    }
    await dispatch(deleteTask(id)).unwrap();
    toast.success("Task deleted");
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 inline" />
    ) : (
      <ChevronDown className="w-3 h-3 inline" />
    );
  };

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className="w-full min-h-full bg-[#F7F8FA] dark:bg-[#111214] transition-colors duration-500"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white">
              Tasks
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage and track your team's tasks
            </p>
          </div>

          <button
            id="create-task-btn"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2457C5] dark:bg-[#73FBFD] text-white dark:text-black text-sm font-semibold rounded-2xl hover:bg-blue-700 dark:hover:bg-[#5af4f5] transition-colors shadow-sm btn-hover"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* ── Stat Cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Total Tasks"
            value={stats.total}
            icon={Flag}
            color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          />
          <StatCard
            label="To Do"
            value={stats.todo}
            icon={Circle}
            color="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={Clock}
            color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          />
          <StatCard
            label="Completed"
            value={stats.done}
            icon={CheckCircle2}
            color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          />
        </div>

        {/* ── Toolbar ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2A2A2A] rounded-xl px-3.5 py-2.5 shadow-xs">
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <input
              type="text"
              id="task-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks…"
              className="flex-1 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2A2A2A] rounded-xl p-1 shadow-xs">
            {["all", "high", "medium", "low"].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`btn-hover px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  priorityFilter === p
                    ? "bg-[#2461E6] dark:bg-[#73FBFD] text-white dark:text-black shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1E1E1E]"
                }`}
              >
                {p === "all" ? "All" : p}
              </button>
            ))}
          </div>

          {/* Project Filter */}
          <div className="flex items-center bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2A2A2A] rounded-xl px-3 py-1 shadow-xs">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="text-xs font-semibold bg-transparent text-gray-800 dark:text-gray-200 outline-none cursor-pointer py-1.5 max-w-[150px] truncate"
            >
              <option value="all" className="bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100">📁 All Projects</option>
              {projectsList.map((p) => (
                <option key={p.id} value={p.id} className="bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100">
                  📁 {p.name || p.title}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2A2A2A] rounded-xl p-1 shadow-xs">
            <button
              id="kanban-view-btn"
              onClick={() => setView("kanban")}
              className={`btn-hover flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                view === "kanban"
                  ? "bg-[#2461E6] dark:bg-[#73FBFD] text-white dark:text-black shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1E1E1E]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Board
            </button>
            <button
              id="list-view-btn"
              onClick={() => setView("list")}
              className={`btn-hover flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                view === "list"
                  ? "bg-[#2461E6] dark:bg-[#73FBFD] text-white dark:text-black shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1E1E1E]"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
          </div>
        </div>

        {/* ── Loading ──────────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2457C5] dark:text-[#73FBFD] animate-spin" />
          </div>
        )}

        {/* ── Content ──────────────────────────────────────────────── */}
        {!isLoading && (
          <AnimatePresence mode="wait">
            {/* KANBAN BOARD */}
            {view === "kanban" && (
              <motion.div
                key="kanban"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
                  <KanbanColumn
                    key={status}
                    status={status}
                    tasks={tasksByStatus[status]}
                    onOpenTask={setSelectedTask}
                    onDeleteTask={handleDelete}
                    canDeleteTask={canDeleteTask}
                    usersList={usersList}
                    currentUser={currentUser}
                    onRaiseIssue={setIssueTask}
                  />
                ))}
              </motion.div>
            )}

            {/* LIST VIEW */}
            {view === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-[#1a1b1e] border border-[#E8EAED] dark:border-[#2d2f33] rounded-2xl overflow-hidden"
              >
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#2d2f33] flex items-center justify-center">
                      <Flag className="w-7 h-7 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      No tasks found
                    </p>
                  </div>
                ) : (
                  <>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-[#2d2f33]">
                          <th
                            className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 select-none"
                            onClick={() => handleSort("title")}
                          >
                            Title <SortIcon field="title" />
                          </th>
                          <th className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                            Project
                          </th>
                          <th className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                            Priority
                          </th>
                          <th
                            className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 select-none"
                            onClick={() => handleSort("status")}
                          >
                            Status <SortIcon field="status" />
                          </th>
                          <th
                            className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 select-none"
                            onClick={() => handleSort("deadline")}
                          >
                            Deadline <SortIcon field="deadline" />
                          </th>
                          <th className="text-left py-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                            Assigned & Origin
                          </th>
                          <th className="py-3 px-3 w-28 text-right" />
                        </tr>
                      </thead>
                      <AnimatePresence>
                        <tbody>
                          {paginatedListTasks.map((task) => (
                            <ListRow
                              key={task.id}
                              task={task}
                              onOpen={setSelectedTask}
                              onDelete={handleDelete}
                              canDelete={canDeleteTask(task)}
                              usersList={usersList}
                              currentUser={currentUser}
                              onRaiseIssue={setIssueTask}
                            />
                          ))}
                        </tbody>
                      </AnimatePresence>
                    </table>

                    {/* Table Pagination */}
                    <div className="px-4 py-2 border-t border-gray-100 dark:border-[#2d2f33]">
                      <Pagination
                        currentPage={listPage}
                        totalPages={totalListPages}
                        totalItems={filtered.length}
                        pageSize={LIST_PAGE_SIZE}
                        onPageChange={setListPage}
                        itemLabel="tasks"
                      />
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* ── Modals ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCreate && (
          <CreateTaskModal
            key="create-modal"
            onClose={() => setShowCreate(false)}
            onSubmit={handleCreate}
            isLoading={createLoading}
            isAdmin={isAdminOrCoAdmin}
          />
        )}
        {selectedTask && (
          <TaskDetailModal
            key="detail-modal"
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onDeleted={() => setSelectedTask(null)}
            canDelete={canDeleteTask(selectedTask)}
            isAdmin={isAdmin}
            usersList={usersList}
            currentUser={currentUser}
            onRaiseIssue={(t) => {
              setSelectedTask(null);
              setIssueTask(t);
            }}
          />
        )}
        {issueTask && (
          <RaiseTaskIssueModal
            key="raise-issue-modal"
            task={issueTask}
            onClose={() => setIssueTask(null)}
            onSuccess={() => {
              setIssueTask(null);
              dispatch(fetchTasks());
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
