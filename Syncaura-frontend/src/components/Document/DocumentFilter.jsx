import { motion } from "framer-motion";
import FilterDropdown from "../common/FilterDropdown";
import { useState } from "react";
import { X, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DocumentFilter({ onClose, onApply, currentFilters }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState(currentFilters?.status || "All");
  const [type, setType] = useState(currentFilters?.type || "All");
  const [version, setVersion] = useState(currentFilters?.version || "Above");
  const [versionNo, setVersionNo] = useState(currentFilters?.versionNo || "All");
  const [date, setDate] = useState(currentFilters?.date || "");

  const items = ["All", "Active", "Archived", "Draft", "Final"];

  const handleReset = () => {
    setStatus("All");
    setType("All");
    setVersion("Above");
    setVersionNo("All");
    setDate("");
    onApply(null);
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onApply({
      status: newStatus,
      type,
      version,
      versionNo,
      date,
    });
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    onApply({
      status,
      type: newType,
      version,
      versionNo,
      date,
    });
  };

  const handleVersionNoChange = (newVersionNo) => {
    setVersionNo(newVersionNo);
    onApply({
      status,
      type,
      version,
      versionNo: newVersionNo,
      date,
    });
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onApply({
      status,
      type,
      version,
      versionNo,
      date: newDate,
    });
  };

  return (
    <div className="w-full px-2 sm:px-6 relative mb-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2A2A2A] rounded-2xl shadow-xl p-4 sm:p-5 flex flex-col gap-3.5"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 dark:border-[#222222]">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Filter Documents & Reports
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1E1E1E]"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* 4 Equal Balanced Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full items-end">
          {/* Date Range */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[11px] font-bold tracking-wider uppercase text-gray-600 dark:text-gray-400">
              {t("dateRange", "Date Range (On/After)")}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full h-[36px] rounded-xl border border-gray-300 dark:border-[#2A2A2A] px-3 py-1.5 text-xs bg-white dark:bg-[#0B0B0B] text-gray-900 dark:text-white focus:outline-none focus:border-[#2461E6] dark:focus:border-[#73FBFD]"
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1 w-full">
            <FilterDropdown
              options={["All", "PDF", "XLS", "DOC", "ZIP", "TXT"]}
              startVal={type}
              label={t("type", "File Type")}
              onChange={handleTypeChange}
            />
          </div>

          {/* Version No */}
          <div className="flex flex-col gap-1 w-full">
            <FilterDropdown
              options={[
                "All",
                "v1.0",
                "v1.5",
                "v2.0",
                "v2.5",
                "v3.0",
              ]}
              startVal={versionNo}
              label={t("versionNo", "Version")}
              onChange={handleVersionNoChange}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1 w-full">
            <FilterDropdown
              options={items}
              startVal={status}
              label={t("status", "Status")}
              onChange={handleStatusChange}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
