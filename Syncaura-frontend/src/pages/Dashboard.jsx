import Header from "../components/dashboard/Header/Header";
import DashboardHeader from "../components/dashboard/Main/SubHeader/DashboardHeader";
import SidebarPanel from "../components/dashboard/SideBar/SidebarPanel";
import QuickActions from "../components/dashboard/Main/SubMain/Left/QuickActions";
import StatsCard from "../components/dashboard/Main/SubMain/Left/StatsCard";
import LatestEvents from "../components/dashboard/Main/SubMain/Left/LatestEvents";
import { Ellipsis } from "lucide-react";
import { useState, useEffect } from "react";
import Tabs from "../components/dashboard/Main/SubMain/Right/Tabs";
import ProjectItem from "../components/dashboard/Main/SubMain/Right/ProjectItem";
import TaskStatCard from "../components/dashboard/Main/SubMain/Left/TaskStatCard";
import DashboardCircles from "../components/dashboard/Main/SubMain/Left/DashboardCircles";
import { useSelector } from "react-redux";
import api from "../config/axios";

const Dashboard = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const userRole = useSelector((state) => state.auth?.user?.role);
  const isAdmin = userRole === "admin" || true;
  const [deadlineDays, setDeadlineDays] = useState(() =>
    parseInt(localStorage.getItem("taskDeadlineDays") || "10", 10)
  );
  const [isEditingDays, setIsEditingDays] = useState(false);

  const tabs = ["Last Projects", "On Deadline", "View All Projects"];
  const [active, setActive] = useState(0);
  const [subHeadActive, setSubHeaderActive] = useState("Dashboard");
  const [showUpperSideBar, setShowUpperSideBar] = useState(false);

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/projects"),
      api.get("/tasks"),
      api.get("/meetings"),
    ])
      .then(([projRes, tasksRes, meetsRes]) => {
        setProjects(Array.isArray(projRes.data) ? projRes.data : []);
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        setMeetings(Array.isArray(meetsRes.data?.data) ? meetsRes.data.data : Array.isArray(meetsRes.data) ? meetsRes.data : []);
      })
      .catch((err) => console.warn("Failed to load dashboard metrics:", err))
      .finally(() => setLoading(false));
  }, []);

  const actions = [
    { icon: "/images/clipboard.png", label: "Project" },
    { icon: "/images/stages.png", label: "Stage" },
    { icon: "/images/task.png", label: "Task" },
    { icon: "/images/member.png", label: "Members" },
    { icon: "/images/messages.png", label: "Messages" },
    { icon: "/images/file.png", label: "Files" },
  ];

  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const overdueTasks = tasks.filter((t) => t.status !== "DONE" && t.deadline && new Date(t.deadline) < new Date()).length;
  const completedRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const delayedRate = tasks.length ? Math.round((overdueTasks / tasks.length) * 100) : 0;

  const statsData = [
    { topic: "Projects", label: loading ? "..." : projects.length },
    { topic: "Tasks", label: loading ? "..." : tasks.length },
    { topic: "Meetings", label: loading ? "..." : meetings.length },
    { topic: "Completed", label: loading ? "..." : completedTasks },
  ];

  const projectsListItem = projects.map((p) => {
    const pTasks = tasks.filter((t) => t.project_id === p.id || t.projectId === p.id);
    const pDone = pTasks.filter((t) => t.status === "DONE").length;
    const progress = pTasks.length ? Math.round((pDone / pTasks.length) * 100) : (String(p.status).toUpperCase() === "COMPLETED" ? 100 : 0);
    return {
      logo: "/images/LastProjects/facebook.png",
      title: p.name || p.title || "Untitled Project",
      progress,
      members: Array.isArray(p.members) && p.members.length > 0 ? p.members.map(m => m.profile_pic).filter(Boolean) : [],
      stages: 4,
      deadline: p.created_at ? new Date(p.created_at).toLocaleDateString() : "—",
      income: "N/A",
      tasks: pTasks.length,
    };
  });

  const TASK_STATS_LIST = [
    {
      title: "Task Completed",
      value: `${completedRate}%`,
      valueColor: "text-[#3361FF]",
      icon: "/images/task/taskcompleted.png",
      change: `${completedTasks} done`,
      changeColor: "text-[#29CC39]",
    },
    {
      title: "Task Delay",
      value: `${delayedRate}%`,
      valueColor: "text-[#29CC39]",
      icon: "/images/task/taskdelay.png",
      change: `${overdueTasks} overdue`,
      changeColor: "text-[#E62E2E]",
    },
  ];

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className=" bg-[#F7F8FA] dark:bg-[#1A1B1E] w-full px-4 xl:px-5 py-2 min-h-screen transition-colors duration-500 "
    >
      <div className=" px-2 left-0 min-w-full ">
        <Header
          currTab={subHeadActive}
          show={showUpperSideBar}
          setShow={setShowUpperSideBar}
        />
      </div>

      <div className="grid grid-cols-[270px_1fr] xl:grid-cols-[330px_1fr] gap-1 xl:gap-3 pt-2 xl:pt-5 min-h-screen">
        <SidebarPanel show={showUpperSideBar} />

        <div className="flex flex-col ">
          <div className="w-full">
            <DashboardHeader
              active={subHeadActive}
              setActive={setSubHeaderActive}
            />
          </div>

          <div
            className={`mt-1 xl:mt-5 w-full ${subHeadActive === "Dashboard" ? "grid animate-slideIn" : "hidden"} grid-cols-5 px-3 2xl:px-10 gap-5 2xl:gap-10`}
          >
            <div className="col-span-3 flex flex-col gap-5 ">
              <QuickActions actions={actions} />
              <div className="grid grid-cols-7 xl:grid-cols-10 2xl:grid-cols-9 gap-5 2xl:gap-10">
                <div className="col-span-2 xl:col-span-3 2xl:col-span-2 flex flex-col gap-5 ">
                  {statsData.map(({ topic, label }, idx) => (
                    <StatsCard topic={topic} label={label} key={idx} />
                  ))}
                </div>
                <div className="col-span-5 xl:col-span-7 2xl:col-span-7 ">
                  <LatestEvents />
                </div>
              </div>
              <div className="grid grid-cols-10 xl:grid-cols-7 gap-2 xl:gap-7">
                <div className="col-span-6 xl:col-span-4 bg-white dark:bg-[#1A1B1E] flex flex-col pt-1 xl:pt-5 px-5 pb-0.5 xl:pb-2 gap-4 w-full items-center justify-center shadow-[0_6px_5px_1px_rgba(0,0,0,0.40),0_0px_0px_0px_rgba(0,0,0,0.15)] rounded-xl">
                  <div className="flex items-center justify-between w-full px-4 2xl:px-10">
                    <p className="font-semibold text-xs 2xl:text-2xl text-[#000000] dark:text-[#A7A7A7] ">
                      Task
                    </p>
                    <div className="w-full flex items-center justify-end">
                      <Ellipsis className="text-xl text-[#C3CAD9] " />
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center ">
                    <DashboardCircles />
                  </div>
                </div>
                <div className="col-span-4 xl:col-span-3">
                  <div className="flex flex-col items-center justify-center gap-2 xl:gap-4">
                    {isAdmin && (
                      <div className="w-full rounded-xl bg-white shadow-[0_6px_6px_3px_rgba(0,0,0,0.40),0_-1px_1px_1px_rgba(0,0,0,0.15)] flex flex-col gap-2 items-center justify-start dark:bg-[#1A1B1E] pt-3 pb-4 px-3 xl:px-4">
                        <div className="flex items-center justify-between w-full">
                          <h2 className="text-[#4D5E80] text-xs xl:text-sm font-semibold dark:text-gray-300">
                            Task Deadline
                          </h2>
                          <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded-full">
                            Admin Edit
                          </span>
                        </div>
                        <div className="flex items-center justify-between w-full mt-1">
                          {isEditingDays ? (
                            <div className="flex items-center gap-1.5 w-full">
                              <input
                                type="number"
                                min="1"
                                max="365"
                                value={deadlineDays}
                                onChange={(e) => setDeadlineDays(parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-1 text-sm border rounded-lg dark:bg-[#2A2A2A] dark:text-white dark:border-gray-600 outline-none"
                              />
                              <span className="text-xs text-gray-500">Days</span>
                              <button
                                onClick={() => {
                                  localStorage.setItem("taskDeadlineDays", deadlineDays.toString());
                                  setIsEditingDays(false);
                                }}
                                className="ml-auto px-2.5 py-1 text-xs font-semibold bg-[#2457C5] dark:bg-[#73FBFD] text-white dark:text-black rounded-lg hover:opacity-90 btn-hover"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <>
                              <h1 className="text-xl xl:text-2xl font-bold text-[#3361FF] dark:text-[#73FBFD]">
                                {deadlineDays} Days
                              </h1>
                              <button
                                onClick={() => setIsEditingDays(true)}
                                className="text-xs font-semibold px-3 py-1 rounded-lg border border-blue-500 text-blue-600 dark:text-[#73FBFD] dark:border-[#73FBFD] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors btn-hover"
                              >
                                Edit Days
                              </button>
                            </>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 w-full text-left">
                          Set task completion period for users.
                        </p>
                      </div>
                    )}
                    {TASK_STATS_LIST.map((item, index) => (
                      <TaskStatCard key={index} {...item} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2 flex flex-col gap-0.5 bg-white dark:bg-[#1A1B1E] w-full rounded-xl shadow-[0_4px_5px_1px_rgba(0,0,0,0.30),0_0px_1px_0px_rgba(0,0,0,0.15)] py-4">
              <div className="w-full flex items-center justify-center">
                <Tabs tabs={tabs} active={active} setActive={setActive} />
              </div>

              <div className="relative w-full overflow-hidden h-full">
                <div
                  className={`
    absolute inset-0 w-full
    transition-transform transition-opacity duration-600 ease-in-out
    ${
      active === 0
        ? "translate-x-0 opacity-100"
        : active > 0
          ? "-translate-x-full opacity-0"
          : "translate-x-full opacity-0"
    }
  `}
                >
                  {projectsListItem.length === 0 && !loading && (
                    <p className="text-center text-sm text-gray-500 py-10">No projects found.</p>
                  )}
                  {projectsListItem.map(
                    (
                      {
                        logo,
                        title,
                        progress,
                        members,
                        stages,
                        deadline,
                        income,
                        tasks: pTasksCount,
                      },
                      idx,
                    ) => (
                      <div className="pt-5 w-full " key={idx}>
                        <ProjectItem
                          logo={logo}
                          title={title}
                          progress={progress}
                          members={members}
                          stages={stages}
                          deadline={deadline}
                          income={income}
                          tasks={pTasksCount}
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
