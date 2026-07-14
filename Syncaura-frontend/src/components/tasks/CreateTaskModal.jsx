import { useState } from "react";
import { motion } from "framer-motion";
import { X, Flag, Calendar, User, AlignLeft } from "lucide-react";

const PRIORITIES = ["low", "medium", "high"];
const PRIORITY_COLORS = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const CreateTaskModal = ({ onClose, onSubmit, isLoading }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
    assignedTo: "",
    status: "TODO",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const payload = { ...form };
    if (!payload.deadline) delete payload.deadline;
    if (!payload.assignedTo) delete payload.assignedTo;
    onSubmit(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="modal-animate w-full max-w-md bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#2d2f33] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#2d2f33]">
          <h2 className="text-lg font-bold text-[#0A0A0A] dark:text-white">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2f33] transition-colors btn-hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Task Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Design landing page"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                errors.title
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 dark:border-[#2d2f33] focus:ring-blue-300 dark:focus:ring-[#73FBFD]/30"
              } bg-white dark:bg-[#111214] text-[#0A0A0A] dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 transition-all`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Add details about this task…"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#2d2f33] bg-white dark:bg-[#111214] text-[#0A0A0A] dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-[#73FBFD]/30 transition-all resize-none"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Priority
              </label>
              <div className="flex gap-1.5">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                    className={`btn-hover flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize ${
                      form.priority === p
                        ? PRIORITY_COLORS[p] + "ring-2 ring-offset-1 ring-current"
                        : "bg-gray-100 dark:bg-[#2d2f33] text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Initial Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-[#2d2f33] bg-white dark:bg-[#111214] text-[#0A0A0A] dark:text-white outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-[#73FBFD]/30 transition-all"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>

          {/* Deadline + Assigned To */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="date-input w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#2d2f33] bg-white dark:bg-[#111214] text-[#0A0A0A] dark:text-white outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-[#73FBFD]/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Assigned To
              </label>
              <input
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                placeholder="Name or email"
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#2d2f33] bg-white dark:bg-[#111214] text-[#0A0A0A] dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-[#73FBFD]/30 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-[#2d2f33] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2d2f33] transition-colors btn-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-[#2457C5] dark:bg-[#73FBFD] text-white dark:text-black hover:bg-blue-700 dark:hover:bg-[#5af4f5] transition-colors disabled:opacity-60 disabled:cursor-not-allowed btn-hover"
            >
              {isLoading ? "Creating…" : "Create Task"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateTaskModal;
