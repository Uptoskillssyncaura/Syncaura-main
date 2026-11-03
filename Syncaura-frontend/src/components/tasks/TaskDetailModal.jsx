import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Flag,
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  ChevronRight,
  AlertTriangle,
  Save,
  Loader2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
  updateTask,
  addSubtask,
  toggleSubtaskStatus,
  deleteTask,
} from "../../redux/features/taskThunks";
import { getAssigneeDisplay, getTaskCreatorInfo } from "./taskUtils";

const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  medium:
    "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const STATUS_OPTIONS = [
  {
    value: "TODO",
    label: "To Do",
    color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
  },
  {
    value: "DONE",
    label: "Done",
    color:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const TaskDetailModal = ({
  task,
  onClose,
  onDeleted,
  canDelete,
  isAdmin = false,
  usersList = [],
  currentUser = null,
  onRaiseIssue,
}) => {
  const dispatch = useDispatch();
  const [subtaskInput, setSubtaskInput] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState(task.status || "TODO");
  const [saveLoading, setSaveLoading] = useState(false);

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
  };

  const handleSave = async () => {
    if (saveLoading) return;

    setSaveLoading(true);

    try {
      await dispatch(
        updateTask({
          id: task.id,
          data: {
            status: selectedStatus,
          },
        }),
      ).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddSubtask = async () => {
    if (!subtaskInput.trim()) return;
    setAddingSubtask(true);
    try {
      await dispatch(
        addSubtask({ taskId: task.id, title: subtaskInput.trim() }),
      ).unwrap();
      setSubtaskInput("");
    } finally {
      setAddingSubtask(false);
    }
  };

  const handleToggleSubtask = async (subtask) => {
    const newStatus = subtask.status === "DONE" ? "TODO" : "DONE";
    try {
      await dispatch(
        toggleSubtaskStatus({
          taskId: task.id,
          subtaskId: subtask.id,
          status: newStatus,
        }),
      ).unwrap();
    } catch {
      // no-op — UI stays in previous state if the request fails
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    await dispatch(deleteTask(task.id)).unwrap();
    onDeleted();
    onClose();
  };

  const completedSubtasks =
    task.subtasks?.filter((s) => s.status === "DONE").length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  // Calculate days remaining to complete the task (10-day deadline)
  const daysInfo = useMemo(() => {
    if (!task.deadline) return { daysLeft: null, totalDays: 10, isOverdue: false };
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(task.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffMs = deadlineDate - now;
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    // Calculate total days from created to deadline
    const createdDate = new Date(task.created_at || task.createdAt || now);
    createdDate.setHours(0, 0, 0, 0);
    const totalMs = deadlineDate - createdDate;
    const totalDays = Math.max(Math.ceil(totalMs / (1000 * 60 * 60 * 24)), 1);
    return {
      daysLeft: Math.max(daysLeft, 0),
      totalDays,
      isOverdue: daysLeft < 0,
      deadlineDate,
    };
  }, [task.deadline, task.created_at, task.createdAt]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="modal-animate w-full max-w-lg bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#2d2f33] overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 dark:border-[#2d2f33]">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}`}
              >
                {task.priority || "medium"} priority
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#0A0A0A] dark:text-white leading-snug">
              {task.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2f33] transition-colors btn-hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Project Tag */}
          {(task.project_name || task.project_title) && (
            <div className="bg-blue-50/60 dark:bg-[#73FBFD]/10 border border-blue-100 dark:border-[#73FBFD]/20 rounded-xl p-3 flex items-center gap-2.5">
              <span className="text-base">📁</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project</span>
                <span className="text-xs font-bold text-blue-600 dark:text-[#73FBFD] truncate">
                  {task.project_name || task.project_title}
                </span>
              </div>
            </div>
          )}

          {/* Issue Banner */}
          {task.task_issue_status && (
            <div
              className={`rounded-xl p-3.5 border flex flex-col gap-1.5 ${
                task.task_issue_status === "resolved"
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-200"
                  : task.task_issue_status === "in-progress"
                  ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40 text-blue-800 dark:text-blue-200"
                  : task.task_issue_status === "closed"
                  ? "bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-xs">
                  {task.task_issue_status === "resolved" ? (
                    <span>✅ Task Issue is Resolved</span>
                  ) : task.task_issue_status === "in-progress" ? (
                    <span>⏳ Task Issue is In Progress</span>
                  ) : task.task_issue_status === "closed" ? (
                    <span>🔒 Task Issue is Closed</span>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>⚠️ Task Issue is Open</span>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRaiseIssue?.(task)}
                  className="text-[11px] underline font-medium hover:opacity-80"
                >
                  View / Raise details
                </button>
              </div>
              {task.task_issue_resolution && (
                <div className="mt-1 pt-1.5 border-t border-black/10 dark:border-white/10 text-xs">
                  <span className="font-semibold">Resolution Note: </span>
                  <span className="opacity-90">{task.task_issue_resolution}</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {task.description && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Description
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {task.description}
              </p>
            </div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                {isAdmin ? "Deadline" : "Days to Complete"}
              </p>
              {isAdmin ? (
                /* Admin sees the full date */
                <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {formatDate(task.deadline)}
                </div>
              ) : (
                /* User sees days remaining countdown (read-only) */
                <div className="flex flex-col gap-1.5">
                  {daysInfo.daysLeft !== null ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-lg font-bold ${daysInfo.isOverdue
                            ? "text-red-500"
                            : daysInfo.daysLeft <= 2
                              ? "text-amber-500"
                              : "text-emerald-500"
                            }`}
                        >
                          {daysInfo.isOverdue ? "Overdue" : `${daysInfo.daysLeft} day${daysInfo.daysLeft !== 1 ? "s" : ""} left`}
                        </span>
                      </div>
                      {/* Progress bar for days */}
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${daysInfo.isOverdue
                            ? "bg-red-500"
                            : daysInfo.daysLeft <= 2
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                            }`}
                          style={{
                            width: `${Math.min((daysInfo.daysLeft / daysInfo.totalDays) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400">
                        Deadline: {formatDate(task.deadline)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">No deadline set</span>
                  )}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Assigned To
              </p>
              <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="truncate">{getAssigneeDisplay(task, usersList, currentUser)}</span>
              </div>
              {(() => {
                const cInfo = getTaskCreatorInfo(task, usersList, currentUser);
                if (!cInfo) return null;
                return (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">Origin:</span>
                    {cInfo.isSelfAssigned ? (
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        Self-created by user
                      </span>
                    ) : (
                      <span>
                        {cInfo.label}
                      </span>
                    )}
                  </p>
                );
              })()}
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Status
            </p>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  disabled={saveLoading}
                  className={`btn-hover flex-1 py-2 text-xs font-semibold rounded-xl ${selectedStatus === opt.value
                      ? opt.color + " ring-2 ring-offset-1 ring-current"
                      : "bg-gray-100 dark:bg-[#2d2f33] text-gray-400 dark:text-gray-500 hover:opacity-80"
                    } disabled:opacity-60`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Subtasks ({completedSubtasks}/{totalSubtasks})
              </p>
              {totalSubtasks > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 dark:bg-[#73FBFD] rounded-full transition-all"
                      style={{
                        width: `${(completedSubtasks / totalSubtasks) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {Math.round((completedSubtasks / totalSubtasks) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Subtask list */}
            <AnimatePresence>
              {task.subtasks?.map((subtask) => (
                <motion.div
                  key={subtask.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2.5 py-2 border-b border-gray-50 dark:border-[#2d2f33] last:border-0"
                >
                  {subtask.status === "DONE" ? (
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(subtask)}
                      className="flex-shrink-0"
                      aria-label="Mark subtask as not done"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(subtask)}
                      className="flex-shrink-0"
                      aria-label="Mark subtask as done"
                    >
                      <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-400 transition-colors" />
                    </button>
                  )}
                  <span
                    className={`text-sm ${subtask.status === "DONE" ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {subtask.title}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add subtask input */}
            <div className="flex items-center gap-2 mt-3">
              <input
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                placeholder="Add a subtask…"
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-[#2d2f33] bg-white dark:bg-[#111214] text-[#0A0A0A] dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-[#73FBFD]/30 transition-all"
              />
              <button
                onClick={handleAddSubtask}
                disabled={addingSubtask || !subtaskInput.trim()}
                className="p-2 rounded-xl bg-[#2457C5] dark:bg-[#73FBFD] text-white dark:text-black hover:bg-blue-700 dark:hover:bg-[#5af4f5] transition-colors disabled:opacity-50 btn-hover"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 dark:border-[#2d2f33]">

          {/* Delete Task */}
          <div>
            {canDelete ? (
              !confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors btn-hover"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Task
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />

                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Delete this task?
                  </span>

                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors btn-hover"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors btn-hover"
                  >
                    Delete
                  </button>
                </div>
              )
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRaiseIssue?.(task)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-red-600 dark:hover:text-red-400 bg-amber-50 dark:bg-amber-950/30 hover:bg-red-50 dark:hover:bg-red-950/40 border border-amber-200 dark:border-amber-800/40 transition-colors btn-hover"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Raise Issue</span>
            </button>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saveLoading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2457C5] dark:bg-[#73FBFD] text-white dark:text-black text-sm font-semibold hover:bg-blue-700 dark:hover:bg-[#5af4f5] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed btn-hover"
            >
              {saveLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetailModal;
