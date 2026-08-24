import { X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function DocumentModal({ onClose, addReport }) {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [isDragging, setIsDragging] = useState(false);

  const files = watch("attachments");
  const fileRef = useRef(null);

  const onSubmit = (data) => {
    // Description baseline name ban jayegi aur type mapping bilkul exact rahegi
    const formattedData = {
      id: Date.now(),
      name: data.description || "Untitled Document",
      type: (data.type || "PDF").toUpperCase(),
      version: "v1.0",
      lastModified: new Date().toISOString().split("T")[0],
      status: "Approved",
    };

    if (typeof addReport === "function") {
      addReport(formattedData);
    }

    onClose();
  };

  const handleFileClick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e) => {
    setValue("attachments", e.target.files, { shouldValidate: true });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length) {
      setValue("attachments", droppedFiles, { shouldValidate: true });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          onClick={onClose}
          className="absolute inset-0 bg-black/40 dark:bg-white/10 backdrop-blur-xs"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="
            relative w-full max-w-md sm:max-w-lg
            rounded-2xl
            bg-[#f0f0f0] dark:bg-[#18181b]
            p-6 shadow-2xl
          "
        >
          {/* Close */}
          <button
            onClick={onClose}
            type="button"
            className="absolute right-4 top-4 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            <X size={18} />
          </button>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              New Documents And Reports
            </h2>

            {/* Type */}
            <div>
              <label className="text-sm font-medium text-black dark:text-white">
                Type
              </label>
              <input
                {...register("type", { required: true })}
                placeholder="Notice issued on"
                className="
                  mt-1 w-full rounded-full px-4 py-2 text-sm outline-none
                  bg-white dark:bg-[#1f1f1f]
                  text-black dark:text-white 
                  border border-gray-300 dark:border-gray-600
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40
                  transition-all
                "
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-black dark:text-white">
                Description
              </label>
              <textarea
                {...register("description", { required: true })}
                rows={3}
                placeholder="Describe the issue in detail..."
                className="
                  mt-1 w-full rounded-xl px-4 py-2 text-sm resize-none outline-none
                  bg-white dark:bg-[#1f1f1f]
                  text-black dark:text-white
                  border border-gray-300 dark:border-gray-600
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40
                  transition-all
                "
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="text-sm font-medium text-black dark:text-white">
                Attachments
              </label>

              <motion.div
                onClick={handleFileClick}
                whileHover={{ scale: 1.01 }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                  mt-1 h-24 rounded-xl border-2 border-dashed
                  ${
                    isDragging
                      ? "border-blue-500 bg-blue-50/20"
                      : "border-gray-300 dark:border-gray-600"
                  }
                  flex flex-col items-center justify-center gap-1
                  text-sm text-gray-600 dark:text-gray-400
                  cursor-pointer
                  transition-colors
                `}
              >
                <Upload size={18} />
                <span>Click to upload or drag & drop</span>
              </motion.div>

              <input
                type="file"
                multiple
                hidden
                ref={fileRef}
                onChange={handleFileChange}
              />

              {files?.length > 0 && (
                <div className="mt-2 max-h-20 overflow-y-auto text-xs text-gray-600 dark:text-gray-400 scrollbar-hide">
                  {Array.from(files).map((file, idx) => (
                    <div key={idx} className="truncate">
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="
                  px-6 py-2.5
                  bg-blue-600 hover:bg-blue-700
                  dark:bg-[#73FBFD] dark:hover:bg-[#08e0e4] dark:text-black
                  text-white text-[13px] font-medium rounded-full
                  transition-colors cursor-pointer
                "
              >
                Submit Report
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}