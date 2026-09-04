import React from "react";
import { motion } from "framer-motion";
import { GiCheckedShield } from "react-icons/gi";
import { FiClock } from "react-icons/fi";

const IssuesAndAlerts = ({ notifications = [], loading = false }) => {

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const card = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="bg-white dark:bg-[#0d1117] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800/50 p-6 mt-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >

      <h2 className="text-2xl font-bold text-zinc-500 dark:text-white mb-6 px-2">
        Issues & Alerts
      </h2>

      <motion.div
        className="flex flex-wrap items-stretch gap-4 w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >

        {loading && <p className="text-sm text-gray-500">Loading alerts...</p>}
        {!loading && notifications.length === 0 && <p className="text-sm text-gray-500">No alerts found.</p>}
        {!loading && notifications.map((notification) => (

          <motion.div
            key={notification.id || notification._id}
            variants={card}
            whileHover={{ y: -4, scale: 1.02 }}
            className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] min-w-0 p-4 rounded-xl bg-blue-50/40 dark:bg-[#161b22] border border-transparent dark:border-zinc-800/50 flex items-center gap-4 hover:shadow-md transition"
          >

            <div className="shrink-0">
              <GiCheckedShield className="text-blue-500 dark:text-[#00f2ff] text-2xl" />
            </div>

            <div className="flex-1 min-w-0">

              <h3 className="text-[15px] font-bold text-gray-800 dark:text-white truncate leading-tight">
                  {notification.title}
              </h3>

              <div className="flex justify-between items-center mt-1 text-[12px] text-gray-400 font-medium">

                <span className="truncate mr-2 dark:text-gray-500">
                  {notification.message}
                </span>

                <div className="flex items-center gap-1 shrink-0 dark:text-gray-500">
                  <FiClock size={12} />
                  <span>{notification.created_at ? new Date(notification.created_at).toLocaleString() : ""}</span>
                </div>

              </div>

            </div>

          </motion.div>

        ))}

        {!loading && notifications.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 bg-gray-100 dark:bg-[#161b22] hover:bg-gray-200 dark:hover:bg-zinc-800 px-4 py-2 rounded-xl text-[13px] font-bold text-gray-500 dark:text-white border border-gray-200 dark:border-zinc-800 transition"
          >
            View All
          </motion.button>
        )}

      </motion.div>

    </motion.div>
  );
};

export default IssuesAndAlerts;