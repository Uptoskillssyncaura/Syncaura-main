import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatusBar from "./StatusBar";
import StatusLegend from "./StatusLegend";

export default function TaskStatusDistribution({ 
  task = [], 
  title = "Task Status Distribution", 
  showTotal = true, 
  percentage = false,
  // Added titleColor prop with a default value of grey
  titleColor = "text-[#6E7184] dark:text-white" 
}) {
  const { t } = useTranslation();
  const resolvedTitle = title === "Task Status Distribution" ? t("task_status_distribution_default") : title;
  const total = percentage ? null : task.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="w-full bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-none rounded-xl p-6 shadow-sm">
      <div className="flex flex-col w-full gap-6">
        
        {/* Header Section */}
        <div className="flex items-start justify-between">
          {/* Use the titleColor variable here instead of the hardcoded class */}
          <h1 className={`${titleColor} font-bold text-xl sm:text-2xl`}>
            {resolvedTitle}
          </h1>
          
          <div className="flex items-end gap-2">
            {showTotal && (
              <p className="text-xs xsm:text-sm font-bold text-[#000000] dark:text-gray-300">
                {total} {t("task_status_distribution_active", { defaultValue: "Active Tasks" })}
              </p>
            )}
            <StatusLegend data={task} />
          </div>
        </div>

        {/* ... rest of the component stays the same ... */}
        <div className="w-full">
          <StatusBar data={task} total={total} />
        </div>

        {!showTotal && (
          <div className="flex items-center justify-between w-full mt-1">
            <h1 className="text-xs sm:text-base text-[#4B6280] dark:text-gray-400 font-normal">
              {t("task_status_distribution_velocity", { defaultValue: "Velocity compared to last week" })}
            </h1>
            <div className="flex items-center justify-center gap-1 px-2 py-1 rounded-xl bg-[#F0FDF4] dark:bg-green-900/20">
              <TrendingUp className="size-4 text-[#00A449] dark:text-green-400" />
              <p className="text-[#00A449] dark:text-green-400 text-xs font-semibold">+12%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}