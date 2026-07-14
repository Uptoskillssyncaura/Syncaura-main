import {
  Check,
  CircleAlert,
  ClipboardListIcon,
  EllipsisIcon,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import TopCard from "../TopCard";
import CircularProgress from "../CircularProgress";
import TaskStatusDistribution from "../TaskGraph/TaskStatusDistribution";
import { TASK_STATUS } from "../../../constant/constant";
import SprintContribution from "./Dashboard/SprintContribution";
import { motion, AnimatePresence } from "framer-motion";
import Deadlines from "./Dashboard/Deadlines";
import { IoAlert } from "react-icons/io5";
import RecentActivityCard from "../RecentActivityCard";

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- NEW FUNCTIONAL STATES ---
  const [deadlineFilter, setDeadlineFilter] = useState("ALL");
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, title: "API Documentation", type: "blue", link: "Resume Work →" },
    { id: 2, title: "User Dashboard UI", type: "red", link: "Nudge Designer" },
  ]);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const CONTRIBUTIONS = [
    { id: "dev", title: "DEV", subtitle: "QA", value: 75, lightColor: "bg-[#137FEC]", darkColor: "dark:bg-blue-400" },
    { id: "doc", title: "DOC", subtitle: "UAT", value: 45, lightColor: "bg-[#A1CCF7]", darkColor: "dark:bg-blue-300" },
  ];

  const deadlineTask = [
    { title: "API Auth Bug", status: "HIGH", due: "Due Today, 5:00 PM", bgColor: "bg-[#FEF2F2] dark:bg-[#3A1F1F]", borderColor: "border-[#FCC0C4] dark:border-[#7F1D1D]", titleColor: "text-[#B60000] dark:text-[#FF4D4F]", descColor: "text-[#E76060] dark:text-[#F87171]", statusColor: "bg-[#EF4444]" },
    { title: "UAT Testing", status: "MEDIUM", due: "Tomorrow, 10:00 AM", bgColor: "bg-[#FEFCE8] dark:bg-[#4A3514]", borderColor: "border-[#FFF7A6] dark:border-[#A16207]", titleColor: "text-[#9F5E00] dark:text-[#FBBF24]", descColor: "text-[#DBAE4B] dark:text-[#FCD34D]", statusColor: "bg-[#EAB308]" },
    { title: "Refactor Login", status: "LOW", due: "Apr 24, 2024", bgColor: "bg-[#F6F7F8] dark:bg-[#121212]", borderColor: "border-[#C8E3FE] dark:border-[#2A2A2A]", titleColor: "text-[#000000] dark:text-[#E5E7EB]", descColor: "text-[#8897A5] dark:text-[#9CA3AF]", statusColor: "bg-[#6B7280]" },
  ];

  // --- FILTER LOGIC ---
  const filteredDeadlines = deadlineFilter === "ALL" 
    ? deadlineTask 
    : deadlineTask.filter(task => task.status === deadlineFilter);

  const cardData = [
    { title: "Total Tasks", count: 24, iconData: <ClipboardListIcon className="text-white dark:text-gray-900 fill-blue-600 size-10" /> },
    { title: "Completed", count: 12, iconData: <div className="flex items-center justify-center p-2 rounded-full bg-[#1BC963]"><Check className="size-5 text-white dark:text-gray-900" /></div> },
    { title: "in Progress", count: 8, iconData: <div className="flex items-center justify-center p-2 rounded-full bg-[#FBB309]"><EllipsisIcon className="size-5 text-white dark:text-gray-900" /></div> },
    { title: "Overdue", count: 4, iconData: <CircleAlert className="size-10 text-white dark:text-gray-900 fill-[#EF4444]" /> },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full gap-y-8 overflow-y-auto no-scrollbar min-h-screen py-6 px-4">
      
      {/* 0. Top Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
  {cardData.map((item) => (
    <motion.div
      key={item.title}
      
      whileHover={{ 
        scale: 1.03, 
        y: -5, 
        transition: { duration: 0.2 } 
      }}
      whileTap={{ scale: 0.98 }} 
      className="w-full flex justify-center cursor-pointer group"
    >
      <div className="w-full transition-shadow duration-300 hover:shadow-xl dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)] rounded-xl">
        <TopCard 
          title={item.title} 
          count={item.count} 
          IconData={item.iconData} 
        />
      </div>
    </motion.div>
  ))}
</div>

      {/* 1. Health Status */}
      <div className="flex flex-col w-full gap-4 sm:gap-5 py-4 px-4 sm:px-6 md:px-8 pb-6 sm:pb-10 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2d2f31] shadow-none">
        <div className="flex items-center justify-start w-full">
          <h1 className="text-[#6E7184] dark:text-gray-200 font-bold text-xl sm:text-2xl">Health Status</h1>
        </div>
        <div className="flex flex-col xsm:flex-row items-center md:items-center justify-center md:justify-start w-full gap-6 sm:gap-10 md:gap-20 px-2 sm:px-6 md:px-10 py-2">
          <div className="[--chart-text:#000000] dark:[--chart-text:#FFFFFF]">
            <CircularProgress percentage={60} startAngle={20} size={160} label="PROJECTS" data={12} fontSize={32} textSize={14} textColor="var(--chart-text)" labelColor="#94A3B8" progressColor="#127FEC" trackColor="#E5E7EB" className="text-[#E5E7EB] dark:text-[#2A2A2A]" innerBg="bg-white dark:bg-[#1E1E1E]" />
          </div>
          <div className="flex flex-col items-center md:items-start justify-center gap-2 text-center md:text-left">
            <h1 className="text-[#94A3B8] dark:text-gray-400 font-semibold text-base sm:text-lg">Spiral Goal Progress</h1>
            <div className="flex items-center gap-3">
              <h1 className="text-black dark:text-white font-bold text-xl sm:text-3xl">+5%</h1>
              <div className="flex items-center justify-center px-3 py-1 rounded-full bg-[#ECFDF5] dark:bg-green-900/20 border border-[#D1FAE5]">
                <p className="text-[#10B981] dark:text-green-400 font-bold text-[9px] sm:text-[10px] tracking-wide uppercase">UP FROM LAST WEEK</p>
              </div>
            </div>
            <h1 className="text-[#CBD5E1] dark:text-gray-500 font-medium text-xs sm:text-sm tracking-wide">Target: 80% by Friday</h1>
          </div>
        </div>
      </div>

      {/* 2. Sprint Contribution */}
      <SprintContribution CONTRIBUTIONS={CONTRIBUTIONS} />

      {/* 3. Task Status Distribution */}
      <div className="flex items-center justify-start w-full shadow-[0_0_10px_0_#54545440]">
        <TaskStatusDistribution task={TASK_STATUS} />
      </div>

      {/* 4. Upcoming Deadlines with Filter Functionality */}
      <div className="flex flex-col items-center justify-start w-full gap-y-7 shadow-[0_0_10px_0_#54545440] dark:shadow-[0_0_12px_#00000080] py-4 px-4 sm:px-6 md:px-8 pb-6 sm:pb-10 rounded-xl bg-white dark:bg-[#1E1E1E] border border-transparent dark:border-[#2A2A2A]">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-[#6E7184] dark:text-gray-200 font-bold text-2xl">Upcoming Deadlines</h1>
          <div className="flex items-center gap-4">
            {/* Filter Dropdown/Toggle Simulation */}
            <select 
              className="bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 outline-none"
              onChange={(e) => setDeadlineFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
              <option value="LOW">Low Only</option>
            </select>
            <motion.p whileHover={{ scale: 1.08, x: 6 }} className="text-[#C05328] dark:text-blue-400 text-lg font-medium cursor-pointer hover:underline">View All</motion.p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-start w-full gap-6 px-0 min-h-[100px]">
          <AnimatePresence mode="popLayout">
            {filteredDeadlines.map((item) => (
              <motion.div 
                layout 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                key={item.title}
              >
                <Deadlines {...item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 5. Recent Activity */}
      <div className="flex flex-col items-center justify-start w-full shadow-[0_0_10px_0_#54545440]">
        <RecentActivityCard />
      </div>

      {/* 6. Issues & Alerts with Dismiss Logic */}
      <div className="flex flex-col items-center justify-start w-full gap-y-7 shadow-[0_0_10px_0_#54545440] dark:shadow-[0_0_12px_#00000080] py-4 px-4 sm:px-6 md:px-8 pb-6 sm:pb-10 rounded-xl bg-white dark:bg-[#1E1E1E] border border-transparent dark:border-[#2A2A2A]">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-[#6E7184] dark:text-gray-200 font-bold text-2xl">Issues & Alerts</h1>
          <motion.p whileHover={{ scale: 1.08, x: 6 }} className="text-[#C05328] dark:text-blue-400 text-lg font-medium cursor-pointer hover:underline">View All</motion.p>
        </div>
        <div className="flex flex-wrap gap-4 md:gap-5 w-full justify-center xl:justify-start">
          <AnimatePresence>
            {activeAlerts.map((alert) => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group relative flex items-center w-[228px] h-[64px] ${alert.type === 'blue' ? 'bg-[#E7F2FD] dark:bg-[#0F1C2E] border-[#BDDEFF] dark:border-[#1E3A5F]' : 'bg-[#FDECEC] dark:bg-[#2A1414] border-[#FFC6C6] dark:border-[#5A2A2A]'} border rounded-lg px-2 gap-2 transition-all`}
              >
                <button 
                  onClick={() => setActiveAlerts(activeAlerts.filter(a => a.id !== alert.id))}
                  className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 shadow-md border dark:border-gray-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity btn-hover"
                >
                  <X className="size-3 text-gray-500" />
                </button>
                <div className="flex items-center justify-center">
                  <IoAlert className={`size-6 ${alert.type === 'blue' ? 'text-[#007CEC] dark:text-[#38BDF8]' : 'text-[#EE1C1C] dark:text-[#F87171]'}`} />
                </div>
                <div className="flex flex-col items-start justify-center overflow-hidden">
                  <p className={`text-xs font-semibold truncate w-full ${alert.type === 'blue' ? 'text-[#007CEC] dark:text-[#38BDF8]' : 'text-[#EE1C1C] dark:text-[#F87171]'}`}>{alert.title}</p>
                  <p className={`font-bold text-[10px] cursor-pointer hover:underline ${alert.type === 'blue' ? 'text-[#007CEC] dark:text-[#38BDF8]' : 'text-[#EE1C1C] dark:text-[#F87171]'}`}>{alert.link}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {activeAlerts.length === 0 && (
            <button onClick={() => setActiveAlerts([{id:1, title: "API Documentation", type: "blue", link: "Resume Work →"}, {id:2, title: "User Dashboard UI", type: "red", link: "Nudge Designer"}])} className="text-sm text-blue-500 underline btn-hover">Reset Alerts</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;