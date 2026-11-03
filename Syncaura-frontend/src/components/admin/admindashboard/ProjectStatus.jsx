import React from "react";

const ProjectStatus = ({ projects = [], tasks = [], loading = false }) => {
  const total = projects.length;
  const completed = projects.filter((project) => String(project.status || "").toUpperCase() === "COMPLETED").length;
  const delayed = projects.filter((project) => tasks.some((task) => task.project_id === project.id && task.status !== "DONE" && task.deadline && new Date(task.deadline) < new Date())).length;
  const active = Math.max(0, total - completed - delayed);
  const percentage = (value) => total ? `${(value / total) * 100}%` : "0%";
  return (
    <div className="bg-white dark:bg-[#161616] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
      <div className="p-4 border-b border-gray-50 dark:border-zinc-800/50">
        <h2 className="text-xl text-black font-bold dark:text-white dark:font-semibold">Project Status</h2>
      </div>
      
      <div className="p-10">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="text-5xl font-extrabold text-black dark:text-white dark:font-bold">{loading ? "..." : total}</span>
          <span className="text-2xl font-semibold text-gray-700 dark:text-gray-500 dark:font-medium">Total Projects</span>
        </div>
        <div className="w-full h-3 flex overflow-hidden rounded-full mb-10 bg-gray-100 dark:bg-zinc-800">
          <div 
            className="h-full bg-[#1e88e5] dark:bg-[#00f2ff] dark:shadow-[0_0_10px_#00f2ff]" 
            style={{ width: percentage(active) }}
          ></div>
          <div 
            className="h-full bg-[#f44336] dark:bg-[#ff4d4d]" 
            style={{ width: percentage(delayed) }}
          ></div>
          <div 
            className="h-full bg-[#1b8e4c] dark:bg-[#39ff14] dark:shadow-[0_0_10px_#39ff14]" 
            style={{ width: percentage(completed) }}
          ></div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#1e88e5] dark:bg-[#00f2ff] dark:shadow-[0_0_8px_#00f2ff]"></div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
              Active ({loading ? "..." : active})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#f44336] dark:bg-[#ff4d4d] dark:shadow-[0_0_8px_#ff4d4d]"></div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
              Delayed ({loading ? "..." : delayed})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#1b8e4c] dark:bg-[#39ff14] dark:shadow-[0_0_8px_#39ff14]"></div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
              Completed ({loading ? "..." : completed})
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectStatus;