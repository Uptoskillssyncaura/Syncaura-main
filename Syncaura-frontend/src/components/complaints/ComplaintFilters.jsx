import { motion } from "framer-motion";
import FilterDropdown from "../common/FilterDropdown";
import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ComplaintFilters({ onClose, onApply }) {
  const { t } = useTranslation();
  const items = [
    t("complaintFilters_statusResolved", "Resolved"),
    t("complaintFilters_statusInProgress", "In Progress"),
    t("complaintFilters_statusOpen", "Open")
  ];
  const orderOptions = [
    t("complaintFilters_orderAscending", "Ascending"),
    t("complaintFilters_orderDescending", "Descending")
  ];
  const [status, setStatus] = useState(items[0]);
  const [order, setOrder] = useState(orderOptions[0]);
  const [date, setDate] = useState("");
  useEffect(() => {
  onApply({
    status,
    order,
    date,
  });
}, [status, order, date, onApply]);

  const statusItems = ["Resolved", "In Progress", "Open"];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full bg-white dark:bg-black rounded-2xl shadow-[0_0_10px_1px_#ACACAC33] p-4 sm:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch justify-center lg:items-center"
      >

        {/* Complaint ID Order */}
        <div className="flex flex-col gap-2 w-full lg:w-1/4">
          <FilterDropdown
            options={orderOptions}
            startVal={order}
            label={t("complaintFilters_complaintIdOrder", "Complaint Id Order")}
            onChange={setOrder}
          />
        </div>

        {/* Date Range */}
        <div className="flex flex-col items-center justify-center gap-2 w-full lg:w-1/4">
          <label className="text-sm font-semibold w-full text-gray-700 dark:text-gray-300">
            {t("complaintFilters_dateRange", "Date Range")}
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

        {/* Status */}
        <div className="flex flex-col gap-2 w-full lg:w-1/4">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("complaintFilters_status", "Status")}
          </label>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <button
                onClick={() => setStatus(item)}
                key={item}
                className={`btn-hover px-4 py-1.5 rounded-full text-sm border ${
                  status === item
                    ? "border-blue-500 text-blue-500 dark:border-[#73FBFD] dark:text-[#73FBFD]"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-auto flex items-end">
          <motion.button
            onClick={() => {
              onApply({ status, order, date });
              onClose();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-full lg:w-auto bg-blue-600 dark:bg-[#73FBFD] dark:text-black text-white font-medium px-5 py-3 rounded-full shadow-sm text-sm"
          >
            {t("complaintFilters_applyFilters", "Apply Filters")}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
