import { motion } from "framer-motion";
import FilterDropdown from "../common/FilterDropdown";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AttendanceLeaveFilter({ onClose, onApply }) {
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [date, setDate] = useState("");

  useEffect(() => {
  onApply({
    status,
    type,
    date,
  });
}, [status, type, date, onApply]);

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full bg-white dark:bg-[#121212] rounded-2xl shadow-[0_0_10px_1px_#ACACAC33] p-4 sm:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch justify-center lg:items-center border border-gray-100 dark:border-[#2E2F2F]"
      >
        {/* Close Button */}
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-black dark:text-white"
          onClick={onClose}
        >
          <X className="size-4" />
        </motion.button>

        {/* Date Range */}
        <div className="flex flex-col items-start justify-center gap-1.5 w-full lg:w-1/4">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Date Range
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-[#3A3A3A] px-3.5 py-2 text-sm 
            bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-200 
            focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        <div className="flex flex-col gap-1.5 w-full lg:w-1/4">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Status
          </label>
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatus(item)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  status === item
                    ? "border-blue-600 text-blue-600 bg-blue-50/50 dark:border-[#73FBFD] dark:text-[#73FBFD] dark:bg-neutral-800 font-semibold"
                    : "border-gray-200 dark:border-[#3A3A3A] text-gray-600 dark:text-gray-400 hover:border-gray-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="w-full lg:w-auto flex items-center justify-end gap-2 mt-2 lg:mt-0">
          <motion.button
            type="button"
            onClick={handleReset}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full lg:w-auto border border-gray-200 dark:border-[#3A3A3A] text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Reset
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}