import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleAlert, CircleCheck, Clock, X, FileText, ExternalLink, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ComplaintSlider({
  dummyComplaints = [],
  idx,
  onClose,
  isAdminOrCoAdmin = false,
  onStatusChange,
}) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(
    dummyComplaints
      .map((item, i) => {
        if ((item.id || item._id) === idx) return i;
        else return 0;
      })
      .reduce((acc, curr) => acc + curr, 0),
  );
  const [direction, setDirection] = useState(0);

  const statusStyle = (status = "") => {
    const s = String(status).toLowerCase().replace(" ", "-");
    if (s === "open") return "bg-[#FFC2C2] text-[#C71212] border border-[#FFC2C2]/40";
    if (s === "in-progress") return "bg-[#FEF2C2] text-[#C05328] border border-[#FEF2C2]/40";
    if (s === "resolved") return "bg-[#D1FAE5] text-[#29CC39] border border-[#D1FAE5]/40";
    return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
  };

  const statusIcon = (status = "") => {
    const s = String(status).toLowerCase().replace(" ", "-");
    if (s === "open") return <CircleAlert className="size-3.5 text-[#C71212] fill-[#FFC2C2]" />;
    if (s === "in-progress") return <Clock className="size-3.5 text-[#C05328]" />;
    if (s === "resolved") return <CircleCheck className="size-3.5 text-[#29CC39] fill-[#D1FAE5]" />;
    return <CircleCheck className="size-3.5 text-gray-500" />;
  };

  const next = () => {
    if (index < dummyComplaints.length - 1) {
      setDirection(1);
      setIndex((p) => p + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setDirection(-1);
      setIndex((p) => p - 1);
    }
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const data = dummyComplaints[index] || {};
  const filerName =
    data.filer_name ||
    data.user_name ||
    data.userName ||
    data.name ||
    (data.user && (data.user.name || data.user.username)) ||
    "User";
  const filerEmail =
    data.filer_email ||
    data.user_email ||
    data.email ||
    data.userEmail ||
    (data.user && data.user.email) ||
    "—";
  const currentStatus = String(data.status || "open").toLowerCase().replace(" ", "-");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const getDocumentUrl = (url) => {
    if (!url || url === "#") return null;
    if (/^https?:\/\//i.test(url)) return url;
    const baseUrl = API_URL.replace(/\/api\/?$/, "");
    return `${baseUrl}/${url.replace(/^\/+/, "")}`;
  };

  return (
    <div className="relative z-50 h-screen bg-white dark:bg-black">
      {/* Header bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Complaint Details
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-colors"
        >
          <X className="size-6 text-gray-500 dark:text-gray-300" />
        </button>
      </div>

      <div className="h-[calc(100vh-140px)] overflow-y-auto px-6 py-6 pb-28 max-w-4xl mx-auto">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={data.id || index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col gap-6"
          >
            {/* Top Info Grid */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              {/* Filer details */}
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-[#73FBFD] flex items-center justify-center font-bold text-lg">
                  {filerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-semibold text-gray-400">Applicant:</span>
                    <span className="text-base font-bold text-gray-900 dark:text-white">
                      {filerName}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-blue-600 dark:text-[#73FBFD]">
                    {filerEmail}
                  </span>
                </div>
              </div>

              {/* ID & Date */}
              <div className="flex flex-col md:items-end gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-semibold uppercase">ID:</span>
                  <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">
                    {data.id || data._id}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Date:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {data.created_at
                      ? new Date(data.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Status & Category Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                  Category:
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-[#73FBFD] border border-blue-200 dark:border-blue-800">
                  {data.category || "General"}
                </span>
              </div>

              {/* Status Section */}
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                  Status:
                </span>
                {isAdminOrCoAdmin ? (
                  <select
                    value={currentStatus}
                    onChange={(e) => onStatusChange?.(data, e.target.value)}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl outline-none cursor-pointer shadow-xs ${statusStyle(
                      currentStatus
                    )}`}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                ) : (
                  <div
                    className={`flex items-center gap-1.5 justify-center py-1.5 rounded-xl px-4 text-xs font-bold ${statusStyle(
                      currentStatus
                    )}`}
                  >
                    {statusIcon(currentStatus)}
                    <span className="capitalize">{(data.status || "open").replace("-", " ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Subject & Description */}
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800">
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">Subject</span>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {data.title}
                </h1>
              </div>

              <div className="mt-2">
                <span className="text-xs uppercase font-semibold text-gray-400">Description</span>
                <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base leading-relaxed mt-1 whitespace-pre-wrap">
                  {data.description}
                </p>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Attached Documents & Files
              </h3>
              {data.attachments && data.attachments.length > 0 ? (
                <div className="flex flex-wrap items-center gap-3">
                  {data.attachments.map((attachment, i) => {
                    const url = typeof attachment === "string" ? attachment : attachment.file_url || attachment.url;
                    const name =
                      typeof attachment === "string"
                        ? attachment.split("/").pop()
                        : attachment.name ||
                          attachment.file_name ||
                          (typeof attachment.file_url === "string" ? attachment.file_url.split("/").pop() : "Document");
                    const fullUrl = getDocumentUrl(url);

                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fullUrl && window.open(fullUrl, "_blank", "noopener,noreferrer")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-gray-300 dark:border-gray-700"
                      >
                        <FileText className="size-4 text-blue-600 dark:text-[#73FBFD]" />
                        <span className="max-w-[200px] truncate">{name}</span>
                        <ExternalLink className="size-3.5 opacity-60 ml-1" />
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No attachments uploaded with this complaint.</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="fixed bottom-0 left-0 z-40 w-full bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-3 px-6">
          <div className="max-w-4xl mx-auto flex gap-4">
            <motion.button
              onClick={prev}
              disabled={index === 0}
              className={`flex-1 px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity ${
                index === 0 ? "cursor-not-allowed opacity-40 bg-gray-100 dark:bg-gray-800 text-gray-400" : "cursor-pointer bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300"
              }`}
            >
              Previous
            </motion.button>

            <motion.button
              onClick={next}
              disabled={index === dummyComplaints.length - 1}
              className={`flex-1 px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity ${
                index === dummyComplaints.length - 1 ? "cursor-not-allowed opacity-40 bg-gray-100 dark:bg-gray-800 text-gray-400" : "cursor-pointer bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              Next
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
