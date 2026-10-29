import {
  Check,
  CircleAlert,
  ClipboardListIcon,
  EllipsisIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../config/axios";
import { fetchNotifications } from "../../../redux/features/notificationThunks";
import TopCard from "../TopCard";
import CircularProgress from "../CircularProgress";
import TaskStatusDistribution from "../TaskGraph/TaskStatusDistribution";
import SprintContribution from "./Dashboard/SprintContribution";
import { motion, AnimatePresence } from "framer-motion";
import Deadlines from "./Dashboard/Deadlines";
import { IoAlert } from "react-icons/io5";
import RecentActivityCard from "../RecentActivityCard";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { notifications, loading: notificationsLoading, error: notificationsError } = useSelector((state) => state.notification);
  const [deadlineFilter, setDeadlineFilter] = useState("ALL");
  const [workload, setWorkload] = useState(null);
  const [workloadLoading, setWorkloadLoading] = useState(true);
  const [workloadError, setWorkloadError] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      api.get("/dashboard/my-workload"),
      dispatch(fetchNotifications({ limit: 5 })).unwrap(),
    ])
      .then(([workloadResult]) => {
        if (!active) return;
        if (workloadResult.status === "fulfilled") {
          setWorkload(workloadResult.value.data);
        } else {
          setWorkloadError(workloadResult.reason?.response?.data?.message || workloadResult.reason?.message || "Unable to load dashboard data");
        }
      })
      .finally(() => {
        if (active) setWorkloadLoading(false);
      });

    return () => {
      active = false;
    };
  }, [dispatch]);

  const tasks = workload?.tasks || [];
  const completedTasks = workload?.completed || 0;
  const totalTasks = workload?.totalTasks || 0;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS",
  ).length;
  const overdueTasks = tasks.filter(
    (task) =>
      task.status !== "DONE" &&
      task.deadline &&
      new Date(task.deadline) < new Date(),
  ).length;
  const completionPercentage = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const statusData = [
    {
      id: "todo",
      label: "To Do",
      count: tasks.filter((task) => task.status === "TODO").length,
      color: "#94A3B8",
    },
    {
      id: "in-progress",
      label: "In Progress",
      count: inProgressTasks,
      color: "#FBB309",
    },
    {
      id: "blocked",
      label: "Blocked",
      count: tasks.filter((task) => task.status === "BLOCKED").length,
      color: "#EF4444",
    },
    { id: "done", label: "Done", count: completedTasks, color: "#1BC963" },
  ];

  const deadlineTask = tasks
    .filter((task) => task.status !== "DONE" && task.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .map((task) => {
      const priority = (task.priority || "LOW").toUpperCase();
      const priorityStyles = {
        HIGH: {
          bgColor: "bg-[#FEF2F2] dark:bg-[#3A1F1F]",
          borderColor: "border-[#FCC0C4] dark:border-[#7F1D1D]",
          titleColor: "text-[#B60000] dark:text-[#FF4D4F]",
          descColor: "text-[#E76060] dark:text-[#F87171]",
          statusColor: "bg-[#EF4444]",
        },
        MEDIUM: {
          bgColor: "bg-[#FEFCE8] dark:bg-[#4A3514]",
          borderColor: "border-[#FFF7A6] dark:border-[#A16207]",
          titleColor: "text-[#9F5E00] dark:text-[#FBBF24]",
          descColor: "text-[#DBAE4B] dark:text-[#FCD34D]",
          statusColor: "bg-[#EAB308]",
        },
        LOW: {
          bgColor: "bg-[#F6F7F8] dark:bg-[#121212]",
          borderColor: "border-[#C8E3FE] dark:border-[#2A2A2A]",
          titleColor: "text-[#000000] dark:text-[#E5E7EB]",
          descColor: "text-[#8897A5] dark:text-[#9CA3AF]",
          statusColor: "bg-[#6B7280]",
        },
      };
      return {
        title: task.title,
        status: priority,
        due: new Date(task.deadline).toLocaleString(),
        ...(priorityStyles[priority] || priorityStyles.LOW),
      };
    });

  // --- FILTER LOGIC ---
  const filteredDeadlines =
    deadlineFilter === "ALL"
      ? deadlineTask
      : deadlineTask.filter((task) => task.status === deadlineFilter);

  const cardData = [
    {
      title: "Total Tasks",
      count: workloadLoading ? "..." : totalTasks,
      iconData: (
        <ClipboardListIcon className="text-white dark:text-gray-900 fill-blue-600 size-10" />
      ),
    },
    {
      title: "Completed",
      count: workloadLoading ? "..." : completedTasks,
      iconData: (
        <div className="flex items-center justify-center p-2 rounded-full bg-[#1BC963]">
          <Check className="size-5 text-white dark:text-gray-900" />
        </div>
      ),
    },
    {
      title: "in Progress",
      count: workloadLoading ? "..." : inProgressTasks,
      iconData: (
        <div className="flex items-center justify-center p-2 rounded-full bg-[#FBB309]">
          <EllipsisIcon className="size-5 text-white dark:text-gray-900" />
        </div>
      ),
    },
    {
      title: "Overdue",
      count: workloadLoading ? "..." : overdueTasks,
      iconData: (
        <CircleAlert className="size-10 text-white dark:text-gray-900 fill-[#EF4444]" />
      ),
    },
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

      {/* 1. Health Status + My Completion Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-6 items-stretch">
        {/* 1. Health Status */}
        <div className="flex flex-col justify-between w-full gap-4 sm:gap-5 py-4 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2d2f31] shadow-none">
          <div className="flex items-center justify-start w-full">
            <h2 className="text-gray-900 dark:text-white font-bold text-xl sm:text-2xl">
              Health Status
            </h2>
          </div>
          <div className="flex flex-col xsm:flex-row items-center justify-center md:justify-start w-full gap-6 sm:gap-8 md:gap-12 px-2 sm:px-4 py-2">
            <div className="[--chart-text:#000000] dark:[--chart-text:#FFFFFF] shrink-0">
              <CircularProgress
                percentage={completionPercentage}
                startAngle={20}
                size={150}
                label="TASKS DONE"
                data={workloadLoading ? "..." : `${completionPercentage}%`}
                fontSize={26}
                textSize={11}
                textColor="var(--chart-text)"
                labelColor="#94A3B8"
                progressColor="#127FEC"
                trackColor="#E5E7EB"
                className="text-[#E5E7EB] dark:text-[#2A2A2A]"
                innerBg="bg-white dark:bg-[#1E1E1E]"
              />
            </div>
            <div className="flex flex-col items-center md:items-start justify-center gap-2 text-center md:text-left">
              <h3 className="text-slate-500 dark:text-gray-400 font-semibold text-base sm:text-lg">
                Personal Task Progress
              </h3>
              <div className="flex items-center gap-3">
                <h4 className="text-gray-900 dark:text-white font-bold text-xl sm:text-3xl">
                  {workloadLoading ? "..." : `${completedTasks}/${totalTasks}`}
                </h4>
                <div className="flex items-center justify-center px-3 py-1 rounded-full bg-[#ECFDF5] dark:bg-green-900/20 border border-[#D1FAE5]">
                  <p className="text-[#10B981] dark:text-green-400 font-bold text-[9px] sm:text-[10px] tracking-wide uppercase">
                    COMPLETED
                  </p>
                </div>
              </div>
              <p className="text-slate-400 dark:text-gray-500 font-medium text-xs sm:text-sm tracking-wide">
                {workloadError ||
                  (totalTasks
                    ? `${completionPercentage}% of assigned tasks`
                    : "No assigned tasks")}
              </p>
            </div>
          </div>
        </div>

        {/* 2. My Completion Progress */}
        <div className="flex flex-col justify-between w-full gap-4 sm:gap-5 py-4 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2d2f31] shadow-none">
          <div className="flex items-center justify-start w-full">
            <h2 className="text-gray-900 dark:text-white font-bold text-xl sm:text-2xl">
              My Completion Progress
            </h2>
          </div>
          <div className="flex flex-col xsm:flex-row items-center justify-center md:justify-start w-full gap-6 sm:gap-8 md:gap-12 px-2 sm:px-4 py-2">
            <div className="text-black dark:text-white shrink-0">
              <CircularProgress
                percentage={completionPercentage}
                size={150}
                progressColor="#127FEC"
                trackColor="#E5E7EB"
                label="FINISHED"
                data={`${completionPercentage}%`}
                fontSize={26}
                textSize={11}
                textColor="currentColor"
                labelColor="#94A3B8"
                innerBg="bg-white dark:bg-[#1E1E1E]"
              />
            </div>
            <div className="flex flex-col items-center md:items-start justify-center gap-2 text-center md:text-left">
              <h3 className="text-slate-500 dark:text-gray-400 font-semibold text-base sm:text-lg">
                Sprint Goal Completion
              </h3>
              <p className="text-slate-600 dark:text-gray-300 font-bold text-base sm:text-lg text-center md:text-left">
                You've completed <span className="text-[#127FEC]">{completedTasks}</span> of{" "}
                <span className="text-[#127FEC]">{totalTasks}</span> tasks this sprint
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sprint Contribution */}
      <SprintContribution CONTRIBUTIONS={[]} />

      {/* 3. Task Status Distribution */}
      <div className="flex items-center justify-start w-full shadow-[0_0_10px_0_#54545440]">
        {workloadLoading && (
          <p className="w-full p-6 text-sm text-gray-500 dark:text-gray-400">
            Loading task status...
          </p>
        )}
        {!workloadLoading && workloadError && (
          <p className="w-full p-6 text-sm text-red-500">{workloadError}</p>
        )}
        {!workloadLoading && !workloadError && totalTasks === 0 && (
          <p className="w-full p-6 text-sm text-gray-500 dark:text-gray-400">
            No assigned tasks.
          </p>
        )}
        {!workloadLoading && !workloadError && totalTasks > 0 && (
          <TaskStatusDistribution task={statusData} />
        )}
      </div>

      {/* 4. Upcoming Deadlines with Filter Functionality */}
      <div className="flex flex-col items-center justify-start w-full gap-y-7 shadow-[0_0_10px_0_#54545440] dark:shadow-[0_0_12px_#00000080] py-4 px-4 sm:px-6 md:px-8 pb-6 sm:pb-10 rounded-xl bg-white dark:bg-[#1E1E1E] border border-transparent dark:border-[#2A2A2A]">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-gray-900 dark:text-white font-bold text-xl sm:text-2xl">
            Upcoming Deadlines
          </h2>
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
            <motion.p
              whileHover={{ scale: 1.08, x: 6 }}
              className="text-blue-600 dark:text-[#73FBFD] text-sm font-semibold cursor-pointer hover:underline"
            >
              View All
            </motion.p>
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
          {!workloadLoading &&
            !workloadError &&
            filteredDeadlines.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No upcoming deadlines.
              </p>
            )}
          {workloadError && (
            <p className="text-sm text-red-500">{workloadError}</p>
          )}
        </div>
      </div>

      {/* 5. Recent Activity */}
      <div className="flex flex-col items-center justify-start w-full shadow-[0_0_10px_0_#54545440]">
        <RecentActivityCard tasks={tasks} loading={workloadLoading} />
      </div>

      {/* 6. Issues & Alerts with Dismiss Logic */}
      <div className="flex flex-col items-center justify-start w-full gap-y-7 shadow-[0_0_10px_0_#54545440] dark:shadow-[0_0_12px_#00000080] py-4 px-4 sm:px-6 md:px-8 pb-6 sm:pb-10 rounded-xl bg-white dark:bg-[#1E1E1E] border border-transparent dark:border-[#2A2A2A]">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-gray-900 dark:text-white font-bold text-xl sm:text-2xl">Issues & Alerts</h2>
          <motion.p whileHover={{ scale: 1.08, x: 6 }} className="text-blue-600 dark:text-[#73FBFD] text-sm font-semibold cursor-pointer hover:underline">View All</motion.p>
        </div>
        <div className="flex flex-wrap gap-4 md:gap-5 w-full justify-center xl:justify-start">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div 
                key={notification.id || notification._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative flex items-center w-[228px] h-[64px] bg-[#E7F2FD] dark:bg-[#0F1C2E] border-[#BDDEFF] dark:border-[#1E3A5F] border rounded-lg px-2 gap-2 transition-all"
              >
                <div className="flex items-center justify-center">
                  <IoAlert className="size-6 text-[#007CEC] dark:text-[#38BDF8]" />
                </div>
                <div className="flex flex-col items-start justify-center overflow-hidden">
                  <p className="text-xs font-semibold truncate w-full text-[#007CEC] dark:text-[#38BDF8]">{notification.title}</p>
                  <p className="font-medium text-[10px] text-[#007CEC] dark:text-[#38BDF8] truncate w-full">{notification.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {!notificationsLoading && notifications.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">No alerts at this time.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
