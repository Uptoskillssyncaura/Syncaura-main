import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import StatCard from "./admindashboard/StatCard";
import ProjectStatus from "./admindashboard/ProjectStatus";
import ProjectRisks from "./admindashboard/ProjectRisks";
import ProductivityTrend from "./admindashboard/ProductivityTrend";
import SprintSuccessRate from "./admindashboard/SprintSuccessRate";
import ResourceUtilization from "./admindashboard/ResourceUtilization";
import BudgetUsage from "./admindashboard/BudgetUsage";
import IssuesAndAlerts from "./admindashboard/IssuesAndAlerts";

import { FaFolder, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";
import { LuUsers } from "react-icons/lu";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const AdminDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
      >
        <motion.div variants={item}>
          <StatCard title={t("admin_stat_total_projects")} value="42" icon={<FaFolder />} iconBg="bg-blue-50 dark:bg-cyan-950/30" iconColor="text-blue-500 dark:text-cyan-400" percent="5%" percentBg="bg-green-50 dark:bg-green-900/20" percentColor="text-green-600 dark:text-green-500" />
        </motion.div>
        {/* ... baki StatCards wese hi rahenge ... */}
        <motion.div variants={item}>
          <StatCard title={t("admin_stat_active")} value="12" icon={<FaCirclePlay />} iconBg="bg-blue-50 dark:bg-cyan-950/30" iconColor="text-blue-500 dark:text-cyan-400" percent="0%" percentBg="bg-gray-100 dark:bg-zinc-800" percentColor="text-gray-500 dark:text-zinc-400" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title={t("admin_stat_delayed")} value="3" icon={<FaExclamationTriangle />} iconBg="bg-orange-50 dark:bg-red-950/20" iconColor="text-orange-500 dark:text-red-500" percent={t("admin_high_risk")} percentBg="bg-orange-100 dark:bg-transparent" percentColor="text-orange-600 dark:text-red-600" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title={t("admin_stat_completed")} value="27" icon={<FaCheckCircle />} iconBg="bg-green-50 dark:bg-green-950/20" iconColor="text-green-600 dark:text-green-500" percent="5%" percentBg="bg-green-50 dark:bg-green-900/20" percentColor="text-green-600 dark:text-green-500" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title={t("admin_stat_total_users")} value="128" icon={<LuUsers />} iconBg="bg-purple-50 dark:bg-purple-950/20" iconColor="text-purple-500" percent="12%" percentBg="bg-green-50 dark:bg-green-900/20" percentColor="text-green-600 dark:text-green-500" />
        </motion.div>
      </motion.div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div variants={item} initial="hidden" animate="show"><ProjectStatus /></motion.div>
        <motion.div variants={item} initial="hidden" animate="show"><ProjectRisks /></motion.div>
        <motion.div variants={item} initial="hidden" animate="show"><ProductivityTrend /></motion.div>
        <motion.div variants={item} initial="hidden" animate="show"><SprintSuccessRate /></motion.div>
        <motion.div variants={item} initial="hidden" animate="show"><ResourceUtilization /></motion.div>
        <motion.div variants={item} initial="hidden" animate="show"><BudgetUsage /></motion.div>
        <motion.div variants={item} initial="hidden" animate="show"><IssuesAndAlerts /></motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;