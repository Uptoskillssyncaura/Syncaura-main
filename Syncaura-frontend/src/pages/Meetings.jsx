import { Funnel, RefreshCcw } from "lucide-react";
import { FaSearch, FaBars } from "react-icons/fa";
import MeetingCard from "../components/Meeting/Main/Card/MeetingCard";
import ScheduleMeetingModal from "../components/Meeting/Main/Model/ScheduleMeetingModal";
import FilterTabs from "../components/Meeting/Main/Tab/FilterTabs";
import Sidebar from "../components/Meeting/Sidebar/Sidebar";
import MeetingFilter from "../components/Meeting/MeetingFilter";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getMeetings, syncCalendarEvents, createMeeting } from "../redux/features/meetingThunks";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Meetings() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const reduxMeetings = useSelector((state) => state.meeting?.meetings || []);
  const isSyncing = useSelector((state) => state.meeting?.isSyncing || false);
  const userRole = useSelector((state) => state.auth?.user?.role);
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [direction, setDirection] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getMeetings());
  }, [dispatch]);

  useEffect(() => {
    const isGoogleConnected = searchParams.get("google_connected");
    const errorMsg = searchParams.get("error");

    if (isGoogleConnected === "true") {
      toast.success("Google Calendar connected successfully! 🎉");
      dispatch(syncCalendarEvents());
      searchParams.delete("google_connected");
      setSearchParams(searchParams);
    } else if (errorMsg) {
      toast.error(`Failed to connect Google Calendar: ${decodeURIComponent(errorMsg)}`);
      searchParams.delete("error");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, dispatch]);

  const reduxAuthToken = useSelector((state) => state.auth?.token);

  const handleSyncCalendar = async () => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      reduxAuthToken;

    if (!token) {
      toast.error("Please log in first.");
      return;
    }

    // Keep token in localStorage
    localStorage.setItem("accessToken", token);
    localStorage.setItem("token", token);

    try {
      const resultAction = await dispatch(syncCalendarEvents());

      if (syncCalendarEvents.fulfilled.match(resultAction)) {
        toast.success(
          resultAction.payload?.message ||
          "Calendar synced successfully! 📅"
        );
        return;
      }

      console.log("Calendar sync failed:", resultAction.payload);

      // Start Google OAuth
      window.location.href =
        `/auth/google?token=${encodeURIComponent(token)}`;

    } catch (err) {
      console.error("Calendar sync error:", err);

      // Start Google OAuth
      window.location.href =
        `/auth/google?token=${encodeURIComponent(token)}`;
    }
  };

  const handleCreateMeeting = async (meetingData) => {
    try {
      const resultAction = await dispatch(createMeeting(meetingData));

      if (createMeeting.fulfilled.match(resultAction)) {
        toast.success("Meeting created successfully! 🎉");
        dispatch(getMeetings());
        setModalOpen(false);
      } else {
        toast.error(resultAction.payload || "Failed to create meeting");
      }
    } catch (error) {
      console.error("Create meeting error:", error);
      toast.error("Failed to create meeting");
    }
  };

  const getMeetingType = useCallback((startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : start;

    if (now >= start && now <= end) return "ongoing";
    if (now < start) return "upcoming";
    return "past";
  }, []);

  const demoMeetings = useMemo(() => {
    const now = new Date();
    return [
      {
        id: 1,
        title: "Weekly Team Standup",
        startTime: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 45 * 60 * 1000).toISOString(),
        platform: "Zoom",
        avatarCount: 4,
        isDoc: true,
      },
      {
        id: 2,
        title: "Q3 Product Roadmap Review",
        startTime: new Date(now.getTime() + 2 * 3600 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 3 * 3600 * 1000).toISOString(),
        platform: "Google Meet",
        avatarCount: 4,
        isDoc: true,
      },
      {
        id: 3,
        title: "Design System Sync",
        startTime: new Date(now.getTime() + 26 * 3600 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 27 * 3600 * 1000).toISOString(),
        platform: "Google Meet",
        avatarCount: 2,
        isDoc: false,
      },
      {
        id: 4,
        title: "Weekly All Hands",
        startTime: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
        endTime: new Date(now.getTime() - 23 * 3600 * 1000).toISOString(),
        platform: "Zoom",
        avatarCount: 5,
        isDoc: false,
      },
      {
        id: 5,
        title: "Frontend Architecture",
        startTime: new Date(now.getTime() - 72 * 3600 * 1000).toISOString(),
        endTime: new Date(now.getTime() - 71 * 3600 * 1000).toISOString(),
        platform: "Teams",
        avatarCount: 1,
        isDoc: false,
      },
    ];
  }, []);

  const displayMeetings = reduxMeetings.length > 0 ? reduxMeetings : demoMeetings;

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
    let result = displayMeetings;

    if (activeFilter !== "all") {
      result = result.filter(
        (meeting) =>
          getMeetingType(meeting.startTime, meeting.endTime) === activeFilter,
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (meeting) =>
          meeting.title?.toLowerCase().includes(q) ||
          meeting.platform?.toLowerCase().includes(q),
      );
    }

    if (appliedFilters) {
      if (appliedFilters.platform && appliedFilters.platform !== "All") {
        result = result.filter(
          (m) =>
            m.platform?.toLowerCase() ===
            appliedFilters.platform.toLowerCase(),
        );
      }
      if (appliedFilters.hasDoc && appliedFilters.hasDoc !== "All") {
        const needsDoc = appliedFilters.hasDoc === "Yes";
        result = result.filter((m) => Boolean(m.isDoc) === needsDoc);
      }
      if (appliedFilters.date) {
        const filterDateStr = new Date(appliedFilters.date).toDateString();
        result = result.filter(
          (m) => new Date(m.startTime).toDateString() === filterDateStr,
        );
      }
    }

    return result;
  }, [displayMeetings, activeFilter, search, appliedFilters, getMeetingType]);

  return (
    <>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#0f0f0f]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col ">
          {/* Header */}
          <div className="w-full bg-white dark:bg-[#1a1a1a] border-b border-[#e5e7eb] dark:border-[#2c2c2c] px-4 py-2 shadow-sm">


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
              <div className="flex items-center gap-3">
                {userRole === "admin" && (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-full shadow-sm transition btn-hover"
                  >
                    <span className="text-[13px] font-medium">
                      + Create New Meeting
                    </span>
                  </button>
                )}

                <button
                  onClick={handleSyncCalendar}
                  disabled={isSyncing}
                  className="flex items-center gap-2 bg-white dark:bg-[#2a2a2a] px-3.5 py-1.5 rounded-full border border-[#f1f1f1] dark:border-[#2f2f2f] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_10px_rgba(0,0,0,0.06)] transition text-[#4b5563] dark:text-white btn-hover disabled:opacity-50"
                >
                  <RefreshCcw
                    size={14}
                    className={`text-[#111827] dark:text-white ${isSyncing ? "animate-spin" : ""}`}
                  />

                  <span className="text-[13px] font-medium">
                    {isSyncing ? "Syncing..." : "Sync Calendar"}
                  </span>
                </button>
              </div>
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
              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <button
                  onClick={() => setShowFilter((prev) => !prev)}
                  className={`flex items-center justify-center gap-1.5 border px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition btn-hover ${showFilter || appliedFilters
                    ? "bg-blue-50 dark:bg-[#2a2a2a] border-[#2563eb] dark:border-[#73FBFD] text-[#2563eb] dark:text-[#73FBFD]"
                    : "bg-white dark:bg-[#2a2a2a] border-[#f1f1f1] dark:border-[#2f2f2f] text-[#4b5563] dark:text-[#d1d5db]"
                    }`}
                >
                  <Funnel size={14} />
                  <span className="text-[13px]">
                    Filter
                  </span>
                  {appliedFilters && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] dark:bg-[#73FBFD]" />
                  )}
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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent outline-none border-none pl-3 w-full text-[13px] text-[#111827] dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4"
                >
                  <MeetingFilter
                    onClose={() => setShowFilter(false)}
                    onApply={(filters) => setAppliedFilters(filters)}
                    currentFilters={appliedFilters}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="w-full h-[1px] bg-[#e5e7eb] dark:bg-[#2f2f2f] mt-6" />

            {/* Meeting Cards */}
            <div className="mt-8">
              {filteredMeetings.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
                  No meetings found matching your filter criteria.
                </div>
              ) : (
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
                    {filteredMeetings.map((meeting) => {
                      console.log("Meeting being displayed:", meeting);

                      return (
                        <MeetingCard
                          key={meeting.id}
                          {...meeting}
                          googleMeetLink={meeting.googleMeetLink}
                        />
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {modalOpen && (
          <ScheduleMeetingModal
            onClose={() => setModalOpen(false)}
            onSave={handleCreateMeeting}
          />
        )}
      </div>
    </>
  );
}

