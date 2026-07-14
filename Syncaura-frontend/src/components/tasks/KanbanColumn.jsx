import { AnimatePresence, motion } from "framer-motion";
import TaskCard from "./TaskCard";

const COLUMN_CONFIG = {
  TODO: {
    label: "To Do",
    color: "bg-slate-100 dark:bg-slate-800/50",
    headerColor: "text-slate-600 dark:text-slate-400",
    countColor: "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
    indicator: "bg-slate-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-50 dark:bg-blue-950/30",
    headerColor: "text-blue-600 dark:text-blue-400",
    countColor: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300",
    indicator: "bg-blue-500",
  },
  DONE: {
    label: "Done",
    color: "bg-emerald-50 dark:bg-emerald-950/20",
    headerColor: "text-emerald-600 dark:text-emerald-400",
    countColor: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300",
    indicator: "bg-emerald-500",
  },
};

const KanbanColumn = ({ status, tasks, onOpenTask, onDeleteTask }) => {
  const config = COLUMN_CONFIG[status];

  return (
    <div className={`rounded-2xl ${config.color} p-4 flex flex-col gap-3 min-h-[300px]`}>
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2.5 h-2.5 rounded-full ${config.indicator}`} />
        <h2 className={`text-sm font-bold uppercase tracking-wider ${config.headerColor}`}>
          {config.label}
        </h2>
        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${config.countColor}`}>
          {tasks.length}
        </span>
      </div>

      {/* Task Cards */}
      <AnimatePresence mode="popLayout">
        {tasks.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex items-center justify-center"
          >
            <p className="text-xs text-gray-400 dark:text-gray-600 italic text-center py-8">
              No tasks yet
            </p>
          </motion.div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onOpen={onOpenTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default KanbanColumn;
