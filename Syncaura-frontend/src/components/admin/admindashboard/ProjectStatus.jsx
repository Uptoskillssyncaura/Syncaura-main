import React from "react";
import { useTranslation } from "react-i18next";

const ProjectStatus = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-[#161616] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
      <div className="p-4 border-b border-gray-50 dark:border-zinc-800/50">
        <h2 className="text-xl text-black font-bold dark:text-white dark:font-semibold">{t("admin_project_status_title")}</h2>
      </div>
      
      <div className="p-10">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="text-5xl font-extrabold text-black dark:text-white dark:font-bold">42</span>
          <span className="text-2xl font-semibold text-gray-700 dark:text-gray-500 dark:font-medium">{t("admin_project_status_total_projects")}</span>
        </div>
        <div className="w-full h-3 flex overflow-hidden rounded-full mb-10 bg-gray-100 dark:bg-zinc-800">
          <div 
            className="h-full bg-[#1e88e5] dark:bg-[#00f2ff] dark:shadow-[0_0_10px_#00f2ff]" 
            style={{ width: "28.5%" }}
          ></div>
          <div 
            className="h-full bg-[#f44336] dark:bg-[#ff4d4d]" 
            style={{ width: "7.1%" }}
          ></div>
          <div 
            className="h-full bg-[#1b8e4c] dark:bg-[#39ff14] dark:shadow-[0_0_10px_#39ff14]" 
            style={{ width: "64.4%" }}
          ></div>
        </div>
        <div className="flex flex-wrap items-center mx-13 gap-28">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#1e88e5] dark:bg-[#00f2ff] dark:shadow-[0_0_8px_#00f2ff]"></div>
            <span className="text-l font-bold text-black dark:text-white dark:text-l dark:font-medium whitespace-nowrap">
              {t("admin_project_status_active", { count: 12 })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#f44336] dark:bg-[#ff4d4d] dark:shadow-[0_0_8px_#ff4d4d]"></div>
            <span className="text-l font-bold  text-black dark:text-white dark:text-l dark:font-medium whitespace-nowrap">
              {t("admin_project_status_delayed", { count: 3 })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#1b8e4c] dark:bg-[#39ff14] dark:shadow-[0_0_8px_#39ff14]"></div>
            <span className="text-l font-bold  text-black dark:text-white dark:text-l dark:font-medium whitespace-nowrap">
              {t("admin_project_status_completed", { count: 27 })}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectStatus;