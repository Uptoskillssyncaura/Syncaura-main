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

  const handleReset = () => {
    setStatus("All");
    setOrder(orderOptions[0]);
    setDate("");
    if (onReset) {
      onReset();
    } else {
      onApply(null);
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onApply({
      status: newStatus,
      order,
      date,
    });
  };

  const handleOrderChange = (newOrder) => {
    setOrder(newOrder);
    onApply({
      status,
      order: newOrder,
      date,
    });
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onApply({
      status,
      order,
      date: newDate,
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full bg-white dark:bg-[#121212] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#2A2A2A] p-5 sm:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-end justify-between"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition-colors cursor-pointer"
          title="Close filters"
        >
          <X className="size-4" />
        </button>

        {/* Order Dropdown */}
        <div className="flex flex-col gap-1.5 w-full lg:w-1/4">
          <FilterDropdown
            options={orderOptions}
            startVal={order}
            label={t("complaintFilters_complaintIdOrder", "Order by Date")}
            onChange={handleOrderChange}
          />
        </div>

        {/* Date Range */}
        <div className="flex flex-col gap-1.5 w-full lg:w-1/4">
          <label className="text-xs font-semibold w-full text-gray-700 dark:text-gray-300">
            {t("complaintFilters_dateRange", "Date")}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-[#2A2A2A] px-3.5 py-2 text-xs text-gray-800 dark:text-gray-200
              bg-white dark:bg-[#0B0B0B]
              focus:outline-none focus:ring-1 focus:ring-[#2461E6] dark:focus:ring-[#73FBFD] date-input"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5 w-full lg:w-2/5">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {t("complaintFilters_status", "Status")}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {statusOptions.map((item) => {
              const isSelected = status === item.value;
              return (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => handleStatusChange(item.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#2461E6] bg-blue-50 text-[#2461E6] dark:border-[#73FBFD] dark:bg-[#73FBFD]/10 dark:text-[#73FBFD]"
                      : "border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#0B0B0B] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-[#2A2A2A] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1E1E1E] text-xs font-semibold transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
