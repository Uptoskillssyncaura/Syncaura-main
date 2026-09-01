import { motion } from "framer-motion";
import FilterDropdown from "../common/FilterDropdown";
import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProjectFilter({ onClose, onApply }) {
  const { t } = useTranslation();
  const items = [
    t("projectFilter_priorityLow", "Low"),
    t("projectFilter_priorityMedium", "Medium"),
    t("projectFilter_priorityHigh", "High"),
    t("projectFilter_priorityCritical", "Critical")
  ];
  const [priority, setPriority] = useState(items[0]);
  const [team, setTeam] = useState(t("projectFilter_allMembers", "All Members"));
  const [date, setDate] = useState("");

  const priorityItems = ["Low", "Medium", "High", "Critical"];

  const applyFilter = (changes = {}) => {
    onApply({
      priority: changes.priority ?? priority,
      team: changes.team ?? team,
      date: changes.date ?? date,
    });
  };
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 relative">
      <motion.button
        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
        whileHover={{ scale: 1.15, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="
    absolute
    top-1
    right-6 lg:right-10
    z-50
    p-2
    rounded-full
  "
        onClick={() => {
          onApply(null);
          onClose();
        }}
      >
        <X className="text-black dark:text-white size-5" />
      </motion.button>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full bg-white dark:bg-black rounded-2xl shadow-[0_0_10px_1px_#ACACAC33] p-4 sm:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch justify-center lg:items-center "
      >
        <div
          className="
    w-full
    grid
    grid-cols-1
    gap-4
    md:grid-cols-2
    xl:grid-cols-4
    items-end
  "
        >
          {/* Date + Team (always together) */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 w-full xl:col-span-2">
            {/* Date */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
                {t("projectFilter_dateRange", "Date Range")}
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => {
                  const value = e.target.value;
                  setDate(value);
                  applyFilter({ date: value });
                }}
                className="
          w-full rounded-full border border-gray-200
          px-4 py-2 text-sm
          bg-white dark:bg-[#2E2F2F]
          text-[#898888] dark:text-gray-200
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
              />
            </div>

            {/* Team */}
            <FilterDropdown
              options={[t("projectFilter_allMembers", "All Members"), ""]}
              startVal={team}
              label={t("projectFilter_teamMembers", "TEAM / MEMBERS")}
              onChange={setTeam}
            />
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
              {t("projectFilter_priority", "Priority")}
            </label>

            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setPriority(item);
                    applyFilter({ priority: item });
                  }}
                  className={`btn-hover px-4 py-1.5 rounded-full text-sm border ${priority === item
                      ? "border-blue-500 text-blue-500 dark:border-[#73FBFD] dark:text-[#73FBFD]"
                      : "border-gray-300 text-gray-500"
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Apply */}
          <div className="w-full flex items-end">
            <motion.button
              onClick={() => {
                onApply({ priority, team, date });
                onClose();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="
        w-full
        bg-blue-600 dark:bg-[#73FBFD]
        dark:text-black text-white
        font-medium px-5 py-3
        rounded-full shadow-sm text-sm
      "
            >
              {t("projectFilter_applyFilters", "Apply Filters")}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
