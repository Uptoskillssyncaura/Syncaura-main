import { motion } from "framer-motion";
import FilterDropdown from "../common/FilterDropdown";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AttendanceLeaveFilter({ onClose, onApply }) {
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [date, setDate] = useState("");


  const items = ["All", "Approved", "Pending", "Rejected"];
  const typeOptions = [
    "All",
    "Casual",
    "Sick",
    "Earned",
    "Maternity",
    "Paternity",
    "Work From Home",
  ];

  useEffect(() => {
    onApply({
      status,
      type,
      date,
    });
  }, [status, type, date, onApply]);

  const handleReset = () => {
    setStatus("All");
    setType("All");
    setDate("");
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full bg-white dark:bg-[#121212] rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch justify-between lg:items-end border border-gray-200 dark:border-[#2A2A2A]"
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition-colors cursor-pointer"
          onClick={onClose}
          title="Close filters"
        >
          <X className="size-4" />
        </button>

        {/* Date Range */}
        <div className="flex flex-col gap-1.5 w-full lg:w-1/4">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-[#2A2A2A] px-3.5 py-2 text-xs 
            bg-white dark:bg-[#0B0B0B] text-gray-800 dark:text-gray-200 
            focus:outline-none focus:ring-1 focus:ring-[#2461E6] dark:focus:ring-[#73FBFD] date-input"
          />
        </div>

        {/* Type Filter Dropdown */}
        <div className="flex flex-col gap-1.5 w-full lg:w-1/4">
          <FilterDropdown
            options={typeOptions}
            startVal={type}
            label="Type"
            onChange={setType}
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-col gap-1.5 w-full lg:w-1/3">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Status
          </label>
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  status === item
                    ? "border-[#2461E6] text-[#2461E6] bg-blue-50 dark:border-[#73FBFD] dark:text-[#73FBFD] dark:bg-[#73FBFD]/10 font-bold"
                    : "border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#0B0B0B] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full lg:w-auto flex items-center justify-end gap-2 pt-2 lg:pt-0">
          <button
            type="button"
            onClick={handleReset}
            className="border border-gray-200 dark:border-[#2A2A2A] text-gray-600 dark:text-gray-400 font-semibold px-4 py-2 rounded-xl text-xs hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </motion.div>
    </div>
  );
}