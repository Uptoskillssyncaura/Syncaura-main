import React from "react";
import { motion } from "framer-motion";
import { Check, ClipboardList } from "lucide-react";

const RecentActivityCard = ({ tasks = [], loading = false }) => {
  const activities = tasks
    .filter((task) => task.updated_at || task.created_at)
    .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
    .slice(0, 5)
    .map((task) => ({
      id: task.id,
      icon: task.status === "DONE" ? <Check className="w-5 h-5" /> : <ClipboardList className="w-5 h-5" />,
      title: task.status === "DONE" ? `Completed task: ${task.title}` : `Updated task: ${task.title}`,
      time: new Date(task.updated_at || task.created_at).toLocaleString(),
      color: task.status === "DONE" ? "bg-green-500" : "bg-blue-500",
    }));

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
        Recent Activity
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

        {loading && <p className="pl-14 text-sm text-gray-500 dark:text-gray-400">Loading activity...</p>}
        {!loading && activities.length === 0 && <p className="pl-14 text-sm text-gray-500 dark:text-gray-400">No recent activity.</p>}
        {!loading && activities.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
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