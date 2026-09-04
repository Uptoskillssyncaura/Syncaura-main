import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Paperclip, FileText, Trash2, Flag } from "lucide-react";

const PRIORITY_OPTIONS = [
  {
    value: "low",
    label: "Low",
    dot: "bg-emerald-500",
    activeClass:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    value: "medium",
    label: "Medium",
    dot: "bg-amber-500",
    activeClass:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    value: "high",
    label: "High",
    dot: "bg-red-500",
    activeClass: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  },
];
const MAX_FILE_SIZE_MB = 10;

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const CreateIssueModal = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium"); // default, optional
  const [files, setFiles] = useState([]); // [{ file, id, previewUrl }]
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    const valid = [];
    let hasOversized = false;

    selected.forEach((file) => {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        hasOversized = true;
        return;
      }
      valid.push({
        file,
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        previewUrl: URL.createObjectURL(file), // local blob url, no backend needed
      });
    });

    setErrors((prev) => ({
      ...prev,
      files: hasOversized
        ? `Some files exceed ${MAX_FILE_SIZE_MB}MB and were skipped`
        : undefined,
    }));

    setFiles((prev) => [...prev, ...valid]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl); // avoid memory leaks
      return prev.filter((f) => f.id !== id);
    });
  };

  const validate = () => {
    const next = {};
    if (!title.trim()) next.title = "Title is required";
    if (!description.trim()) next.description = "Description is required";
    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      id: `issue-${Date.now()}`, // local id until backend assigns real ones
      title: title.trim(),
      description: description.trim(),
      priority, // always "low" | "medium" | "high"
      files, // [{ file, id, previewUrl }]
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-lg bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#2d2f33] overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#2d2f33]">
          <h2 className="text-lg font-bold text-[#0A0A0A] dark:text-white">
            New Issue
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2f33] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of the issue"
              className={`w-full px-3 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#111214] text-[#0A0A0A] dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-[#73FBFD]/30 transition-all ${
                errors.title
                  ? "border-red-400"
                  : "border-gray-200 dark:border-[#2d2f33]"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail…"
              rows={4}
              className={`w-full px-3 py-2.5 text-sm rounded-xl border bg-white dark:bg-[#111214] text-[#0A0A0A] dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-[#73FBFD]/30 transition-all resize-none ${
                errors.description
                  ? "border-red-400"
                  : "border-gray-200 dark:border-[#2d2f33]"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Priority — optional, defaults to medium */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Flag className="w-3 h-3" />
              Priority
              <span className="normal-case font-normal text-gray-400 dark:text-gray-600">
                (optional)
              </span>
            </label>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`flex-1 text-center px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                    priority === opt.value
                      ? opt.activeClass
                      : "bg-gray-100 dark:bg-[#2d2f33] text-gray-400 dark:text-gray-500 hover:opacity-80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload — multiple, local only */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Attachments
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-[#2d2f33] text-sm text-gray-500 dark:text-gray-400 hover:border-blue-300 dark:hover:border-[#73FBFD]/40 hover:text-blue-500 dark:hover:text-[#73FBFD] transition-colors"
            >
              <Paperclip className="w-4 h-4" />
              Click to upload files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            {errors.files && (
              <p className="text-xs text-amber-500 mt-1.5">{errors.files}</p>
            )}

            {files.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#111214] border border-gray-100 dark:border-[#2d2f33]"
                  >
                    <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="flex-1 text-xs text-gray-700 dark:text-gray-300 truncate">
                      {f.file.name}
                    </span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                      {formatFileSize(f.file.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(f.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#2d2f33] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-[#2d2f33] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2d2f33] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-[#2457C5] dark:bg-[#73FBFD] text-white dark:text-black hover:bg-blue-700 dark:hover:bg-[#5af4f5] transition-colors"
          >
            Create Issue
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateIssueModal;
