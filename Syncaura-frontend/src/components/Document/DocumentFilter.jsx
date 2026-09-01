import { motion } from "framer-motion";
import FilterDropdown from "../common/FilterDropdown";
import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DocumentFilter({ onClose, onApply }) {
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [version, setVersion] = useState("Above");
  const [versionNo, setVersionNo] = useState("All");
  const [date, setDate] = useState("");

  const items = ["All", "Final", "Draft", "Revised"];

  const applyFilter = (changes = {}) => {
  onApply({
    status: changes.status ?? status,
    type: changes.type ?? type,
    version: changes.version ?? version,
    versionNo: changes.versionNo ?? versionNo,
    date: changes.date ?? date,
  });
};
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full bg-white dark:bg-black rounded-2xl shadow-[0_0_10px_1px_#ACACAC33] p-4 sm:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch justify-center  lg:items-center "
      >
        <motion.button
          initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="absolute top-4 right-10 md:right-15 z-100"
          onClick={() => {
            onApply(null);
            onClose();
          }}
        >
          <X className="text-black dark:text-white size-5" />
        </motion.button>

        <div
          className="
    w-full
    grid
    gap-2
   grid-cols-2
    xl:grid-cols-4
    items-end flex-6/9
  "
        >
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t("dateRange", "Date Range")}
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

          {/* Type */}
          <FilterDropdown
            options={["All", "PDF", "XLS", "DOC", "ZIP"]}
            startVal={type}
            label={t("type", "Type")}
            onChange={setType}
          />

          {/* Version */}
          <FilterDropdown
            options={["Above", "Below"]}
            startVal={version}
            label={t("documents_version", "Version")}
            onChange={setVersion}
          />

          {/* Version No */}
          <FilterDropdown
            options={[
              "All",
              "v1.0",
              "v1.5",
              "v2.0",
              "v2.5",
              "v3.0",
              "v3.5",
              "v4.0",
              "v4.5",
              "v5.0",
            ]}
            startVal={versionNo}
            label={t("versionNo", "Version No")}
            onChange={setVersionNo}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col items-start gap-2 w-full lg:w-2/9">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("status", "Status")}
          </label>
          <div className="flex flex-wrap  gap-2">
            {items.map((item) => (
              <button
               onClick={() => {
                setStatus(item);
                applyFilter({ status: item });
                }}
                key={item}
                className={`btn-hover px-4 py-1.5 rounded-full text-sm border ${status === item ? "border-blue-500 text-blue-500 dark:border-[#73FBFD] dark:text-[#73FBFD]" : "border-gray-300 text-gray-500"}`}
              >
                {t(`status_${item.toLowerCase()}`, item)}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-auto flex items-end lg:justify-center lg:flex-1/9 ">
          <motion.button
            onClick={() => {
              onApply({
                status,
                type,
                version,
                versionNo,
                date,
              });
              onClose();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-full  lg:w-30  bg-blue-600 dark:bg-[#73FBFD] dark:text-black text-white font-medium px-5 py-3 rounded-full shadow-sm text-sm"
          >
            {t("filter_applyFilters", "Apply Filters")}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
