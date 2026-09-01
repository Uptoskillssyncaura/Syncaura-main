import { motion } from "framer-motion";
import { Eye, Download, FileText, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../config/axios";
import AttachmentPreviewModal from "./AttachmentPreviewModal";

export default function NotificationRow({title, about, date, bgColor, docColor, id, attachments, onEdit, onDelete}) {
    const { t } = useTranslation();
    const user = useSelector((state) => state.auth.user);
    const canManage = user?.role === "admin" || user?.role === "co-admin";

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
  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full  rounded-xl shadow-sm px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center  sm:gap-4"
    >
      <div className="hidden xl:flex items-center  flex-1 ">
        <div className="flex-1/15  flex items-center justify-center">
          <div className={`p-2 rounded-lg ${bgColor} flex items-center justify-center`}>
            <FileText className={`${docColor} size-6`} />
          </div>
        </div>
        <div className="flex-9/15 gap-x-2 flex flex-col md:flex-row  items-center justify-start">
          <div className="flex-1/6 w-full flex items-center justify-start ">
            <h1 className="text-black dark:text-[#FFFFFF] text-sm font-medium uppercase">
              {title}
            </h1>
          </div>
          <div className="flex-5/6 w-full flex items-center justify-start">
            <p className="text-xl font-medium text-black dark:text-[#FFFFFF]">
             {about}
            </p>
          </div>
        </div>
        <div className=" flex-4/15 w-full flex items-center justify-center gap-2">
          {canManage && (
            <>
              <button
                type="button"
                onClick={() => onEdit?.()}
                title="Edit notice"
                className="flex items-center justify-center gap-1 border border-[#2461E6] dark:border-[#73FBFD] rounded-lg px-3 py-1 btn-hover"
              >
                <Pencil className="text-[#2461E6] dark:text-[#73FBFD] size-4" />
                <span className="text-xs font-medium text-[#2461E6] dark:text-[#73FBFD]">Edit</span>
              </button>
              <button
                type="button"
                onClick={handleDelete}
                title="Delete notice"
                className="flex items-center justify-center gap-1 border border-red-500 rounded-lg px-3 py-1 btn-hover"
              >
                <Trash2 className="text-red-500 size-4" />
                <span className="text-xs font-medium text-red-500">Delete</span>
              </button>
            </>
          )}
        </div>
        <div className=" flex-2/15 w-full flex items-center justify-center gap-2">
          <div className="flex-2/5 w-full flex items-center justify-end gap-1 ">
            <button
              type="button"
              onClick={handleView}
              disabled={!hasAttachment}
              title={hasAttachment ? undefined : "No attachment available"}
              className={`flex items-center justify-center bg-[#E2EBFF] dark:bg-[#1C3939] border border-[#2461E6] dark:border-[#1C3939] gap-1 px-7 py-1 btn-hover ${hasAttachment ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            >
              <Eye className="text-[#2461E6] dark:text-[#73FBFD]  size-5" />
              <p className="text-xs font-medium text-[#2461E6] dark:text-[#73FBFD]">{t("view", "View")}</p>
            </button>
          </div>
          <div className="flex-3/5 w-full flex items-center justify-end">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!hasAttachment}
              title={hasAttachment ? undefined : "No attachment available"}
              className={`flex items-center justify-center border border-[#989696] gap-1 px-5 py-1 btn-hover ${hasAttachment ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            >
              <Download className="size-5 text-[#989696] " />
              <p className=" text-xs text-[#989696] font-medium">{t("download", "Download")}</p>
            </button>
          </div>
        </div>
      </div>
      <div className="flex xl:hidden items-center flex-1" >
        
     
      <div className="flex  items-center gap-3 flex-1">
        <div className={`p-2 rounded-lg ${bgColor} flex items-center justify-center`}>
          <FileText className={`${docColor} size-6`}  />
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-white  uppercase">
            {title}
          </span>
          <span className="text-base sm:text-base font-medium text-gray-800 dark:text-white">
            {about}
          </span>
        </div>
      </div>

     
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-white">
        {canManage && (
          <>
            <button
              type="button"
              onClick={() => onEdit?.()}
              title="Edit notice"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#2461E6] dark:border-[#73FBFD] text-[#2461E6] dark:text-[#73FBFD] transition btn-hover"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              title="Delete notice"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-500 text-red-500 transition btn-hover"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={handleView}
          disabled={!hasAttachment}
          title={hasAttachment ? undefined : "No attachment available"}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-[#1C3939] text-blue-600 dark:text-[#73FBFD] transition btn-hover ${hasAttachment ? "" : "opacity-50 cursor-not-allowed"}`}
        >
          <Eye size={16} />
          <span className="hidden sm:inline ">{t("view", "View")}</span>
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!hasAttachment}
          title={hasAttachment ? undefined : "No attachment available"}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition btn-hover ${hasAttachment ? "" : "opacity-50 cursor-not-allowed"}`}
        >
          <Download size={16} />
          <span className="hidden sm:inline">{t("download", "Download")}</span>
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
