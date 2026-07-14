import { motion } from "framer-motion";
import { Calendar, CheckSquare, ChevronRight, Clock, Flag, Trash2 } from "lucide-react";

const PRIORITY_CONFIG = {
  high: {
    label: "High",
    className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    dot: "bg-red-500",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low",
    className: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
};

const TaskCard = ({ task, onOpen, onDelete }) => {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const completedSubtasks = task.subtasks?.filter((s) => s.status === "DONE").length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const deadline = task.deadline;
  const overdue = isOverdue(deadline) && task.status !== "DONE";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-[#1e1f22] border border-[#E8EAED] dark:border-[#2d2f33] rounded-xl p-4 cursor-pointer group relative"
      onClick={() => onOpen(task)}
    >
      {/* Priority + Delete */}
      <div className="flex items-center justify-between mb-3">
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${priority.className}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 btn-hover"
          aria-label="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-[#0A0A0A] dark:text-white leading-snug mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Subtasks progress */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <CheckSquare className="w-3 h-3" />
              {completedSubtasks}/{totalSubtasks} subtasks
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 dark:bg-[#73FBFD] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        {deadline ? (
          <span className={`flex items-center gap-1 text-xs font-medium ${overdue ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
            {overdue ? <Clock className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
            {overdue ? "Overdue · " : ""}{formatDate(deadline)}
          </span>
        ) : (
          <span />
        )}
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-[#73FBFD] transition-colors" />
      </div>
    </motion.div>
  );
};

export default TaskCard;
