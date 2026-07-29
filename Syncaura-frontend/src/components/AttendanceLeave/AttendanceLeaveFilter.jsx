import { motion } from "framer-motion";
import FilterDropdown from "../FilterDropdown";
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full bg-white dark:bg-black rounded-2xl shadow-[0_0_10px_1px_#ACACAC33] p-4 sm:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch justify-center lg:items-center "
      >
        <motion.button
          initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="absolute top-4 right-10 md:right-15 z-100"
          onClick={onClose}
        >
          <X className="text-black dark:text-white size-5" />
        </motion.button>

        {/* Date Range */}
        <div className="flex flex-col items-center justify-center gap-2 w-full lg:w-1/4">
          <label className="text-sm font-semibold w-full text-gray-700 dark:text-gray-300">
            Date Range
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-full border border-gray-200 px-4 py-2 pr-10 text-sm text-[#898888]
            bg-white dark:bg-[#2E2F2F]
            dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 date-input"
          />
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2 w-full lg:w-1/4">
          <FilterDropdown
            options={typeOptions}
            startVal={type}
            label="Type"
            onChange={setType}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2 w-full lg:w-1/4">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Status
          </label>

          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <button
                key={item}
                onClick={() => setStatus(item)}
                
                className={`btn-hover px-3 py-1.5 rounded-full text-xs sm:text-sm border ${status === item ? "border-blue-500 text-blue-500 dark:border-[#73FBFD] dark:text-[#73FBFD] font-semibold" : "border-gray-300 text-gray-500"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-auto flex items-center justify-end gap-2 mt-2 lg:mt-0">
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full lg:w-auto border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium px-4 py-2.5 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Reset
          </motion.button>
          
        </div>
      </motion.div>
    </div>
  );
}