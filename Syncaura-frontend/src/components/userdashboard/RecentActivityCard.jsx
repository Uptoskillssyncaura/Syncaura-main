import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Check, GitPullRequest, MessageSquareText } from "lucide-react";

const RecentActivityCard = () => {
  const { t } = useTranslation();

  const activities = [
  {
    icon: <GitPullRequest className="w-5 h-5" />,
    title: (
      <>
        <span className="font-semibold">{t("recent_activity_pr_merged")}</span>
      </>
    ),
    time: t("recent_activity_time_2h"),
    color: "bg-blue-500",
  },
  {
    icon: <Check className="w-5 h-5" />,
    title: (
      <>
        <span className="font-semibold">{t("recent_activity_completed_task")}</span>
      </>
    ),
    time: t("recent_activity_time_5h"),
    color: "bg-green-500",
  },
  {
    icon: <MessageSquareText className="w-5 h-5" />,
    title: (
      <>
        <span className="font-semibold">{t("recent_activity_sarah_commented")}</span>
      </>
    ),
    time: t("recent_activity_time_yesterday"),
    color: "bg-gray-400",
  },
];

  return (
    <div
      className="
        w-full
        p-5
        rounded-2xl
        bg-white
        dark:bg-[#1E1E1E]
        shadow-[0_0_12px_#00000020]
        dark:shadow-[0_0_12px_#00000080]
      "
    >
      {/* Title */}
      <h2 className="text-[#64748B] dark:text-gray-200 font-bold text-xl sm:text-2xl mb-6">
        {t("recent_activity_title")}
      </h2>

      <div className="relative flex flex-col gap-6">

        {/* Timeline Line */}
        <span
          className="
            absolute left-4 top-0
            h-full w-[2px]
            bg-[#E3E5EA] dark:bg-[#2A2A2A]
          "
        />

        {activities.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="flex items-start gap-4 relative"
          >
            {/* Icon */}
            <div
              className={`
                w-9 h-9
                rounded-full
                flex items-center justify-center
                text-white
                ${item.color}
                z-10
              `}
            >
              {item.icon}
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <div className="text-[#64748B] dark:text-gray-200 text-sm">
                {item.title}
              </div>

              <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                {item.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityCard;