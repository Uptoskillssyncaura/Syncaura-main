import { Funnel, RefreshCcw } from "lucide-react";
import { FaSearch, FaBars } from "react-icons/fa";
import MeetingCard from "../components/Meeting/Main/Card/MeetingCard";
import ScheduleMeetingModal from "../components/Meeting/Main/Model/ScheduleMeetingModal";
import FilterTabs from "../components/Meeting/Main/Tab/FilterTabs";
import Sidebar from "../components/Meeting/sidebar/Sidebar";
import MeetingFilter from "../components/Meeting/MeetingFilter";
import Pagination from "../components/common/Pagination";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getMeetings,
  syncCalendarEvents,
  createMeeting,
} from "../redux/features/meetingThunks";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Meetings() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const reduxMeetings = useSelector(
    (state) => state.meeting?.meetings || []
  );

  const isSyncing = useSelector(
    (state) => state.meeting?.isSyncing || false
  );

  const currentUser = useSelector((state) => state.auth?.user);
  const reduxAuthToken = useSelector((state) => state.auth?.token);

  const userRole = currentUser?.role;

  const currentUserId =
    currentUser?._id ||
    currentUser?.id ||
    currentUser?.userId ||
    currentUser?.user?.id ||
    currentUser?.user?._id;

  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [direction, setDirection] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [search, setSearch] = useState("");

  // Frontend-only state for reschedule/cancel
  const [localMeetings, setLocalMeetings] = useState([]);
  const [cancelledMeetings, setCancelledMeetings] = useState([]);

  // Reschedule modal state
  const [rescheduleMeeting, setRescheduleMeeting] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleStart, setRescheduleStart] = useState("");
  const [rescheduleEnd, setRescheduleEnd] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  // Load meetings
  useEffect(() => {
    dispatch(getMeetings());
  }, [dispatch]);

  // Handle Google Calendar redirect result
  useEffect(() => {
    const isGoogleConnected = searchParams.get("google_connected");
    const errorMsg = searchParams.get("error");

    if (isGoogleConnected === "true") {
      toast.success("Google Calendar connected successfully! 🎉");
      dispatch(syncCalendarEvents());

      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("google_connected");
      setSearchParams(nextParams);
    } else if (errorMsg) {
      toast.error(
        `Failed to connect Google Calendar: ${decodeURIComponent(errorMsg)}`
      );

      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("error");
      setSearchParams(nextParams);
    }
  }, [searchParams, setSearchParams, dispatch]);

  // Sync Google Calendar
  const handleSyncCalendar = async () => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      reduxAuthToken;

    if (!token) {
      toast.error("Please log in first.");
      return;
    }

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

      window.location.href = `/auth/google?token=${encodeURIComponent(
        token
      )}`;
    } catch (err) {
      console.error("Calendar sync error:", err);

      window.location.href = `/auth/google?token=${encodeURIComponent(
        token
      )}`;
    }
  };

  // Create meeting
  const handleCreateMeeting = async (meetingData) => {
    try {
      const resultAction = await dispatch(createMeeting(meetingData));

      if (createMeeting.fulfilled.match(resultAction)) {
        toast.success("Meeting created successfully! 🎉");
        dispatch(getMeetings());
        setModalOpen(false);
      } else {
        toast.error(
          resultAction.payload || "Failed to create meeting"
        );
      }
    } catch (error) {
      console.error("Create meeting error:", error);
      toast.error("Failed to create meeting");
    }
  };

  const getMeetingType = useCallback((startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);

    const end = endTime
      ? new Date(endTime)
      : new Date(start.getTime() + 60 * 60 * 1000);

    if (now >= start && now <= end) return "ongoing";
    if (now < start) return "upcoming";

    return "past";
  }, []);

  // Demo meetings
  const demoMeetings = useMemo(() => {
    const now = new Date();

    return [
      {
        id: 1,
        title: "Weekly Team Standup",
        startTime: new Date(
          now.getTime() - 15 * 60 * 1000
        ).toISOString(),
        endTime: new Date(
          now.getTime() + 45 * 60 * 1000
        ).toISOString(),
        platform: "Zoom",
        avatarCount: 4,
        isDoc: true,
        createdBy: "demo-other-user",
      },
      {
        id: 2,
        title: "Q3 Product Roadmap Review",
        startTime: new Date(
          now.getTime() + 2 * 3600 * 1000
        ).toISOString(),
        endTime: new Date(
          now.getTime() + 3 * 3600 * 1000
        ).toISOString(),
        platform: "Google Meet",
        avatarCount: 4,
        isDoc: true,
        createdBy: currentUserId || "demo-current-user",
      },
      {
        id: 3,
        title: "Design System Sync",
        startTime: new Date(
          now.getTime() + 26 * 3600 * 1000
        ).toISOString(),
        endTime: new Date(
          now.getTime() + 27 * 3600 * 1000
        ).toISOString(),
        platform: "Google Meet",
        avatarCount: 2,
        isDoc: false,
        createdBy: "demo-other-user-2",
      },
      {
        id: 4,
        title: "Weekly All Hands",
        startTime: new Date(
          now.getTime() - 24 * 3600 * 1000
        ).toISOString(),
        endTime: new Date(
          now.getTime() - 23 * 3600 * 1000
        ).toISOString(),
        platform: "Zoom",
        avatarCount: 5,
        isDoc: false,
        createdBy: "demo-other-user",
      },
      {
        id: 5,
        title: "Frontend Architecture",
        startTime: new Date(
          now.getTime() - 72 * 3600 * 1000
        ).toISOString(),
        endTime: new Date(
          now.getTime() - 71 * 3600 * 1000
        ).toISOString(),
        platform: "Teams",
        avatarCount: 1,
        isDoc: false,
        createdBy: "demo-other-user",
      },
    ];
  }, [currentUserId]);

  // Merge Redux meetings with local frontend changes
  const displayMeetings = useMemo(() => {
    const source =
      reduxMeetings.length > 0 ? reduxMeetings : demoMeetings;

    const merged = [...source];

    localMeetings.forEach((localMeeting) => {
      const index = merged.findIndex(
        (meeting) =>
          String(meeting.id || meeting._id) ===
          String(localMeeting.id || localMeeting._id)
      );

      if (index >= 0) {
        merged[index] = {
          ...merged[index],
          ...localMeeting,
        };
      } else {
        merged.push(localMeeting);
      }
    });

    return merged.filter(
      (meeting) =>
        !cancelledMeetings.includes(
          String(meeting.id || meeting._id)
        )
    );
  }, [
    reduxMeetings,
    demoMeetings,
    localMeetings,
    cancelledMeetings,
  ]);

  // Open reschedule modal
  const openReschedule = (meeting) => {
    const now = new Date();
    const start = new Date(meeting.startTime);

    // Reschedule only when meeting is more than 1 hour away
    if (
      start.getTime() - now.getTime() <=
      60 * 60 * 1000
    ) {
      toast.error(
        "Rescheduling is allowed only more than 1 hour before the meeting."
      );
      return;
    }

    const startDate = new Date(meeting.startTime);

    const endDate = new Date(
      meeting.endTime || meeting.startTime
    );

    setRescheduleMeeting(meeting);

    setRescheduleDate(
      `${startDate.getFullYear()}-${String(
        startDate.getMonth() + 1
      ).padStart(2, "0")}-${String(
        startDate.getDate()
      ).padStart(2, "0")}`
    );

    setRescheduleStart(
      `${String(startDate.getHours()).padStart(
        2,
        "0"
      )}:${String(startDate.getMinutes()).padStart(2, "0")}`
    );

    setRescheduleEnd(
      `${String(endDate.getHours()).padStart(
        2,
        "0"
      )}:${String(endDate.getMinutes()).padStart(2, "0")}`
    );
  };

  // Save rescheduled meeting
  const handleRescheduleSave = () => {
    if (!rescheduleMeeting) return;

    if (
      !rescheduleDate ||
      !rescheduleStart ||
      !rescheduleEnd
    ) {
      toast.error("Please select date, start time and end time.");
      return;
    }

    const now = new Date();

    const newStart = new Date(
      `${rescheduleDate}T${rescheduleStart}`
    );

    const newEnd = new Date(
      `${rescheduleDate}T${rescheduleEnd}`
    );

    if (
      Number.isNaN(newStart.getTime()) ||
      Number.isNaN(newEnd.getTime())
    ) {
      toast.error("Please select a valid date and time.");
      return;
    }

    if (newStart <= now) {
      toast.error("New meeting time must be in the future.");
      return;
    }

    if (newEnd <= newStart) {
      toast.error("End time must be after start time.");
      return;
    }

    if (
      newStart.getTime() - now.getTime() <
      60 * 60 * 1000
    ) {
      toast.error(
        "Rescheduled meeting must be at least 1 hour from now."
      );
      return;
    }

    const updatedMeeting = {
      ...rescheduleMeeting,
      startTime: newStart.toISOString(),
      endTime: newEnd.toISOString(),
    };

    setLocalMeetings((prev) => {
      const exists = prev.some(
        (meeting) =>
          String(meeting.id || meeting._id) ===
          String(
            rescheduleMeeting.id || rescheduleMeeting._id
          )
      );

      if (exists) {
        return prev.map((meeting) =>
          String(meeting.id || meeting._id) ===
          String(
            rescheduleMeeting.id || rescheduleMeeting._id
          )
            ? updatedMeeting
            : meeting
        );
      }

      return [...prev, updatedMeeting];
    });

    setRescheduleMeeting(null);
    toast.success("Meeting rescheduled successfully!");
  };

  // Cancel meeting
  const handleCancelMeeting = (meeting) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel "${meeting.title}"?`
    );

    if (!confirmed) return;

    const meetingId = String(meeting.id || meeting._id);

    setCancelledMeetings((prev) =>
      prev.includes(meetingId)
        ? prev
        : [...prev, meetingId]
    );

    toast.success("Meeting cancelled successfully!");
  };

  const handleFilterChange = useCallback(
    (filter) => {
      const order = ["all", "upcoming", "ongoing", "past"];

      const currentIndex = order.indexOf(activeFilter);
      const nextIndex = order.indexOf(filter);

      setDirection(nextIndex > currentIndex ? 1 : -1);
      setActiveFilter(filter);
    },
    [activeFilter]
  );

  const filteredMeetings = useMemo(() => {
    let result = displayMeetings;

    if (activeFilter !== "all") {
      result = result.filter(
        (meeting) =>
          getMeetingType(
            meeting.startTime,
            meeting.endTime
          ) === activeFilter
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();

      result = result.filter(
        (meeting) =>
          meeting.title?.toLowerCase().includes(q) ||
          meeting.platform?.toLowerCase().includes(q)
      );
    }

    if (appliedFilters) {
      if (
        appliedFilters.platform &&
        appliedFilters.platform !== "All"
      ) {
        result = result.filter(
          (meeting) =>
            meeting.platform?.toLowerCase() ===
            appliedFilters.platform.toLowerCase()
        );
      }

      if (
        appliedFilters.hasDoc &&
        appliedFilters.hasDoc !== "All"
      ) {
        const needsDoc = appliedFilters.hasDoc === "Yes";

        result = result.filter(
          (meeting) => Boolean(meeting.isDoc) === needsDoc
        );
      }

      if (appliedFilters.date) {
        const filterDateStr = new Date(
          appliedFilters.date
        ).toDateString();

        result = result.filter(
          (meeting) =>
            new Date(meeting.startTime).toDateString() ===
            filterDateStr
        );
      }
    }

    return result;
  }, [
    displayMeetings,
    activeFilter,
    search,
    appliedFilters,
    getMeetingType,
  ]);

  // Reset pagination when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, search, appliedFilters]);

  const totalMeetingPages =
    Math.ceil(filteredMeetings.length / PAGE_SIZE) || 1;

  const paginatedMeetings = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredMeetings.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [filteredMeetings, currentPage]);

  return (
    <>
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#0f0f0f]">
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="w-full bg-white dark:bg-[#1a1a1a] border-b border-[#e5e7eb] dark:border-[#2c2c2c] px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
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
                    className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-xl shadow-sm transition btn-hover font-semibold text-sm"
                  >
                    <span>+ Create New Meeting</span>
                  </button>
                )}

                <button
                  onClick={handleSyncCalendar}
                  disabled={isSyncing}
                  className="flex items-center gap-2 bg-white dark:bg-[#2a2a2a] px-3.5 py-2 rounded-xl border border-[#f1f1f1] dark:border-[#2f2f2f] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_10px_rgba(0,0,0,0.06)] transition text-[#4b5563] dark:text-white btn-hover disabled:opacity-50 text-xs font-semibold"
                >
                  <RefreshCcw
                    size={14}
                    className={`text-[#111827] dark:text-white ${
                      isSyncing ? "animate-spin" : ""
                    }`}
                  />

                  <span>
                    {isSyncing
                      ? "Syncing..."
                      : "Sync Calendar"}
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2"
              >
                <FaBars />
              </button>

              <h1 className="text-xl font-bold">
                Meetings
              </h1>

              <div />
            </div>
          </div>

          {/* Content Area */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 w-full">
            {/* Filter + Search */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <FilterTabs
                  activeFilter={activeFilter}
                  setActiveFilter={handleFilterChange}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <button
                  onClick={() =>
                    setShowFilter((prev) => !prev)
                  }
                  className={`flex items-center justify-center gap-2 border px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    showFilter || appliedFilters
                      ? "border-[#2461E6] bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:border-[#73FBFD] dark:text-[#73FBFD]"
                      : "border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#121212] text-gray-800 dark:text-gray-200 hover:border-blue-500 dark:hover:border-[#73FBFD]"
                  }`}
                >
                  <Funnel size={14} />

                  <span>
                    {appliedFilters ? "Filtered" : "Filter"}
                  </span>

                  {appliedFilters && (
                    <span className="w-2 h-2 rounded-full bg-[#2461E6] dark:bg-[#73FBFD]" />
                  )}
                </button>

                <div
                  className="
                    flex items-center
                    bg-white dark:bg-[#121212]
                    border border-gray-200
                    dark:border-[#2A2A2A]
                    rounded-xl
                    px-3.5 py-2
                    w-[190px] sm:w-[220px]
                    shadow-xs
                  "
                >
                  <FaSearch className="text-[13px] text-gray-400 dark:text-gray-500 shrink-0" />

                  <input
                    type="text"
                    placeholder="Search meetings..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="bg-transparent outline-none border-none pl-2.5 w-full text-xs font-medium text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

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
                    onApply={(filters) =>
                      setAppliedFilters(filters)
                    }
                    currentFilters={appliedFilters}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-full h-[1px] bg-[#e5e7eb] dark:bg-[#2f2f2f] mt-6" />

            {/* Meeting Cards */}
            <div className="mt-8">
              {filteredMeetings.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
                  No meetings found matching your filter
                  criteria.
                </div>
              ) : (
                <AnimatePresence
                  mode="wait"
                  custom={direction}
                >
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
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {paginatedMeetings.map((meeting) => (
                      <MeetingCard
                        key={meeting.id || meeting._id}
                        {...meeting}
                        googleMeetLink={
                          meeting.googleMeetLink
                        }
                        currentUserId={currentUserId}
                        onReschedule={() =>
                          openReschedule(meeting)
                        }
                        onCancel={() =>
                          handleCancelMeeting(meeting)
                        }
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Pagination Controls */}
              {filteredMeetings.length > 0 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalMeetingPages}
                    totalItems={filteredMeetings.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                    itemLabel="meetings"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schedule Meeting */}
        {modalOpen && (
          <ScheduleMeetingModal
            onClose={() => setModalOpen(false)}
            onSave={handleCreateMeeting}
          />
        )}

        {/* Reschedule Modal */}
        {rescheduleMeeting && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setRescheduleMeeting(null)}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="bg-white dark:bg-[#2E2F2F] rounded-3xl p-6 w-full max-w-[500px] shadow-2xl">
                <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                  Reschedule Meeting
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-300 mb-5">
                  {rescheduleMeeting.title}
                </p>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                      Date
                    </label>

                    <input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) =>
                        setRescheduleDate(e.target.value)
                      }
                      className="w-full h-11 rounded-full px-4 bg-gray-100 dark:bg-[#3A3A3A] text-black dark:text-white outline-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                        Start Time
                      </label>

                      <input
                        type="time"
                        value={rescheduleStart}
                        onChange={(e) =>
                          setRescheduleStart(e.target.value)
                        }
                        className="w-full h-11 rounded-full px-4 bg-gray-100 dark:bg-[#3A3A3A] text-black dark:text-white outline-none"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 text-black dark:text-white">
                        End Time
                      </label>

                      <input
                        type="time"
                        value={rescheduleEnd}
                        onChange={(e) =>
                          setRescheduleEnd(e.target.value)
                        }
                        className="w-full h-11 rounded-full px-4 bg-gray-100 dark:bg-[#3A3A3A] text-black dark:text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      setRescheduleMeeting(null)
                    }
                    className="px-5 py-2 rounded-full text-sm text-gray-600 dark:text-gray-300"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleRescheduleSave}
                    className="px-5 py-2 rounded-full bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}