import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, AlertTriangle, Paperclip, Loader2, CheckCircle2, Flag } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../config/axios";

const SEVERITY_CONFIG = {
  low: { label: "Low", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  medium: { label: "Medium", className: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  high: { label: "High", className: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800" },
};

const CATEGORY_OPTIONS = [
  { value: "TASK", label: "Task Issue / Blocker" },
  { value: "TECHNICAL", label: "Technical / Bug" },
  { value: "WORKPLACE", label: "Workplace / Resource Requirement" },
  { value: "OTHER", label: "Other" },
];

const RaiseTaskIssueModal = ({ task, onClose, onSuccess }) => {
  const [title, setTitle] = useState(`Issue: ${task?.title || "Task"}`);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("TASK");
  const [severity, setSeverity] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Issue title is required";
    if (!description.trim()) newErrors.description = "Please describe the issue in detail";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      if (files.length > 0) {
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("category", category);
        formData.append("severity", severity);
        formData.append("priority", severity === "high" ? "high" : "normal");
        formData.append("taskId", task?.id || "");
        formData.append("task_id", task?.id || "");
        formData.append("isAnonymous", "false");

        files.forEach((file) => {
          formData.append("attachments", file);
        });

        await api.post("/complaints", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/complaints", {
          title: title.trim(),
          description: description.trim(),
          category,
          severity,
          priority: severity === "high" ? "high" : "normal",
          taskId: task?.id || "",
          task_id: task?.id || "",
          isAnonymous: false,
        });
      }

      toast.success("Issue raised successfully! Admin and Co-Admin have been notified.");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to raise issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#2d2f33] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#2d2f33]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0A0A0A] dark:text-white">
                Raise Issue with Task
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This issue will be sent directly to Admin & Co-Admin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2f33] transition-colors btn-hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Task Context Card */}
          <div className="bg-gray-50 dark:bg-[#24262b] border border-gray-200 dark:border-[#2f3136] rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Associated Task
            </span>
            <p className="text-sm font-semibold text-[#0A0A0A] dark:text-white truncate">
              {task?.title || "Untitled Task"}
            </p>
            {(task?.project_name || task?.project_title) && (
              <span className="text-xs text-blue-600 dark:text-[#73FBFD]">
                📁 Project: {task.project_name || task.project_title}
              </span>
            )}
          </div>

          {/* Issue Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Issue Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              placeholder="e.g. Blocked by API error / need approval"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                errors.title
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 dark:border-[#2d2f33] focus:ring-blue-300 dark:focus:ring-[#73FBFD]/30"
              } bg-white dark:bg-[#111214] text-[#0A0A0A] dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 transition-all`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Category & Severity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#2d2f33] bg-white dark:bg-[#111214] text-[#0A0A0A] dark:text-white outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-[#73FBFD]/30 transition-all cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Severity / Urgency
              </label>
              <div className="flex gap-1.5">
                {["low", "medium", "high"].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl capitalize border transition-all btn-hover ${
                      severity === sev
                        ? SEVERITY_CONFIG[sev].className + " ring-2 ring-offset-1 ring-current font-bold"
                        : "bg-gray-50 dark:bg-[#2d2f33] text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-100"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder="Describe what went wrong, what is blocking you, or what assistance is needed from Admin/Co-Admin..."
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                errors.description
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-200 dark:border-[#2d2f33] focus:ring-blue-300 dark:focus:ring-[#73FBFD]/30"
              } bg-white dark:bg-[#111214] text-[#0A0A0A] dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 transition-all resize-none`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Attachments (Optional)
            </label>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#2d2f33] hover:bg-gray-100 dark:hover:bg-[#383a40] border border-gray-200 dark:border-[#383a40] rounded-xl transition-colors btn-hover"
            >
              <Paperclip className="w-3.5 h-3.5" />
              Attach Screenshot or Log File
            </button>

            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {files.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800/40"
                  >
                    <span className="truncate max-w-[140px]">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-[#2d2f33]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2f33] rounded-xl transition-colors btn-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 dark:bg-red-600 dark:hover:bg-red-500 rounded-xl transition-colors shadow-sm disabled:opacity-50 btn-hover"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Issue
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RaiseTaskIssueModal;
