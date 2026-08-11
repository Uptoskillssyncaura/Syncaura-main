import { useTranslation } from "react-i18next";
import { Folder, MessageSquare, CheckSquare, Clock } from "lucide-react";

// Map stats to icons
const iconMap = {
  projects: Folder,
  messages: MessageSquare,
  tasks: CheckSquare,
  requests: Clock,
};

// Map colors for light/dark mode
const colorMap = {
  blue: {
    iconBgLight: "bg-blue-500/10",
    iconBgDark: "bg-blue-800/20",
    iconColor: "text-blue-500",
    subtitleLight: "text-blue-500",
    subtitleDark: "text-blue-400",
  },
  green: {
    iconBgLight: "bg-green-500/10",
    iconBgDark: "bg-green-800/20",
    iconColor: "text-green-500",
    subtitleLight: "text-green-500",
    subtitleDark: "text-green-400",
  },
  orange: {
    iconBgLight: "bg-orange-500/10",
    iconBgDark: "bg-orange-800/20",
    iconColor: "text-orange-500",
    subtitleLight: "text-orange-500",
    subtitleDark: "text-orange-400",
  },
  purple: {
    iconBgLight: "bg-purple-500/10",
    iconBgDark: "bg-purple-800/20",
    iconColor: "text-purple-500",
    subtitleLight: "text-purple-500",
    subtitleDark: "text-purple-400",
  },
};

const AdminStats = ({ isDark }) => {
  const { t } = useTranslation();

  // Stats data
  const stats = [
    { title: t("admin_stats_active_projects"), value: "08", note: t("admin_stats_2_due_week"), iconType: "projects", color: "blue" },
    { title: t("admin_stats_unread_messages"), value: "12", note: t("admin_stats_4_chats_pending"), iconType: "messages", color: "green" },
    { title: t("admin_stats_tasks_due_today"), value: "12", note: t("admin_stats_3_high_priority"), iconType: "tasks", color: "orange" },
    { title: t("admin_stats_pending_requests"), value: "06", note: t("admin_stats_requires_approval"), iconType: "requests", color: "purple" },
  ];

  return (
    <div className="ml-9 grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((item, i) => {
        const Icon = iconMap[item.iconType];
        const colors = colorMap[item.color];

        return (
          <div
            key={i}
            className={`
              group w-full h-[187px] rounded-[9px] 
              ${isDark ? "bg-[#0F172A] border-white/10" : "bg-white border-black/5"}
              shadow-[0px_4px_4px_5px_rgba(0,0,0,0.25)]
              transition-all duration-200 ease-out
              hover:-translate-y-1 hover:shadow-[0px_12px_24px_rgba(0,0,0,0.18)]
              flex justify-between p-[18px] 
            `}
          >
            {/* LEFT CONTENT */}
            <div className="flex flex-col">
              <p className={`mt-4 font-poppins text-[12px] font-medium ${isDark ? "text-[#94A3B8]" : "text-[#94A3B8]"}`}>
                {item.title}
              </p>
              <p className={`mt-[37px] font-poppins font-semibold text-[24px] ${isDark ? "text-[#F1F5F9]" : "text-[#020617]"}`}>
                {item.value}
              </p>
              <p className={`mt-[27px] font-poppins font-semibold text-[12px] ${isDark ? colors.subtitleDark : colors.subtitleLight}`}>
                {item.note}
              </p>
            </div>

            {/* ICON */}
            <div
              className={`
                h-[48px] w-[48px] rounded-[12px] flex items-center justify-center
                ${isDark ? colors.iconBgDark : colors.iconBgLight}
                group-hover:scale-110 transition-transform duration-200 ease-out
              `}
            >
              <Icon className={`h-[22px] w-[22px] ${colors.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;
