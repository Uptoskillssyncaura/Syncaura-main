import React from "react";
import { motion } from "framer-motion";
import { LuTrendingUp, LuTrendingDown } from "react-icons/lu";

const StatCard = ({
  title,
  value,
  icon,
  iconColor,
  iconBg,
  percent,
  percentColor,
  percentBg,
  showTrend = false,
}) => {
  const hasPercent = Boolean(percent && String(percent).trim() !== "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-5 flex flex-col gap-4 hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
          {title}
        </h3>

        <motion.div
          whileHover={{ rotate: 12 }}
          className={`p-2 rounded-lg text-lg ${iconBg} ${iconColor}`}
        >
          {icon}
        </motion.div>
      </div>

      <div className="flex items-center gap-3">
        <motion.h2
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold text-gray-700 dark:text-white"
        >
          {value}
        </motion.h2>

        {hasPercent && (
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${percentBg} ${percentColor}`}
          >
            {showTrend && <LuTrendingUp size={12} className="text-blue-500" />}
            {percent}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;