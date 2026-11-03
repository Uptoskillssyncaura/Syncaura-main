import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const BudgetUsage = () => {
  const data = [];

  return (
    <div className="bg-white dark:bg-[#161616] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-8 mt-6 transition-colors duration-300">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Budget Usage</h2>

      <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-14">
        <div className="relative w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {/* Consumed Part */}
                <Cell 
                  fill="var(--budget-chart-color)" 
                  className="dark:drop-shadow-[0_0_8px_var(--budget-chart-color)] transition-all duration-300" 
                />
                
                {/* Remaining Track */}
                <Cell 
                  fill="currentColor" 
                  className="text-gray-100 dark:text-[#262626] transition-colors duration-300" 
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Unavailable</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-10 sm:gap-14">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">Allocated</p>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-lg border border-gray-200 dark:border-zinc-700/60 inline-block">N/A</span>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">Remaining</p>
            <span className="text-sm font-bold text-blue-600 dark:text-[#73FBFD] bg-blue-50 dark:bg-cyan-950/40 px-3 py-1 rounded-lg border border-blue-100 dark:border-cyan-800/50 inline-block">N/A</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetUsage;