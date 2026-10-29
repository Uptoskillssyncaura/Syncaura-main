import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

const TableRow = ({
  name,
  type,
  version,
  date,
  status,
  docColor,
  document,
  onView,
  onEdit,
  canEdit = true,
}) => {
  const { t } = useTranslation();

  function formatDateYYYYMMDD(isoDate) {
    if (!isoDate) return "—";
    try {
      return new Date(isoDate).toISOString().split("T")[0];
    } catch {
      return String(isoDate);
    }
  }

  const statusColor = {
    Final: "bg-[#DCFCE7] text-[#29CC39]",
    Draft: "bg-[#FEF9C3] text-[#954D4E]",
    Revised: "bg-[#DBEAFE] text-[#3053B4]",
    Active: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
    active: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center w-full px-10">

        {/* Name */}
        <div className={`${canEdit ? "w-[30%]" : "w-[35%]"} flex items-center gap-5 justify-start min-w-0 pr-2`}>
          <FileText className={`size-8 flex-shrink-0 ${docColor}`} />
          <h1 className="text-base font-medium text-black dark:text-white truncate">
            {name}
          </h1>
        </div>

        {/* Type */}
        <div className={`${canEdit ? "w-[12%]" : "w-[13%]"} flex items-center justify-start`}>
          <h1 className="uppercase text-base text-black font-medium dark:text-white truncate">
            {type}
          </h1>
        </div>

        {/* Version */}
        <div className={`${canEdit ? "w-[10%]" : "w-[11%]"} flex items-center justify-start`}>
          <h1 className="text-base font-medium text-black dark:text-white">
            {version}
          </h1>
        </div>

        {/* Date */}
        <div className={`${canEdit ? "w-[15%]" : "w-[15%]"} flex items-center justify-start`}>
          <h1 className="text-base font-medium text-black dark:text-white">
            {formatDateYYYYMMDD(date)}
          </h1>
        </div>

        {/* Status */}
        <div className={`${canEdit ? "w-[11%]" : "w-[12%]"} flex items-center justify-center`}>
          <div
            className={`w-25 flex items-center justify-center py-1.5 rounded-md text-sm font-medium ${statusColor[status] || "bg-gray-100 text-gray-700"
              }`}
          >
            {t(`status_${(status || "active").toLowerCase()}`, status || "Active")}
          </div>
        </div>

        {/* Document (View Action) */}
        <div className={`${canEdit ? "w-[14%]" : "w-[14%]"} flex items-center justify-center`}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView?.();
            }}
            className="text-[#2461E6] dark:text-[#73FBFD] hover:underline font-semibold text-sm cursor-pointer btn-hover"
          >
            {t("view_document", "View Document")}
          </button>
        </div>

        {/* Edit */}
        {canEdit && (
          <div className="w-[8%] flex items-center justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="text-[#2461E6] dark:text-[#73FBFD] hover:underline font-medium text-sm cursor-pointer btn-hover"
            >
              {t("edit", "Edit")}
            </button>
          </div>
        )}

      </div>

      {/* Mobile */}
      <div className="md:hidden w-full px-4">
        <div className="flex flex-col gap-3 rounded-xl border bg-white dark:bg-black p-4 shadow-sm">

          <div className="flex items-center gap-3">
            <FileText className={`size-7 ${docColor}`} />
            <h1 className="font-semibold text-black dark:text-white text-sm break-all">
              {name}
            </h1>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">
                {t("type", "Type")}
              </p>
              <p className="font-medium uppercase text-black dark:text-white">
                {type}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                {t("version", "Version")}
              </p>
              <p className="font-medium text-black dark:text-white">
                {version}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                {t("last_modified", "Last Modified")}
              </p>
              <p className="font-medium text-black dark:text-white">
                {formatDateYYYYMMDD(date)}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                {t("status", "Status")}
              </p>
              <span
                className={`inline-block px-5 py-1 mt-2 rounded-md text-xs font-medium ${statusColor[status] || "bg-gray-100 text-gray-700"
                  }`}
              >
                {t(`status_${(status || "active").toLowerCase()}`, status || "Active")}
              </span>
            </div>
          </div>

          {/* Document */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 text-sm">
              {t("document", "Document")}
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView?.();
              }}
              className="text-sm font-semibold text-[#2461E6] dark:text-[#73FBFD] hover:underline cursor-pointer btn-hover"
            >
              {t("view_document", "View Document")}
            </button>
          </div>

          {/* Edit */}
          {canEdit && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="text-sm font-medium text-[#2461E6] dark:text-[#73FBFD] hover:underline cursor-pointer btn-hover"
              >
                {t("edit", "Edit")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TableRow;