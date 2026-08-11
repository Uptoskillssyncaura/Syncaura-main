import React from "react";
import { useTranslation } from "react-i18next";

const ResourceUtilization = () => {
  const { t } = useTranslation();
  const resourceData = [
    { 
      name: t("admin_resource_design"), 
      rate: 85, 
      color: "bg-indigo-500", 
      darkColor: "dark:bg-[#bf00ff] dark:shadow-[0_0_10px_#bf00ff]" 
    },
    { 
      name: t("admin_resource_dev"),
      rate: 94, 
      color: "bg-blue-500", 
      darkColor: "dark:bg-[#00f2ff] dark:shadow-[0_0_10px_#00f2ff]" 
    },
    { 
      name: t("admin_resource_qa"),
      rate: 60, 
      color: "bg-green-500", 
      darkColor: "dark:bg-[#39ff14] dark:shadow-[0_0_10px_#39ff14]" 
    },
    { 
      name: t("admin_resource_product"),
      rate: 72, 
      color: "bg-orange-500", 
      darkColor: "dark:bg-[#ff4d4d] dark:shadow-[0_0_10px_#ff4d4d]" 
    },
  ];

  return (
    <div className="bg-white dark:bg-[#161616] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4 mt-6 transition-colors duration-300">
      <h2 className="text-2xl font-bold  text-black dark:text-white mb-10 transition-colors">
        {t("admin_resource_utilization")}
      </h2>

      <div className="space-y-4 px-10">
        {resourceData.map((item, index) => (
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