import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dot, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function RecentActivity({ notices = [] }) {
  const { t } = useTranslation();
  const reduxNotices = useSelector((state) => state.notice?.notices || []);
  const activeNotices = notices.length > 0 ? notices : reduxNotices;

  const [showAll, setShowAll] = useState(false);

  const displayItems = activeNotices.map((n) => ({
    id: n.id ?? n._id,
    text: n.title ? `Notice posted: ${n.title}` : n.description,
    category: n.category || "GENERAL",
    creator: n.creator_user_name || n.created_by || "Admin",
    time: formatRelativeTime(n.created_at || n.createdAt),
  }));

  const visibleItems = showAll ? displayItems : displayItems.slice(0, 3);

  return (
    <div className="relative w-full -top-3">
      <div className="bg-white dark:bg-black px-4 sm:px-6 w-full mx-auto">
        <div className="flex items-center justify-between mb-4 pr-0 sm:pr-10">
          <h2 className="font-medium text-[#000000] dark:text-white text-2xl flex items-center gap-2">
            <Bell className="size-5 text-blue-600 dark:text-[#73FBFD]" />
            {t("recent_activity", "Recent Activity")}
          </h2>

          {displayItems.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm px-5 py-2 font-medium rounded-2xl text-[#E3264A] hover:underline bg-[#FEE2E2] dark:bg-[#7F1D1D]/30 btn-hover"
            >
              {showAll ? t("view_less", "View Less") : t("view_all", "View All")}
            </button>
          )}
        </div>

        <div className="overflow-y-auto scrollbar-hide px-2 sm:px-5 md:px-10 rounded-2xl">
          <div className="rounded-2xl border border-[#E0DDDD] dark:border-[#2d2f33] flex flex-col gap-0.5 overflow-hidden">
            {displayItems.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-400">
                No recent activity to display.
              </div>
            ) : (
              <AnimatePresence>
                {visibleItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start hover:bg-blue-50/60 dark:hover:bg-[#1f2023] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full px-4 py-2.5 gap-2">
                      <div className="flex items-center justify-start gap-2 min-w-0">
                        <Dot className="size-8 text-[#29CC39] flex-shrink-0" />
                        <span className="text-sm md:text-base font-semibold text-[#000000] dark:text-[#FFFFFF] truncate">
                          {item.text}
                        </span>
                        {item.category && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-[#73FBFD] border border-blue-200 dark:border-blue-900/50 flex-shrink-0">
                            {item.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 pl-6 sm:pl-0">
                        {item.creator && <span>By {item.creator}</span>}
                        <span>•</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
