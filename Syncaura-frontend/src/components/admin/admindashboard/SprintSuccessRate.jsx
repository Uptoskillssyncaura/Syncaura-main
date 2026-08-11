import React from "react";
import { useTranslation } from "react-i18next";

const SprintSuccessRate = () => {
  const { t } = useTranslation();
  const sprintData = [
    { name: t("admin_sprint_24"), rate: 92, color: "dark:bg-[#39ff14] dark:shadow-[0_0_10px_#39ff14]", textColor: "dark:text-[#39ff14]" },
    { name: t("admin_sprint_23"), rate: 85, color: "dark:bg-[#00f2ff] dark:shadow-[0_0_10px_#00f2ff]", textColor: "dark:text-[#00f2ff]" },
    { name: t("admin_sprint_22"), rate: 78, color: "dark:bg-[#bf00ff] dark:shadow-[0_0_10px_#bf00ff]", textColor: "dark:text-[#bf00ff]" },
    { name: t("admin_sprint_21"), rate: 95, color: "dark:bg-[#39ff14] dark:shadow-[0_0_10px_#39ff14]", textColor: "dark:text-[#39ff14]" },
  ];

  return (
    <div className="bg-white dark:bg-[#161616] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4 mt-6 transition-colors duration-300">

      <h2 className="text-2xl font-bold  text-black dark:text-white mb-6 transition-colors">
        {t("admin_sprint_success_rate")}
      </h2>
      <div className="flex flex-col gap-1"> 
        {sprintData.map((sprint, index) => (
          <div key={index} className="w-full mb-4">
            <div className="flex justify-between items-center  mx-10">
              <span className="text-l font-bold text-gray-900 dark:text-gray-300 dark:font-semibold">
                {sprint.name}
              </span>
              <span className={`text-l font-bold text-gray-900 ${sprint.textColor}`}>
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