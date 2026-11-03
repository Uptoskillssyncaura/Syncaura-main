import React from "react";
import { motion } from "framer-motion";

const ProjectRisks = ({ projects = [], tasks = [], loading = false }) => {
  const data = projects.map((project) => {
    const overdue = tasks.filter((task) => task.project_id === project.id && task.status !== "DONE" && task.deadline && new Date(task.deadline) < new Date()).length;
    return overdue ? { name: project.name, risk: `${overdue} overdue task${overdue === 1 ? "" : "s"}`, owner: "Project team", initials: "PT", avatarColor: "bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-white", severity: overdue > 2 ? "High" : "Medium", sevColor: overdue > 2 ? "text-red-600 bg-red-50 border-red-100 dark:bg-transparent dark:border-red-600 dark:text-red-500" : "text-yellow-600 bg-yellow-50 border-yellow-100 dark:bg-transparent dark:border-yellow-600 dark:text-yellow-500" } : null;
  }).filter(Boolean);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const row = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (

    <motion.div
      className="bg-white dark:bg-[#0d1117] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 mt-6 overflow-hidden transition-colors duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >

      {/* Header */}
      <div className="p-4 px-6 flex justify-between items-center border-b border-gray-100 dark:border-zinc-800/50">

        <h2 className="text-2xl font-bold  text-black dark:text-white">
          Project Risks
        </h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xl font-bold text-gray-900 dark:text-[#00a3ff]"
        >
          View All
        </motion.button>

      </div>

      {/* Table */}
      <div className="overflow-hidden">

        <table className="w-full text-left">

          <thead>
            <tr className="bg-gray-50/50 dark:bg-[#161b22] text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-400 border-b border-gray-100 dark:border-zinc-800">
              <th className="py-3.5 px-6">Project Name</th>
              <th className="py-3.5 px-6">Risk Description</th>
              <th className="py-3.5 px-6">Owner</th>
              <th className="py-3.5 pr-20 text-right">Severity</th>
            </tr>
          </thead>

          <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
            className="divide-y divide-gray-100 dark:divide-zinc-800/50"
          >

            {loading && <tr><td colSpan="4" className="p-6 text-center text-gray-500">Loading risks...</td></tr>}
            {!loading && data.length === 0 && <tr><td colSpan="4" className="p-6 text-center text-gray-500">No project risks found.</td></tr>}
            {!loading && data.map((item) => (

              <motion.tr
                key={item.name}
                variants={row}
                whileHover={{ scale: 1.01 }}
                className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/20 transition-colors"
              >

                <td className="py-4 px-6 text-sm text-black dark:text-gray-300">
                  {item.name}
                </td>

                <td className="py-4 px-6 text-sm text-black dark:text-gray-400">
                  {item.risk}
                </td>

                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${item.avatarColor}`}>
                      {item.initials}
                    </div>

                    <span className="text-sm text-black dark:text-gray-300">
                      {item.owner}
                    </span>

                  </div>
                </td>

                <td className="py-4 pr-20 text-right">
                  <span className={`px-3 py-0.5 rounded-full text-[12px] font-medium border ${item.sevColor}`}>
                    {item.severity}
                  </span>
                </td>

              </motion.tr>

            ))}

          </motion.tbody>

        </table>

      </div>

    </motion.div>
  );
};

export default ProjectRisks;