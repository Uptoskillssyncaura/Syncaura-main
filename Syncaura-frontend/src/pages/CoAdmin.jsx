import { useState } from "react";
import DashboardSection from "../components/coadmin/Dashboardsection";
import ProjectsSection from "../components/coadmin/Projectssection";
import AnalyticsSection from "../components/coadmin/Analyticssection";

const TABS = ["Dashboard", "Projects", "Analytics"];

export default function CoAdmin() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-black min-h-[100vh] font-sans">
      {/* ── Page Header ── */}
      <div className="px-7 py-5 bg-white dark:bg-[#1c1c1e] border-b border-slate-100 dark:border-slate-800 flex items-center gap-6">
        <h1 className="text-[24px] font-bold text-[#1e293b] dark:text-white m-0 tracking-tight">
          DashBoard
        </h1>

        {/* Tabs — bordered pill container matching Figma */}
        <div className="flex border-[1.5px] border-[#e2e8f0] dark:border-slate-700 rounded-full overflow-hidden p-[2px] bg-white dark:bg-slate-900">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn-hover px-5 py-[5px] border-none rounded-full text-[13px] whitespace-nowrap cursor-pointer ${isActive
                  ? "font-semibold text-blue-600 dark:text-[#73FBFD] bg-[#f0f4ff] dark:bg-slate-800"
                  : "font-medium text-[#64748b] dark:text-slate-400 bg-transparent hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 px-7 py-6 overflow-y-auto bg-white dark:bg-black">
        {activeTab === "Projects" && <ProjectsSection />}
        {activeTab === "Dashboard" && <DashboardSection />}
        {activeTab === "Analytics" && <AnalyticsSection />}
      </div>
    </div>
  );
}