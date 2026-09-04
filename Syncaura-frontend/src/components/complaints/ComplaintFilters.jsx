import { motion } from "framer-motion";
import FilterDropdown from "../common/FilterDropdown";
import { useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ComplaintFilters({ onClose, onApply, currentFilters, onReset }) {
  const { t } = useTranslation();

  const statusOptions = [
    { label: t("complaintFilters_statusAll", "All"), value: "All" },
    { label: t("complaintFilters_statusOpen", "Open"), value: "Open" },
    { label: t("complaintFilters_statusInProgress", "In Progress"), value: "In Progress" },
    { label: t("complaintFilters_statusResolved", "Resolved"), value: "Resolved" },
    { label: t("complaintFilters_statusClosed", "Closed"), value: "Closed" },
  ];

  const orderOptions = [
    t("complaintFilters_orderDescending", "Descending"),
    t("complaintFilters_orderAscending", "Ascending"),
  ];

  const [status, setStatus] = useState(currentFilters?.status || "All");
  const [order, setOrder] = useState(currentFilters?.order || orderOptions[0]);
  const [date, setDate] = useState(currentFilters?.date || "");

  const handleApply = () => {
    onApply({
      status,
      order,
      date,
    });
    onClose?.();
  };

  const handleReset = () => {
    setStatus("All");
    setOrder(orderOptions[0]);
    setDate("");
    if (onReset) {
      onReset();
    } else {
      onApply(null);
    }
    onClose?.();
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full bg-white dark:bg-[#181818] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-gray-200 dark:border-[#333333] p-5 sm:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-end justify-between"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors"
          title="Close filters"
        >
          <X className="size-4" />
        </button>

        {/* Order Dropdown */}
        <div className="flex flex-col gap-2 w-full lg:w-1/4">
          <FilterDropdown
            options={orderOptions}
            startVal={order}
            label={t("complaintFilters_complaintIdOrder", "Order by Date")}
            onChange={setOrder}
          />
        </div>

        {/* Date Range */}
        <div className="flex flex-col gap-2 w-full lg:w-1/4">
          <label className="text-sm font-semibold w-full text-gray-700 dark:text-gray-300">
            {t("complaintFilters_dateRange", "Date")}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-full border border-gray-200 dark:border-[#3A3A3A] px-4 py-2 text-sm text-gray-800 dark:text-gray-200
              bg-white dark:bg-[#121212]
              focus:outline-none focus:ring-2 focus:ring-blue-500 date-input"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-2 w-full lg:w-2/5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("complaintFilters_status", "Status")}
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {statusOptions.map((item) => {
              const isSelected = status === item.value;
              return (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setStatus(item.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-600 dark:border-[#73FBFD] dark:bg-[#73FBFD]/10 dark:text-[#73FBFD] font-semibold"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 lg:pt-0 w-full lg:w-auto justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252525] text-xs font-medium transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </button>

          <motion.button
            type="button"
            onClick={handleApply}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-blue-600 dark:bg-[#73FBFD] dark:text-black text-white font-medium px-5 py-2 rounded-full shadow-sm text-xs cursor-pointer hover:bg-blue-500 dark:hover:bg-[#2cc4c7] transition-colors"
          >
            {t("complaintFilters_applyFilters", "Apply")}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
