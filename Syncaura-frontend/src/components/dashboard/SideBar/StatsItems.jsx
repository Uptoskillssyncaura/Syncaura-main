import React from "react";

const StatsItems = ({color, value, label}) => {
  return (
    <div
      className="bg-white dark:bg-[#1A1B1E] transition-colors duration-550 shadow-[0_3px_3px_1px_rgba(0,0,0,0.28),0_-1px_0px_0px_rgba(0,0,0,0.15)] rounded-2xl flex flex-col items-center justify-center py-5 border border-gray-100 dark:border-0"
    >
      
      <span
        className={`text-white text-sm px-4 py-1 rounded-[50%/50%] font-semibold ${color}`}
      >
        {value}
      </span>

      <span className="text-xs text-gray-700 dark:text-gray-500 mt-2 font-medium">
        {label}
      </span>
    </div>
  );
};

export default StatsItems;
