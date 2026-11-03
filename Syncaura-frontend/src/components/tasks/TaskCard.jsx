import { motion } from "framer-motion";
import {
  Calendar,
  CheckSquare,
  ChevronRight,
  Clock,
  Flag,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { getAssigneeBadge, getTaskCreatorInfo } from "./taskUtils";

const PRIORITY_CONFIG = {
  high: {
    label: "High",
    className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    dot: "bg-red-500",
  },
  medium: {
    label: "Medium",
    className:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low",
    className:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
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

const TaskCard = ({
  task,
  onOpen,
  onDelete,
  canDelete,
  usersList = [],
  currentUser = null,
  onRaiseIssue,
}) => {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const completedSubtasks =
    task.subtasks?.filter((s) => s.status === "DONE").length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const deadline = task.deadline;
  const overdue = isOverdue(deadline) && task.status !== "DONE";
  const creatorInfo = getTaskCreatorInfo(task, usersList, currentUser);

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
      {/* Priority + Project Tag + Self-Assigned/Creator Tag + Delete */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${priority.className}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>

          {(task.project_name || task.project_title) && (
            <span
              className="text-[11px] font-semibold text-blue-600 dark:text-[#73FBFD] bg-blue-50 dark:bg-[#73FBFD]/10 border border-blue-200 dark:border-[#73FBFD]/20 px-2 py-0.5 rounded-md truncate max-w-[130px]"
              title={task.project_name || task.project_title}
            >
              📁 {task.project_name || task.project_title}
            </span>
          )}

          {creatorInfo && creatorInfo.isSelfAssigned ? (
            <span
              className="text-[10px] font-semibold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 px-1.5 py-0.5 rounded-md"
              title="This task was created by the user for themselves"
            >
              👤 Self-created
            </span>
          ) : (
            <span
              className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 px-1.5 py-0.5 rounded-md truncate max-w-[130px]"
              title={creatorInfo?.label || "Assigned by Admin"}
            >
              👤 By {creatorInfo?.name || "Admin"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {task.task_issue_status ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onRaiseIssue?.(task);
              }}
              title={`Issue status: ${task.task_issue_status}. Click to view or raise another.`}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                task.task_issue_status === "resolved"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50"
                  : task.task_issue_status === "in-progress"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/50"
                  : task.task_issue_status === "closed"
                  ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50"
              }`}
            >
              {task.task_issue_status === "resolved" ? (
                <span>✅ Issue Resolved</span>
              ) : task.task_issue_status === "in-progress" ? (
                <span>⏳ Issue In Progress</span>
              ) : task.task_issue_status === "closed" ? (
                <span>🔒 Issue Closed</span>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span>Issue Open</span>
                </>
              )}
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRaiseIssue?.(task);
              }}
              title="Raise an issue for this task"
              className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-red-600 dark:hover:text-red-400 bg-amber-50 dark:bg-amber-950/30 hover:bg-red-50 dark:hover:bg-red-950/40 border border-amber-200 dark:border-amber-800/40 hover:border-red-200 px-2 py-0.5 rounded-lg transition-colors btn-hover"
            >
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span>Issue</span>
            </button>
          )}
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 btn-hover"
              aria-label="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
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
              animate={{
                width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%`,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 gap-2">
        {(() => {
          const assigneeInfo = getAssigneeBadge(task, usersList);
          return assigneeInfo ? (
            <div
              title={assigneeInfo.email ? `${assigneeInfo.name} (${assigneeInfo.email})` : assigneeInfo.name}
              className="flex flex-col min-w-0 max-w-[155px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800"
            >
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-tight">
                {assigneeInfo.name}
              </span>
              {assigneeInfo.email && (
                <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate leading-tight">
                  {assigneeInfo.email}
                </span>
              )}
            </div>
          ) : <span />;
        })()}
        {deadline ? (
          <span
            className={`flex items-center gap-1 text-xs font-medium ${overdue ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}
          >
            {overdue ? (
              <Clock className="w-3 h-3" />
            ) : (
              <Calendar className="w-3 h-3" />
            )}
            {overdue ? "Overdue · " : (() => {
              const now = new Date();
              now.setHours(0, 0, 0, 0);
              const dDate = new Date(deadline);
              dDate.setHours(0, 0, 0, 0);
              const diff = Math.ceil((dDate - now) / (1000 * 60 * 60 * 24));
              return diff >= 0 ? `${diff}d left · ` : "";
            })()}
            {formatDate(deadline)}
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
