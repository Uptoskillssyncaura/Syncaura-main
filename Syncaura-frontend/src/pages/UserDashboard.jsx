import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Analytics from "../components/userdashboard/subpages/Analytics";
import Projects from "../components/userdashboard/subpages/Projects";
import Dashboard from "../components/userdashboard/subpages/Dashboard";

const TABS = ["Dashboard", "Projects", "Analytics"];

const UserDashboard = () => {
  const isDark = useSelector((state) => state.theme.isDark);

  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [direction, setDirection] = useState(0);

  const handleTabChange = useCallback((tab) => {
    const currentIndex = TABS.indexOf(selectedTab);
    const nextIndex = TABS.indexOf(tab);

    setDirection(nextIndex > currentIndex ? 1 : -1);
    setSelectedTab(tab);
  }, [selectedTab]);

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] flex flex-col transition-colors duration-500 border-t dark:border-black bg-white dark:bg-black">
      
      {/* Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between lg:justify-start px-5 md:px-10 gap-10 gap-y-3 pt-6">
        <h1 className="text-2xl font-medium text-black dark:text-white">
          Dashboard
        </h1>

        
        <div className="relative flex items-center px-5 py-2 gap-5 rounded-3xl border border-[#E3E3E3] dark:border-[#73FBFD]">
          {TABS.map((item) => (
            <button
              key={item}
              onClick={() => handleTabChange(item)}
              className="relative z-10 px-3 py-1 outline-none cursor-pointer btn-hover"
            >
              <motion.span
                animate={{
                  color:
                    selectedTab === item
                      ? isDark
                        ? "#73FBFD" // Active color in dark mode
                        : "#2461E6" // Active color in light mode
                      : isDark
                      ? "#FFFFFF" // Inactive color in dark mode
                      : "#9CA3AF", // Inactive color in light mode
                }}
                transition={{ duration: 0.2 }}
                className={`relative text-xs ${
                  selectedTab === item ? "font-bold" : "font-semibold"
                } sm:text-sm`}
              >
                {item}
              </motion.span>
            </button>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="relative w-full flex-1 px-5 md:px-10 pt-6 pb-24">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={selectedTab}
            custom={direction}
            initial={{ x: direction === 1 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === 1 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-full rounded-xl p-2 sm:p-6"
          >
            {selectedTab === "Dashboard" && <Dashboard />}
            {selectedTab === "Analytics" && <Analytics />}
            {selectedTab === "Projects" && <Projects />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserDashboard;