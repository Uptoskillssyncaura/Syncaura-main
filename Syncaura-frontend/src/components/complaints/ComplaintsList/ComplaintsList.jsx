import {
  CircleAlert,
  Clock,
  CircleCheck,
  Eye,
  FileText,
  ExternalLink,
} from "lucide-react";
import { FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function ComplaintsList({
  COMPLAINTS = [],
  activeId,
  setActiveId,
  statusStyle,
  statusIcon,
  isAdminOrCoAdmin = false,
  onStatusChange,
}) {
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const getDocumentUrl = (url) => {
    if (!url || url === "#") return null;
    if (/^https?:\/\//i.test(url)) return url;
    const baseUrl = API_URL.replace(/\/api\/?$/, "");
    return `${baseUrl}/${url.replace(/^\/+/, "")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const mobileStatusStyle = (status) => {
    const s = String(status || "").toLowerCase().replace(" ", "-");
    if (s === "open") return "bg-[#FFC2C2] dark:bg-[#3D2D2D] text-[#C71212]";
    if (s === "in-progress") return "bg-[#FEF2C2] dark:bg-[#3E3A29] text-[#C05328]";
    if (s === "resolved") return "bg-[#D1FAE5] dark:bg-[#1F402F] text-[#29CC39]";
    return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
  };

  const mobileStatusIcon = (status) => {
    const s = String(status || "").toLowerCase().replace(" ", "-");
    if (s === "open") return <CircleAlert className="size-4 fill-[#FFC2C2] text-[#C71212] dark:fill-[#3D2D2D]" />;
    if (s === "in-progress") return <Clock className="size-4 text-[#C05328]" />;
    if (s === "resolved") return <CircleCheck className="size-4 fill-[#D1FAE5] text-[#29CC39] dark:fill-[#1F402F]" />;
    return <CircleCheck className="size-4 text-gray-400" />;
  };

  const getDocumentInfo = (item) => {
    const attachment =
      (Array.isArray(item.attachments) && item.attachments.length > 0 && item.attachments[0]) ||
      (Array.isArray(item.documents) && item.documents.length > 0 && item.documents[0]) ||
      item.document ||
      item.file_url ||
      item.file;

    if (!attachment) return null;

    if (typeof attachment === "string") {
      const name = attachment.split("/").pop() || "Document";
      return { url: attachment, name, count: 1 };
    }

    const url = attachment.file_url || attachment.url || "#";
    const name =
      attachment.file_name ||
      attachment.name ||
      attachment.original_name ||
      (typeof url === "string" ? url.split("/").pop() : "Document");
    const count =
      Array.isArray(item.attachments) && item.attachments.length > 1
        ? item.attachments.length
        : Array.isArray(item.documents) && item.documents.length > 1
          ? item.documents.length
          : 1;

    return { url, name, count };
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  };

  if (!COMPLAINTS || COMPLAINTS.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center text-gray-500 dark:text-gray-400">
        <p className="text-base font-medium">No complaints found.</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          When complaints are filed, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex flex-col gap-1 h-[calc(100vh-180px)]">
        <div className="grid grid-cols-12 place-items-center px-6 xl:px-12 py-4 border border-[#8a858560] dark:border-[#575757] gap-x-3 sticky top-0 bg-white dark:bg-[#1E1E1E] transition-colors duration-200 z-10 shadow-xs">
          <div className="text-xs xl:text-sm font-semibold uppercase col-span-2 text-left w-full text-gray-700 dark:text-gray-200">
            Filer
          </div>
          <div className="text-xs xl:text-sm font-semibold uppercase col-span-2 text-center w-full text-gray-700 dark:text-gray-200">
            Complaint ID
          </div>
          <div className="text-xs xl:text-sm font-semibold uppercase col-span-3 text-left w-full text-gray-700 dark:text-gray-200">
            Subject & Category
          </div>
          <div className="text-xs xl:text-sm font-semibold uppercase col-span-1 text-center w-full text-gray-700 dark:text-gray-200">
            Document
          </div>
          <div className="text-xs xl:text-sm font-semibold uppercase col-span-1 text-center w-full text-gray-700 dark:text-gray-200">
            Date
          </div>
          <div className="text-xs xl:text-sm font-semibold uppercase col-span-2 text-center w-full text-gray-700 dark:text-gray-200">
            Status
          </div>
          <div className="text-xs xl:text-sm font-semibold uppercase col-span-1 text-center w-full text-gray-700 dark:text-gray-200">
            Actions
          </div>
        </div>

        <motion.div
          className="flex flex-col overflow-y-auto no-scrollbar"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={COMPLAINTS.length}
        >
          {COMPLAINTS.map((item) => {
            const id = item.id || item._id;
            const { title, status = "open", category, created_at } = item;
            const docInfo = getDocumentInfo(item);
            const filerName =
              item.filer_name ||
              item.user_name ||
              item.userName ||
              item.name ||
              (item.user && (item.user.name || item.user.username)) ||
              "User";
            const filerEmail =
              item.filer_email ||
              item.user_email ||
              item.email ||
              item.userEmail ||
              (item.user && item.user.email) ||
              "—";
            const normalizedStatus = String(status).toLowerCase().replace(" ", "-");

            return (
              <motion.div
                variants={itemVariants}
                onClick={() => setActiveId(id)}
                key={id}
                className={`relative grid py-4 grid-cols-12 px-6 xl:px-12 gap-x-3 place-items-center border-b border-gray-100 dark:border-gray-800 transition-all duration-200 cursor-pointer ${
                  activeId === id
                    ? "bg-[#E2EBFF] dark:bg-[#1C3939]"
                    : "hover:bg-gray-50 dark:hover:bg-gray-900/50"
                }`}
              >
                <span
                  className={`absolute left-0 top-0 h-full w-1 bg-blue-500 dark:bg-[#73FBFD] transition-transform duration-200 ${
                    activeId === id ? "scale-y-100" : "scale-y-0"
                  }`}
                />

                {/* 1. Filer: Name & Email */}
                <div className="flex flex-col items-start justify-center w-full col-span-2 text-left">
                  <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-full">
                    {filerName}
                  </span>
                  <span
                    className="text-xs text-blue-600 dark:text-[#73FBFD] font-medium truncate max-w-full"
                    title={filerEmail}
                  >
                    {filerEmail}
                  </span>
                </div>

                {/* 2. Complaint ID */}
                <div className="text-xs flex items-center justify-center w-full font-mono text-gray-600 dark:text-gray-400 col-span-2 truncate">
                  {id ? (id.length > 12 ? `${id.slice(0, 8)}...` : id) : "—"}
                </div>

                {/* 3. Subject & Category */}
                <div className="text-sm w-full flex flex-col items-start justify-center col-span-3">
                  <span className="font-semibold text-gray-900 dark:text-white truncate max-w-full" title={title}>
                    {title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {category}
                  </span>
                </div>

                {/* 4. Document Column */}
                <div className="text-sm flex items-center justify-center w-full col-span-1">
                  {docInfo ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const documentUrl = getDocumentUrl(docInfo.url);
                        if (documentUrl) {
                          window.open(documentUrl, "_blank", "noopener,noreferrer");
                        } else {
                          setActiveId(id);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-[#73FBFD] border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
                      title={docInfo.name}
                    >
                      <FileText className="size-3.5" />
                      <ExternalLink className="size-3 opacity-70" />
                    </button>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">—</span>
                  )}
                </div>

                {/* 5. Date */}
                <div className="text-xs flex items-center justify-center w-full font-medium text-gray-700 dark:text-gray-300 col-span-1">
                  {formatDate(created_at)}
                </div>

                {/* 6. Status Column */}
                <div className="flex items-center justify-center w-full col-span-2">
                  {isAdminOrCoAdmin ? (
                    <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={normalizedStatus}
                        onChange={(e) => onStatusChange?.(item, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl outline-none cursor-pointer text-center transition-colors shadow-xs ${statusStyle(
                          normalizedStatus
                        )}`}
                      >
                        <option value="open" className="bg-white dark:bg-gray-800 text-[#C71212] dark:text-[#F87171]">
                          Open
                        </option>
                        <option value="in-progress" className="bg-white dark:bg-gray-800 text-[#C05328] dark:text-[#FBBF24]">
                          In Progress
                        </option>
                        <option value="resolved" className="bg-white dark:bg-gray-800 text-[#29CC39] dark:text-[#34D399]">
                          Resolved
                        </option>
                        <option value="closed" className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                          Closed
                        </option>
                      </select>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-1.5 justify-center py-1.5 rounded-xl px-3 text-xs font-semibold ${statusStyle(
                        normalizedStatus
                      )}`}
                    >
                      {statusIcon(normalizedStatus)}
                      <span className="capitalize">{status.replace("-", " ")}</span>
                    </div>
                  )}
                </div>

                {/* 7. Actions */}
                <div className="flex items-center justify-center w-full col-span-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveId(id);
                    }}
                    className="p-1.5 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                    title="View Complaint"
                    aria-label="View complaint details"
                  >
                    <Eye className="size-4 text-blue-600 dark:text-[#73FBFD]" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="h-px block md:hidden w-full bg-[#E0DDDD] dark:bg-[#2E2F2F]" />

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4 px-4 h-[calc(100dvh-120px)] overflow-y-auto pb-32 no-scrollbar mt-3">
        {COMPLAINTS.map((item) => {
          const id = item.id || item._id;
          const { title, category, status = "open", created_at } = item;
          const docInfo = getDocumentInfo(item);
          const filerName =
            item.filer_name ||
            item.user_name ||
            item.userName ||
            item.name ||
            (item.user && (item.user.name || item.user.username)) ||
            "User";
          const filerEmail =
            item.filer_email ||
            item.user_email ||
            item.email ||
            item.userEmail ||
            (item.user && item.user.email) ||
            "—";
          const normalizedStatus = String(status).toLowerCase().replace(" ", "-");

          return (
            <div
              key={id}
              onClick={() => setActiveId(id)}
              className="flex flex-col gap-3 bg-[#FFFFFF] dark:bg-[#1E1E1E] p-4 shadow-sm border border-gray-200 dark:border-gray-800 transition-shadow rounded-2xl relative cursor-pointer"
            >
              <div className="flex w-full items-start justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">
                    Filer
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {filerName}
                  </h3>
                  <span className="text-xs text-blue-600 dark:text-[#73FBFD] font-medium truncate">
                    {filerEmail}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono text-gray-400">
                    {id ? (id.length > 8 ? `${id.slice(0, 8)}...` : id) : ""}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center items-start w-full">
                <h4 className="text-base font-bold text-[#000000] dark:text-[#FFFFFF]">{title}</h4>
                <h5 className="text-xs font-semibold text-blue-600 dark:text-[#73FBFD]">{category}</h5>
              </div>

              {docInfo && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Doc:</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const documentUrl = getDocumentUrl(docInfo.url);
                      if (documentUrl) {
                        window.open(documentUrl, "_blank", "noopener,noreferrer");
                      } else {
                        setActiveId(id);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-[#73FBFD] font-medium underline truncate max-w-[200px]"
                  >
                    <FileText className="size-3" />
                    <span className="truncate">{docInfo.name}</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <FaClock className="size-3" />
                  <span>{formatDate(created_at)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isAdminOrCoAdmin ? (
                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        value={normalizedStatus}
                        onChange={(e) => onStatusChange?.(item, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-xl outline-none cursor-pointer ${mobileStatusStyle(
                          normalizedStatus
                        )}`}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-1 justify-center py-1 px-2.5 rounded-xl ${mobileStatusStyle(
                        normalizedStatus
                      )}`}
                    >
                      {mobileStatusIcon(normalizedStatus)}
                      <span className="text-xs font-semibold capitalize">{status.replace("-", " ")}</span>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveId(id);
                    }}
                    className="p-1.5 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-full"
                    title="View Complaint"
                  >
                    <Eye className="size-4 text-blue-600 dark:text-[#73FBFD]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
