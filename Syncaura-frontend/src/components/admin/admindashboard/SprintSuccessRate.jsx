import React from "react";

const SprintSuccessRate = () => {
  return (
    <div className="bg-white dark:bg-[#161616] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4 mt-6 transition-colors duration-300">

      <h2 className="text-2xl font-bold  text-black dark:text-white mb-6 transition-colors">
        Sprint Success Rate
      </h2>
      <div className="flex flex-col gap-1">
        <p className="p-6 text-sm text-gray-500">Sprint history is unavailable.</p>
        {[].map((sprint) => (
          <div key={index} className="w-full mb-4">
            <div className="flex justify-between items-center mx-10">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                {sprint.name}
              </span>
              <span className={`text-sm font-bold text-gray-900 dark:text-white ${sprint.textColor}`}>
                {sprint.rate}%
              </span>
            </div>
            <div className="mx-10 h-2.5 bg-gray-400 dark:bg-zinc-800/50 rounded-full overflow-hidden transition-colors">
              <div
                className={`h-full bg-blue-500 rounded-full transition-all duration-500 ease-out ${sprint.color}`}
                style={{ width: `${sprint.rate}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SprintSuccessRate;