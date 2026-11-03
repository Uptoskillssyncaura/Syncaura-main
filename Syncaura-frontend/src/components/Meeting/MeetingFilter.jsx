import { motion } from "framer-motion";
import FilterDropdown from "../common/FilterDropdown";
import { useState } from "react";
import { X, RotateCcw } from "lucide-react";

export default function MeetingFilter({ onClose, onApply, currentFilters }) {
  const [platform, setPlatform] = useState(currentFilters?.platform || "All");
  const [hasDoc, setHasDoc] = useState(currentFilters?.hasDoc || "All");
  const [date, setDate] = useState(currentFilters?.date || "");

  const platformOptions = ["All", "Google Meet"];
  const docOptions = ["All", "Yes", "No"];

  const handleReset = () => {
    setPlatform("All");
    setHasDoc("All");
    setDate("");
    onApply(null);
  };

  const handlePlatformChange = (newPlatform) => {
    setPlatform(newPlatform);
    onApply({
      platform: newPlatform,
      hasDoc,
      date,
    });
  };

  const handleHasDocChange = (newHasDoc) => {
    setHasDoc(newHasDoc);
    onApply({
      platform,
      hasDoc: newHasDoc,
      date,
    });
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onApply({
      platform,
      hasDoc,
      date: newDate,
    });
  };

  return (
    <div className="w-full relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2A2A2A] rounded-2xl shadow-xl p-4 sm:p-5 flex flex-col gap-3.5"
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#222222] pb-2.5">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            Filter Meetings
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
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* 3 Equal Balanced Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full items-end">
          {/* Date Picker */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[11px] font-bold tracking-wider uppercase text-gray-600 dark:text-gray-400">
              Date (On/After)
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full h-[36px] rounded-xl border border-gray-300 dark:border-[#2A2A2A] px-3 py-1.5 text-xs bg-white dark:bg-[#0B0B0B] text-gray-900 dark:text-white focus:outline-none focus:border-[#2461E6] dark:focus:border-[#73FBFD]"
            />
          </div>

          {/* Platform Dropdown */}
          <div className="flex flex-col gap-1 w-full">
            <FilterDropdown
              options={platformOptions}
              startVal={platform}
              label="Platform"
              onChange={handlePlatformChange}
            />
          </div>

          {/* Has Document Dropdown */}
          <div className="flex flex-col gap-1 w-full">
            <FilterDropdown
              options={docOptions}
              startVal={hasDoc}
              label="Has Documents"
              onChange={handleHasDocChange}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
