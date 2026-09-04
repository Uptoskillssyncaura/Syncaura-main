import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download, ExternalLink, Calendar, Layers, CheckCircle2, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ViewDocumentModal({ document, onClose }) {
  const { t } = useTranslation();

  if (!document) return null;

  const {
    title = "Untitled Document",
    name,
    type = "DOCUMENT",
    category = "GENERAL",
    content,
    description,
    status = "Active",
    created_at,
    updated_at,
    updatedAt,
    versions = [],
    attachments = [],
    file_url,
    file_name,
  } = document;

  const docTitle = title || name || "Untitled Document";
  const docDescription = content || description || "No additional description provided.";
  const docDate = updated_at || updatedAt || created_at || new Date().toISOString();
  const docVersion = versions?.length ? `v${versions.length}` : "v1.0";

  const normalizedAttachments = Array.isArray(attachments) && attachments.length > 0
    ? attachments.map((att) => {
        if (typeof att === "string") {
          return { name: att.split("/").pop() || "Attached File", url: att };
        }
        return {
          name: att.name || att.file_name || att.original_name || (typeof att.url === "string" ? att.url.split("/").pop() : "Attached File"),
          url: att.url || att.file_url || "#",
          size: att.size,
          type: att.type,
        };
      })
    : file_url
    ? [{ name: file_name || (typeof file_url === "string" ? file_url.split("/").pop() : "Attached File"), url: file_url }]
    : [];

  const formatFileSize = (bytes) => {
    if (!bytes || typeof bytes !== "number") return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleOpenFile = (url, fileName) => {
    if (!url || url === "#") return;
    
    // If it's a data url or blob url
    if (url.startsWith("data:") || url.startsWith("blob:")) {
      const newWin = window.open("");
      if (newWin) {
        newWin.document.write(
          `<!DOCTYPE html><html><head><title>${fileName || "Document Preview"}</title><style>body{margin:0;background:#1e1e1e;display:flex;justify-content:center;align-items:center;height:100vh;overflow:hidden;}iframe,img{max-width:100%;max-height:100%;border:none;}</style></head><body>`
        );
        if (url.startsWith("data:image/") || url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg")) {
          newWin.document.write(`<img src="${url}" alt="Preview" />`);
        } else {
          newWin.document.write(`<iframe src="${url}" style="width:100%;height:100%;border:none;"></iframe>`);
        }
        newWin.document.write(`</body></html>`);
        newWin.document.close();
        return;
      }
    }

    // Direct window open fallback
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadFile = (url, fileName) => {
    if (!url || url === "#") return;
    const a = window.document.createElement("a");
    a.href = url;
    a.download = fileName || "downloaded_document";
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.92, y: 25, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 25, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="
            relative z-10 w-full max-w-lg sm:max-w-xl
            rounded-2xl
            bg-white dark:bg-[#18191B]
            border border-gray-200 dark:border-gray-800
            p-6 shadow-2xl
            max-h-[90vh] flex flex-col my-auto
          "
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-[#73FBFD]/10 text-blue-600 dark:text-[#73FBFD]">
                <FileText className="size-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  {docTitle}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-[#73FBFD] uppercase">
                    {category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {type}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {/* Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 dark:bg-[#202124] p-3 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                  <Calendar className="size-3" /> Date
                </span>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                  {new Date(docDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                  <Layers className="size-3" /> Version
                </span>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                  {docVersion}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Status
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {status}
                </span>
              </div>
            </div>

            {/* Description / Content */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Description / Details
              </h3>
              <div className="bg-gray-50 dark:bg-[#202124] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {docDescription}
              </div>
            </div>

            {/* Attached Documents / Files */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Attached Files ({normalizedAttachments.length})
              </h3>

              {normalizedAttachments.length > 0 ? (
                <div className="space-y-2">
                  {normalizedAttachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-[#202124] hover:border-blue-300 dark:hover:border-blue-600 transition"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <FileText className="size-5 text-blue-600 dark:text-[#73FBFD] flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-[180px] sm:max-w-[240px]">
                            {file.name}
                          </p>
                          {file.size && (
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                              {formatFileSize(file.size)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {file.url && file.url !== "#" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenFile(file.url, file.name)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 dark:bg-[#73FBFD] text-white dark:text-black hover:opacity-90 transition-opacity cursor-pointer"
                              title="Open & Preview Document"
                            >
                              <Eye className="size-3.5" />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadFile(file.url, file.name)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-[#73FBFD] hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                              title="Download File"
                            >
                              <Download className="size-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic bg-gray-50 dark:bg-[#202124] p-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                  No direct file attachment uploaded with this document.
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
