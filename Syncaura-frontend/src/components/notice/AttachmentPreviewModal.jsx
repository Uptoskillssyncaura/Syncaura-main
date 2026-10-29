import { X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp"];
const PDF_EXT = ["pdf"];

export default function AttachmentPreviewModal({ fileName, fileUrl, onClose, onDownload }) {
  const ext = (fileName || "").split(".").pop()?.toLowerCase();
  const isImage = IMAGE_EXT.includes(ext);
  const isPdf = PDF_EXT.includes(ext);

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
            relative w-full max-w-3xl h-[85vh]
            rounded-2xl
            bg-[#f0f0f0] dark:bg-black
            p-4 shadow-2xl
            flex flex-col
          "
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-medium text-black dark:text-white truncate pr-4">
              {fileName}
            </h2>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onDownload}
                className="flex items-center gap-1 text-xs font-medium text-[#2461E6] dark:text-[#73FBFD] hover:underline btn-hover"
              >
                <Download size={16} />
                Download
              </button>
              <button
                onClick={onClose}
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white btn-hover"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 rounded-xl overflow-hidden bg-white dark:bg-[#1f1f1f] flex items-center justify-center">
            {isImage && (
              <img src={fileUrl} alt={fileName} className="max-w-full max-h-full object-contain" />
            )}
            {isPdf && (
              <iframe src={fileUrl} title={fileName} className="w-full h-full" />
            )}
            {!isImage && !isPdf && (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Preview isn't available for this file type.
                </p>
                <button
                  onClick={onDownload}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-[#73FBFD] dark:hover:bg-[#08e0e4] text-white dark:text-black text-sm font-medium px-4 py-2 rounded-full transition-colors btn-hover"
                >
                  <Download size={16} />
                  Download instead
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
