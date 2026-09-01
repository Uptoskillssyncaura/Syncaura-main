import React from "react";

const ResourceUtilization = () => {
  return (
    <div className="bg-white dark:bg-[#161616] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4 mt-6 transition-colors duration-300">
      <h2 className="text-2xl font-bold  text-black dark:text-white mb-10 transition-colors">
        Resource Utilization
      </h2>

      <div className="space-y-4 px-10">
        <p className="text-sm text-gray-500">Resource capacity data is unavailable.</p>
        {[].map((item) => (
          <div key={index} className="flex items-center gap-6">
            <span className="w-16 text-l font-bold text-gray-900 dark:text-gray-400 dark:font-semibold transition-colors">
              {item.name}
            </span>

            <div className="flex-1 h-2.5 bg-gray-200 dark:bg-zinc-800/60 rounded-full overflow-hidden transition-colors">
              <div
                className={`h-full ${item.color} ${item.darkColor} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${item.rate}%` }}
              ></div>
            </div>
            <span className="w-10 text-l font-bold text-gray-900 dark:text-white text-right transition-colors">
              {item.rate}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceUtilization;