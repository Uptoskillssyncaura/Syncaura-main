import { motion } from "framer-motion";
import {
  Check,
  CircleAlert,
  EllipsisIcon,
  MoreHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";

const statusStyles = {
  "In Progress": "bg-blue-100 text-blue-600 dark:bg-[#1D283A] dark:text-blue-400 dark:border dark:border-blue-900/50",
  "To Do": "bg-yellow-100 text-yellow-700 dark:bg-[#2D2615] dark:text-yellow-500 dark:border dark:border-yellow-900/50",
  Blocked: "bg-red-100 text-red-600 dark:bg-[#2D161B] dark:text-red-500 dark:border dark:border-red-900/50",
  Done: "bg-green-100 text-green-600 dark:bg-[#142921] dark:text-green-500 dark:border dark:border-green-900/50",
};

const priorityStyles = {
  HIGH: "bg-red-100 text-red-600 dark:bg-[#2D161B] dark:text-red-500 dark:border dark:border-red-900/50",
  MEDIUM: "bg-orange-100 text-orange-600 dark:bg-[#2D2015] dark:text-orange-500 dark:border dark:border-orange-900/50",
  LOW: "bg-gray-100 text-gray-600 dark:bg-[#1E252B] dark:text-gray-400 dark:border dark:border-gray-700",
};

const statusIcon = {
  "In Progress": <EllipsisIcon className="size-3" />,
  "To Do": <div className="size-2 rounded-full border-2 border-current" />,
  Blocked: <CircleAlert className="size-3" />,
  Done: <Check className="size-3" />,
};

const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "2-digit" });

// Custom Checkbox Styles
const checkboxClass = `
  w-5 h-5 rounded border cursor-pointer appearance-none transition-all
  bg-white border-gray-300 checked:bg-green-600 checked:border-green-600
  dark:bg-[#1c1d1f] dark:border-[#3d3f41] 
  dark:checked:bg-green-600 dark:checked:border-green-600
  checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCA2TDkgMTdsLTUtNSIvPjwvc3ZnPg==')] 
  bg-center bg-no-repeat bg-[length:14px_14px]
`;

export default function TasksTable({ tasks = [], loading = false, error = null }) {
  const [page] = useState(1);
  const perPage = 4;
  const rows = useMemo(() => tasks.slice((page - 1) * perPage, page * perPage), [page, tasks]);

  return (
    <div className="w-full overflow-x-auto rounded-xl bg-white dark:bg-[#1E1E1E] shadow border border-gray-200 dark:border-[#2D2F31]">
      <h2 className="px-6 py-5 text-2xl font-bold text-gray-800 dark:text-white">
        Tasks
      </h2>

      <table className="min-w-[1000px] w-full text-sm">
        <thead className="bg-gray-50 dark:bg-[#1c1d1f] border-t border-b border-gray-200 dark:border-[#2D2F31]">
          <tr className="text-left text-gray-500 dark:text-[#6E717F] uppercase text-[11px] tracking-wider">
            {/* Checkbox removed from this header cell */}
            <th className="p-4 w-10"></th>
            <th className="py-3">Task Name</th>
            <th className="py-3">Project</th>
            <th className="py-3">Status</th>
            <th className="py-3">Priority</th>
            <th className="py-3">Due Date</th>
            <th className="py-3">Sprint</th>
            <th className="text-center py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-[#2D2F31]">
          {loading && <tr><td colSpan="8" className="p-6 text-center text-gray-500">Loading tasks...</td></tr>}
          {!loading && error && <tr><td colSpan="8" className="p-6 text-center text-red-500">{error}</td></tr>}
          {!loading && !error && rows.length === 0 && <tr><td colSpan="8" className="p-6 text-center text-gray-500">No tasks found.</td></tr>}
          {!loading && !error && rows.map((task) => {
            const dueDate = task.deadline || task.dueDate;
            const status = task.status === 'IN_PROGRESS' ? 'In Progress' : task.status === 'TODO' ? 'To Do' : task.status === 'DONE' ? 'Done' : task.status;
            const isLate = dueDate && new Date(dueDate) < new Date() && status !== 'Done';

            return (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 dark:hover:bg-[#1c1d1f] transition-colors"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    defaultChecked={status === "Done"}
                    className={checkboxClass}
                  />
                </td>

                <td className="font-medium text-gray-800 dark:text-gray-200">{task.title}</td>
                <td className="text-gray-600 dark:text-[#9BA1B0]">{task.project_name || task.project_id || 'Unassigned'}</td>

                <td>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase ${statusStyles[status] || statusStyles["To Do"]}`}>
                    {statusIcon[status] || statusIcon["To Do"]}
                    <span>{status}</span>
                  </div>
                </td>

                <td>
                  <span className={`px-3 py-0.5 rounded border text-[10px] font-bold ${priorityStyles[task.priority] || priorityStyles.LOW}`}>
                    {task.priority || 'LOW'}
                  </span>
                </td>

                <td className={`flex items-center gap-2 py-4 ${isLate ? "text-red-500 font-medium" : "text-gray-400"}`}>
                  {isLate && <CircleAlert size={14} className="fill-red-500 text-white dark:text-[#141517]" />}
                  {dueDate ? formatDate(dueDate) : 'No deadline'}
                </td>

                <td className="text-gray-600 dark:text-[#9BA1B0]">{task.sprint || 'Not assigned'}</td>

                <td className="text-center">
                  <MoreHorizontal className="mx-auto text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors" />
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-500 dark:text-[#6E717F] border-t border-gray-200 dark:border-[#2D2F31]">
        <span>Showing {rows.length ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, tasks.length)} of {tasks.length} tasks</span>

        <div className="flex gap-2">
          <button className="px-4 py-1.5 rounded-md border border-gray-300 dark:border-[#2D2F31] bg-white dark:bg-[#1c1d1f] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#252629] transition-colors btn-hover">
            Previous
          </button>
          <button className="px-4 py-1.5 rounded-md border border-gray-300 dark:border-[#2D2F31] bg-white dark:bg-[#1c1d1f] text-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252629] transition-colors btn-hover">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}