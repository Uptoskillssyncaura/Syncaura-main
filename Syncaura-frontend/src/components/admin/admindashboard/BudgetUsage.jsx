import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const BudgetUsage = () => {
  const data = [];

  return (
    <div className="bg-white dark:bg-[#161616] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8 mt-6 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-8">Budget Usage</h2>

      <div className="flex items-center gap-16">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {/* Consumed Part: Shadow sirf dark mode mein trigger hogi */}
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
          <span className="text-sm font-bold text-gray-400">Unavailable</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-20">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-400 mb-2">Allocated</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">N/A</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-400 mb-2">Remaining</p>
            {/* Text color conditional with Tailwind */}
            <p className="text-2xl font-bold text-blue-500 dark:text-[#00f2ff] transition-colors">N/A</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetUsage;