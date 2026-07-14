import { Funnel, RefreshCcw } from "lucide-react";
import { FaSearch, FaBars } from "react-icons/fa";
import MeetingCard from "../components/Meeting/Main/Card/MeetingCard";
import ScheduleMeetingModal from "../components/Meeting/Main/Model/ScheduleMeetingModal";
import FilterTabs from "../components/Meeting/Main/Tab/FilterTabs";
import Sidebar from "../components/Meeting/Sidebar/Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
//import { getMeetings } from "../redux/features/meetingThunks";
import { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const demoMeetings = [
  {
    id: 1,
    title: "Weekly Team Standup",
    startTime: "2026-06-05T10:00:00",
    endTime: "2026-06-05T11:30:00",
    platform: "Zoom",
    avatarCount: 4,
    isDoc: true,
  },
  {
    id: 2,
    title: "Q3 Product Roadmap Review",
    startTime: "2026-06-05T12:00:00",
    endTime: "2026-06-05T13:00:00",
    platform: "Google Meet",
    avatarCount: 4,
    isDoc: true,
  },
  {
    id: 3,
    title: "Design System Sync",
    startTime: "2026-06-06T14:00:00",
    endTime: "2026-06-06T15:00:00",
    platform: "Google Meet",
    avatarCount: 2,
    isDoc: false,
  },
  {
    id: 4,
    title: "Weekly All Hands",
    startTime: "2026-06-07T09:00:00",
    endTime: "2026-06-07T10:00:00",
    platform: "Zoom",
    avatarCount: 5,
    isDoc: false,
  },
  {
    id: 5,
    title: "Frontend Architecture",
    startTime: "2026-06-08T11:00:00",
    endTime: "2026-06-08T12:00:00",
    platform: "Google Meet",
    avatarCount: 1,
    isDoc: false,
  },
];

export default function Meetings() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const meetings = useSelector((state) => state.meeting?.meetings || []);

  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [direction, setDirection] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");

  const getMeetingType = useCallback((startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now >= start && now <= end) return "ongoing";
    if (now < start) return "upcoming";
    return "past";
  }, []);

  const handleFilterChange = useCallback(
    (filter) => {
      const order = ["all", "upcoming", "ongoing", "past"];

      const currentIndex = order.indexOf(activeFilter);
      const nextIndex = order.indexOf(filter);

      setDirection(nextIndex > currentIndex ? 1 : -1);
      setActiveFilter(filter);
    },
    [activeFilter],
  );

  const filteredMeetings = useMemo(() => {
    if (activeFilter === "all") return demoMeetings;

    return demoMeetings.filter(
      (meeting) =>
        getMeetingType(meeting.startTime, meeting.endTime) === activeFilter,
    );
  }, [activeFilter, getMeetingType]);
  return (
    <>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#0f0f0f]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col ">
          {/* Header */}
          <div className="w-full bg-white dark:bg-[#1a1a1a] border-b border-[#e5e7eb] dark:border-[#2c2c2c] px-4 py-2 shadow-sm">
            {/* Mobile Header */}
            <div className="flex lg:hidden items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-1 btn-hover"
                >
                  <FaBars className="text-2xl text-black dark:text-white" />
                </button>

                <h1 className="text-2xl font-bold text-black dark:text-white">
                  Meetings
                </h1>
              </div>
              <button
  className="flex items-center gap-2 bg-white dark:bg-[#2a2a2a] px-4 py-2 rounded-2xl shadow-sm border border-[#e5e7eb] dark:border-[#3a3a3a] text-[#111827] dark:text-white btn-hover"
>
  <RefreshCcw
    size={16}
    className="text-[#111827] dark:text-white"
  />

                <span className="text-sm font-medium">Sync Calendar</span>
              </button>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
                  Meetings
                </h1>
                <p className="text-sm text-[#6b7280] dark:text-[#bdbdbd] mt-1">
                  Manage your schedule and prepare for upcoming calls
                </p>
              </div>
              <button
  className="flex items-center gap-2 bg-white dark:bg-[#2a2a2a] px-3.5 py-1.5 rounded-full border border-[#f1f1f1] dark:border-[#2f2f2f] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_10px_rgba(0,0,0,0.06)] transition text-[#4b5563] dark:text-white btn-hover"
>
  <RefreshCcw
    size={14}
    className="text-[#111827] dark:text-white"
  />

                <span className="text-[13px] font-medium">Sync Calendar</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-5 py-4 max-w-[1050px] mx-auto w-full">
            {/* Filter + Search */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Tabs */}
              <div>
                <FilterTabs
                  activeFilter={activeFilter}
                  setActiveFilter={handleFilterChange}
                />
              </div>

              {/* Right Controls */}
              <div className="flex flex-col sm:flex-row gap-2">
  
              <button
  className="flex items-center justify-center gap-1.5 bg-white dark:bg-[#2a2a2a] border border-[#f1f1f1] dark:border-[#2f2f2f] px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[#4b5563] dark:text-[#d1d5db] btn-hover"
>   <Funnel size={14} />
                  <span className="text-[13px]">
                    Filter
                  </span>
                </button>

                <div
                  className="
    flex items-center
    bg-white dark:bg-[#2a2a2a]
    border border-[#f1f1f1]
    dark:border-[#2f2f2f]
    rounded-full
    px-3 py-1.5
    w-[180px]
    shadow-[0_2px_8px_rgba(0,0,0,0.04)]
  "
                >
                  <FaSearch className="text-[13px] text-[#9ca3af]" />

                  <input
                    type="text"
                    placeholder="Search meetings..."
                    className="bg-transparent outline-none border-none pl-3 w-full text-[13px]"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-[#e5e7eb] dark:bg-[#2f2f2f] mt-6" />

            {/* Meeting Cards */}
            <div className="mt-8">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeFilter}
                  custom={direction}
                  initial={{
                    x: direction === 1 ? 100 : -100,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                  }}
                  exit={{
                    x: direction === 1 ? -100 : 100,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-start"
                >
                  {filteredMeetings.map((meeting) => (
                    <MeetingCard key={meeting.id} {...meeting} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {modalOpen && (
          <ScheduleMeetingModal onClose={() => setModalOpen(false)} />
        )}
      </div>
    </>
  );
}
