import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { GiCheckedShield } from "react-icons/gi";
import { FiServer } from "react-icons/fi";
import { AiOutlineHistory } from "react-icons/ai";
import { IoCloud } from "react-icons/io5";
import { FiClock } from "react-icons/fi";

const IssuesAndAlerts = () => {
  const { t } = useTranslation();

  const alerts = [
    {
      title: t("admin_alert_unauthorized"),
      subtitle: t("admin_alert_ip"),
      time: t("admin_time_2_mins"),
      icon: <GiCheckedShield className="text-red-500 dark:text-[#ff4d4d] text-2xl dark:drop-shadow-[0_0_5px_#ff4d4d]" />,
    },
    {
      title: t("admin_alert_server_load"),
      subtitle: t("admin_alert_cluster"),
      time: t("admin_time_15_mins"),
      icon: <FiServer className="text-orange-500 dark:text-[#ffd700] text-2xl dark:drop-shadow-[0_0_5px_#ffd700]" />,
    },
    {
      title: t("admin_alert_patch"),
      subtitle: t("admin_alert_patch_version"),
      time: t("admin_time_1_hour"),
      icon: <AiOutlineHistory className="text-blue-500 dark:text-[#00f2ff] text-2xl dark:drop-shadow-[0_0_5px_#00f2ff]" />,
    },
    {
      title: t("admin_alert_backup"),
      subtitle: t("admin_alert_success"),
      time: t("admin_time_4_hours"),
      icon: <IoCloud className="text-gray-600 dark:text-gray-400 text-2xl" />,
    },
  ];

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
        {t("admin_issues_alerts_title")}
      </h2>

      <motion.div
        className="flex items-stretch gap-4 w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >

        {alerts.map((alert, index) => (

          <motion.div
            key={index}
            variants={card}
            whileHover={{ y: -4, scale: 1.02 }}
            className="flex-1 min-w-0 p-4 rounded-xl bg-blue-50/40 dark:bg-[#161b22] border border-transparent dark:border-zinc-800/50 flex items-center gap-4 hover:shadow-md transition"
          >

            <div className="shrink-0">
              {alert.icon}
            </div>

            <div className="flex-1 min-w-0">

              <h3 className="text-[15px] font-bold text-gray-800 dark:text-white truncate leading-tight">
                {alert.title}
              </h3>

              <div className="flex justify-between items-center mt-1 text-[12px] text-gray-400 font-medium">

                <span className="truncate mr-2 dark:text-gray-500">
                  {alert.subtitle}
                </span>

                <div className="flex items-center gap-1 shrink-0 dark:text-gray-500">
                  <FiClock size={12} />
                  <span>{alert.time}</span>
                </div>

              </div>

            </div>

          </motion.div>

        ))}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="shrink-0 bg-gray-100 dark:bg-[#161b22] hover:bg-gray-200 dark:hover:bg-zinc-800 px-4 rounded-xl text-[13px] font-bold text-gray-500 dark:text-white border border-gray-200 dark:border-zinc-800 transition"
        >
          {t("admin_view_all").split(" ").join("\n")}
        </motion.button>

      </motion.div>

    </motion.div>
  );
};

export default IssuesAndAlerts;