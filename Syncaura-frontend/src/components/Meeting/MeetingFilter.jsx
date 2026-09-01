import { motion } from "framer-motion";
import FilterDropdown from "../common/FilterDropdown";
import { useState } from "react";
import { X, RotateCcw } from "lucide-react";

export default function MeetingFilter({ onClose, onApply, currentFilters }) {
  const [platform, setPlatform] = useState(currentFilters?.platform || "All");
  const [hasDoc, setHasDoc] = useState(currentFilters?.hasDoc || "All");
  const [date, setDate] = useState(currentFilters?.date || "");

  const platformOptions = ["All", "Zoom", "Google Meet", "Teams"];
  const docOptions = ["All", "Yes", "No"];

  const handleApply = () => {
    onApply({
      platform,
      hasDoc,
      date,
    });
    onClose();
  };

  const handleReset = () => {
    setPlatform("All");
    setHasDoc("All");
    setDate("");
    onApply(null);
    onClose();
  };

  return (
    <div className="w-full relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2c2c2c] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 sm:p-5 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between border-b border-[#e5e7eb] dark:border-[#2c2c2c] pb-3">
          <h3 className="font-semibold text-sm text-[#111827] dark:text-white">
            Filter Meetings
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {/* Platform Dropdown */}
          <FilterDropdown
            options={platformOptions}
            startVal={platform}
            label="Platform"
            onChange={setPlatform}
          />

          {/* Has Document Dropdown */}
          <FilterDropdown
            options={docOptions}
            startVal={hasDoc}
            label="Has Documents"
            onChange={setHasDoc}
          />

          {/* Date Picker */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-full border border-gray-200 dark:border-[#3A3A3A] px-4 py-2 text-sm bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#e5e7eb] dark:border-[#2c2c2c]">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition btn-hover"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>

          <button
            onClick={handleApply}
            className="px-5 py-2 bg-[#2563eb] dark:bg-[#73FBFD] dark:text-black text-white rounded-full text-xs font-semibold shadow-sm hover:bg-[#1d4ed8] dark:hover:bg-[#5feff2] transition btn-hover"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </div>
  );
}
