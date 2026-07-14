import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Calendar, User, Flag, CheckCircle2, Circle,
  Trash2, Plus, ChevronRight, AlertTriangle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { updateTaskStatus, addSubtask, deleteTask } from "../../redux/features/taskThunks";

const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const STATUS_OPTIONS = [
  { value: "TODO", label: "To Do", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  { value: "IN_PROGRESS", label: "In Progress", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300" },
  { value: "DONE", label: "Done", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const TaskDetailModal = ({ task, onClose, onDeleted }) => {
  const dispatch = useDispatch();
  const [subtaskInput, setSubtaskInput] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === task.status) return;
    setStatusLoading(true);
    try {
      await dispatch(updateTaskStatus({ id: task._id, status: newStatus })).unwrap();
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAddSubtask = async () => {
    if (!subtaskInput.trim()) return;
    setAddingSubtask(true);
    try {
      await dispatch(addSubtask({ taskId: task._id, title: subtaskInput.trim() })).unwrap();
      setSubtaskInput("");
    } finally {
      setAddingSubtask(false);
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteTask(task._id)).unwrap();
    onDeleted();
    onClose();
  };

  const completedSubtasks = task.subtasks?.filter((s) => s.status === "DONE").length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

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
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}`}>
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
          {/* Description */}
          {task.description && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{task.description}</p>
            </div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Deadline</p>
              <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {formatDate(task.deadline)}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Assigned To</p>
              <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                <User className="w-3.5 h-3.5 text-gray-400" />
                {task.assignedTo || "Unassigned"}
              </div>
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Status</p>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  disabled={statusLoading}
                  className={`btn-hover flex-1 py-2 text-xs font-semibold rounded-xl ${
                    task.status === opt.value
                      ? opt.color + "ring-2 ring-offset-1 ring-current"
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
                      style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
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
                  key={subtask._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2.5 py-2 border-b border-gray-50 dark:border-[#2d2f33] last:border-0"
                >
                  {subtask.status === "DONE" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${subtask.status === "DONE" ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
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
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#2d2f33]">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors btn-hover"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Task
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">Delete this task?</span>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors btn-hover"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors btn-hover"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetailModal;
