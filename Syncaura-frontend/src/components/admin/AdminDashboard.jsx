import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import { motion } from "framer-motion";
import StatCard from "./admindashboard/statCard";
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
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [totalUsers, setTotalUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.get("/projects"), api.get("/tasks"), api.get("/notifications", { params: { limit: 5 } }), api.get("/users/all")])
      .then(([projectsResponse, tasksResponse, notificationsResponse, usersResponse]) => {
        setProjects(Array.isArray(projectsResponse.data) ? projectsResponse.data : []);
        setTasks(Array.isArray(tasksResponse.data) ? tasksResponse.data : []);
        setNotifications(notificationsResponse.data?.data || []);
        setTotalUsers(Array.isArray(usersResponse.data) ? usersResponse.data.length : null);
      })
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load admin dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const completedProjects = projects.filter((project) => String(project.status || "").toUpperCase() === "COMPLETED").length;
  const activeProjects = projects.filter((project) => String(project.status || "").toUpperCase() !== "COMPLETED").length;
  const delayedProjects = projects.filter((project) => tasks.some((task) => task.project_id === project.id && task.status !== "DONE" && task.deadline && new Date(task.deadline) < new Date())).length;
  return (
    <div className="overflow-x-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
      >
        <motion.div variants={item}>
          <StatCard title="TOTAL PROJECTS" value={loading ? "..." : projects.length} icon={<FaFolder />} iconBg="bg-blue-50 dark:bg-cyan-950/30" iconColor="text-blue-500 dark:text-cyan-400" percent="" percentBg="bg-green-50 dark:bg-green-900/20" percentColor="text-green-600 dark:text-green-500" />
        </motion.div>
        {/* ... baki StatCards wese hi rahenge ... */}
        <motion.div variants={item}>
          <StatCard title="ACTIVE" value={loading ? "..." : activeProjects} icon={<FaCirclePlay />} iconBg="bg-blue-50 dark:bg-cyan-950/30" iconColor="text-blue-500 dark:text-cyan-400" percent="" percentBg="bg-gray-100 dark:bg-zinc-800" percentColor="text-gray-500 dark:text-zinc-400" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="DELAYED" value={loading ? "..." : delayedProjects} icon={<FaExclamationTriangle />} iconBg="bg-orange-50 dark:bg-red-950/20" iconColor="text-orange-500 dark:text-red-500" percent="" percentBg="bg-orange-100 dark:bg-transparent" percentColor="text-orange-600 dark:text-red-600" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="COMPLETED" value={loading ? "..." : completedProjects} icon={<FaCheckCircle />} iconBg="bg-green-50 dark:bg-green-950/20" iconColor="text-green-600 dark:text-green-500" percent="" percentBg="bg-green-50 dark:bg-green-900/20" percentColor="text-green-600 dark:text-green-500" />
        </motion.div>
        <motion.div variants={item}>
          <StatCard title="TOTAL USERS" value={loading ? "..." : (totalUsers ?? "N/A")} icon={<LuUsers />} iconBg="bg-purple-50 dark:bg-purple-950/20" iconColor="text-purple-500" percent="" percentBg="bg-green-50 dark:bg-green-900/20" percentColor="text-green-600 dark:text-green-500" />
        </motion.div>
      </motion.div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 gap-6">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <motion.div variants={item} initial="hidden" animate="show"><ProjectStatus projects={projects} tasks={tasks} loading={loading} /></motion.div>
        <motion.div variants={item} initial="hidden" animate="show"><ProjectRisks projects={projects} tasks={tasks} loading={loading} /></motion.div>
        <motion.div variants={item} initial="hidden" animate="show"><ProductivityTrend /></motion.div>
        <motion.div variants={item} initial="hidden" animate="show"><SprintSuccessRate /></motion.div>
        <motion.div variants={item} initial="hidden" animate="show"><ResourceUtilization /></motion.div>
        <motion.div variants={item} initial="hidden" animate="show"><BudgetUsage /></motion.div>
        <motion.div variants={item} initial="hidden" animate="show"><IssuesAndAlerts notifications={notifications} loading={loading} /></motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;