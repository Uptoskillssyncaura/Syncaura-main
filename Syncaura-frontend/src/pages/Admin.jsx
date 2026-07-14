import React, { useState } from "react";
import AdminDashboard from "../components/admin/adminDashboard.jsx";
import ProjectsPage from "../components/admin/adminprojectdashboard/ProjectsPage.jsx";
import AnalyticsSection from "../components/admin/adminanalyticaldashboard/AnalyticsSection.jsx";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "projects", label: "Projects" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
     {/* Top Navbar - Border hatane ke baad */}
    <div className="bg-white dark:bg-black px-8 py-4 flex items-center gap-8 transition-colors duration-300">
        {/* Title */}
        <h1 className="text-xl font-bold text-black dark:text-white tracking-wide whitespace-nowrap">
          DashBoard
        </h1>

        {/* Tab Switcher */}
        <div className="flex border-[1.5px] border-[#e2e8f0] dark:border-slate-700 rounded-full overflow-hidden p-[2px] bg-white dark:bg-slate-900">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`btn-hover px-5 py-[5px] border-none rounded-full text-[13px] whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "font-semibold text-blue-600 dark:text-[#73FBFD]"
                    : "font-medium text-[#64748b] dark:text-slate-400 bg-transparent hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Page Content */}
      <div className="p-8 bg-white dark:bg-black">
        {activeTab === "dashboard" && <AdminDashboard />}
        {activeTab === "projects" && <ProjectsPage />}
        {activeTab === "analytics" && <AnalyticsSection />}
      </div>
    </div>
  );
};

export default Admin;