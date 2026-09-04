import { motion } from "framer-motion";
import { Eye, Download, FileText, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../config/axios";
import AttachmentPreviewModal from "./AttachmentPreviewModal";

export default function NotificationRow({
  title,
  about,
  category,
  creator,
  creatorId,
  date,
  bgColor,
  docColor,
  id,
  attachments,
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const storedUser = (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const currentUser = user || storedUser;
  const userRole = String(currentUser?.role || "").trim().toLowerCase();
  const userId = currentUser?.id || currentUser?._id;

  const isAdmin = userRole === "admin";
  const isCoAdmin = userRole === "co-admin" || userRole === "coadmin";

  // Strict RBAC:
  // - Regular 'user' or 'employee' can NEVER manage/edit/delete.
  // - 'admin' can manage all.
  // - 'co-admin' can ONLY manage notices published by themselves.
  let canManage = false;
  if (isAdmin) {
    canManage = true;
  } else if (isCoAdmin) {
    const isIdMatch = Boolean(creatorId && userId && String(creatorId) === String(userId));
    const isNameMatch = Boolean(creator && currentUser?.name && creator.trim().toLowerCase() === currentUser.name.trim().toLowerCase());
    const isEmailMatch = Boolean(creator && currentUser?.email && creator.trim().toLowerCase() === currentUser.email.trim().toLowerCase());
    canManage = isIdMatch || isNameMatch || isEmailMatch;
  }

  const attachment = attachments && attachments.length > 0 ? attachments[0] : null;
  const fileName = attachment ? (attachment.fileName || attachment.file_name) : null;

  function getAttachmentUrl(action) {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    const base = (api.defaults.baseURL || "/api").replace(/\/$/, "");
    return `${base}/notices/${id}/attachments/${encodeURIComponent(fileName)}/${action}${token ? `?token=${encodeURIComponent(token)}` : ""}`;
  }

  const [showPreview, setShowPreview] = useState(false);

  function handleView() {
    if (!fileName || id === undefined || id === null) return;
    setShowPreview(true);
  }

  function handleDownload() {
    if (!fileName || id === undefined || id === null) return;
    const link = document.createElement("a");
    link.href = getAttachmentUrl("download");
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const hasAttachment = Boolean(fileName) && id !== undefined && id !== null;

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this notice? This cannot be undone.")) {
      onDelete?.(id);
    }
  }

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full bg-white dark:bg-[#1c1d20] border border-gray-100 dark:border-[#2d2f33] rounded-2xl shadow-xs px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:gap-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
      >
        {/* Desktop View */}
        <div className="hidden xl:flex items-center flex-1 gap-4">
          <div className="flex items-center justify-center flex-shrink-0">
            <div className={`p-2.5 rounded-xl ${bgColor} flex items-center justify-center`}>
              <FileText className={`${docColor} size-6`} />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-[#73FBFD] border border-blue-200 dark:border-blue-900/50">
                {category || "GENERAL"}
              </span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {title}
              </span>
            </div>
            <p className="text-base font-semibold text-[#0A0A0A] dark:text-white truncate">
              {about}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <span>Published by <strong className="text-gray-600 dark:text-gray-300 font-medium">{creator || "Admin"}</strong></span>
              {formattedDate && <span>• {formattedDate}</span>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 flex-shrink-0">
            {canManage && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit?.()}
                  title="Edit notice"
                  className="flex items-center justify-center gap-1 border border-[#2461E6] dark:border-[#73FBFD] rounded-lg px-3 py-1.5 btn-hover hover:bg-blue-50 dark:hover:bg-[#73FBFD]/10"
                >
                  <Pencil className="text-[#2461E6] dark:text-[#73FBFD] size-3.5" />
                  <span className="text-xs font-medium text-[#2461E6] dark:text-[#73FBFD]">Edit</span>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  title="Delete notice"
                  className="flex items-center justify-center gap-1 border border-red-500 rounded-lg px-3 py-1.5 btn-hover hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="text-red-500 size-3.5" />
                  <span className="text-xs font-medium text-red-500">Delete</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleView}
              disabled={!hasAttachment}
              title={hasAttachment ? undefined : "No attachment available"}
              className={`flex items-center justify-center bg-[#E2EBFF] dark:bg-[#1C3939] border border-[#2461E6] dark:border-[#1C3939] gap-1 px-4 py-1.5 rounded-lg btn-hover ${
                hasAttachment ? "cursor-pointer hover:opacity-90" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <Eye className="text-[#2461E6] dark:text-[#73FBFD] size-4" />
              <p className="text-xs font-medium text-[#2461E6] dark:text-[#73FBFD]">{t("view", "View")}</p>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!hasAttachment}
              title={hasAttachment ? undefined : "No attachment available"}
              className={`flex items-center justify-center border border-gray-300 dark:border-gray-700 gap-1 px-3 py-1.5 rounded-lg btn-hover ${
                hasAttachment ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <Download className="size-4 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t("download", "Download")}</p>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet View */}
        <div className="flex xl:hidden flex-col gap-3 w-full">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
              <FileText className={`${docColor} size-5`} />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-[#73FBFD] border border-blue-200 dark:border-blue-900/50">
                  {category || "GENERAL"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {title}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {about}
              </span>
              <span className="text-[11px] text-gray-400 mt-0.5">
                By {creator || "Admin"} • {formattedDate}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 text-xs">
            {canManage && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit?.()}
                  title="Edit notice"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#2461E6] dark:border-[#73FBFD] text-[#2461E6] dark:text-[#73FBFD] transition btn-hover"
                >
                  <Pencil size={14} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  title="Delete notice"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-500 text-red-500 transition btn-hover"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleView}
              disabled={!hasAttachment}
              title={hasAttachment ? undefined : "No attachment available"}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-[#1C3939] text-blue-600 dark:text-[#73FBFD] transition btn-hover ${
                hasAttachment ? "" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <Eye size={14} />
              <span>{t("view", "View")}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!hasAttachment}
              title={hasAttachment ? undefined : "No attachment available"}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition btn-hover ${
                hasAttachment ? "" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <Download size={14} />
              <span>{t("download", "Download")}</span>
            </button>
          </div>
        </div>
      </motion.div>
    {showPreview && (
      <AttachmentPreviewModal
        fileName={fileName}
        fileUrl={getAttachmentUrl("view")}
        onClose={() => setShowPreview(false)}
        onDownload={handleDownload}
      />
    )}
    </>
  );
}
