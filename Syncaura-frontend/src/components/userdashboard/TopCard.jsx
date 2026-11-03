const TopCard = ({ title, IconData, count, data = null, titleColor=null, countColor=null }) => {
  return (
    <div
      className="flex flex-col items-start justify-center gap-y-4 w-full px-5 py-3 rounded-lg shadow-[0_0_10px_0_#54545440] pb-8
      /* LIGHT MODE BACKGROUND */
      bg-[#FFFFFF] 
      /* DARK MODE BACKGROUND - Specific Fix */
      dark:bg-[#1E1E1E]"
    >
      <div className="flex items-center justify-between w-full">
        <h3 className={`${titleColor ?? "text-slate-600 dark:text-slate-300"} text-xs font-semibold uppercase tracking-wider`}>
          {title}
        </h3>
        <div className="flex items-center justify-center">{IconData}</div>
      </div>
      <div className="flex items-end justify-between w-full">
        {/* Count */}
        <h2 className={`${countColor ?? "text-gray-900 dark:text-white"} text-3xl sm:text-4xl font-bold`}>
          {count}
        </h2>
        {data && data}
      </div>
    </div>
  );
};

export default TopCard;