import {
  Calendar,
  CircleCheckBig,
  Clock,
  Funnel,
  Search,
  XCircleIcon,
  Loader,
  UserCheck,
  Laptop,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import AttendanceCard from "../components/AttendanceLeave/AttendanceCard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AttendanceList from "../components/AttendanceLeave/AttendanceList";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import api from "../config/axios";

import LeaveModel from "../components/AttendanceLeave/LeaveModel";
import AttendanceLeaveFilter from "../components/AttendanceLeave/AttendanceLeaveFilter";
import AdminAttendanceList from "../components/AttendanceLeave/AdminAttendanceList";
import Pagination from "../components/common/Pagination";
import { toast } from "react-toastify";

const initialAttendanceStats = [
  {
    title: "Present Days",
    value: 0,
    borderColor: "border-[#29CC39]",
    icon: <CircleCheckBig className="size-3.5 text-[#29CC39]" />,
  },
  {
    title: "Absent Days",
    value: 0,
    borderColor: "border-[#FF0000]",
    icon: (
      <div className="border border-[#FF0000] size-3.5">
        <XCircleIcon className="size-full text-[#FF0000]" />
      </div>
    ),
  },
  {
    title: "Leave Taken",
    value: 0,
    borderColor: "border-[#FF9500]",
    icon: <Calendar className="size-3.5 text-[#FF9500]" />,
  },
  {
    title: "Work From Home",
    value: 0,
    borderColor: "border-[#2461E6] dark:border-[#73FBFD]",
    icon: <Laptop className="size-3.5 text-[#2461E6] dark:text-[#73FBFD]" />,
  },
];

const ATTENDANCE_STORAGE_PREFIX = "syncaura:attendance:";
const LEAVE_STORAGE_PREFIX = "syncaura:leaves:";

const getToday = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().split("T")[0];
};

const getInitialAttendanceState = () => ({
  presentDays: initialAttendanceStats.find((stat) => stat.title === "Present Days")
    .value,
  records: {},
});

const AttendanceLeave = () => {
  const user = useSelector((state) => state.auth.user);
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    // ignore
  }
  const currentUser = user || storedUser;
  const currentRole = (currentUser?.role || "").toLowerCase();
  const isAdminOrCoAdmin = currentRole === "admin" || currentRole === "co-admin" || currentRole === "coadmin";
  const [activeAdminView, setActiveAdminView] = useState("leaves"); // "leaves" | "attendance"

  const [selectedId, setSelectedId] = useState(0);
  const [openModel, setOpenModel] = useState(false);
  const [leaveToEdit, setLeaveToEdit] = useState(null);
  const [selectedLeaveDetail, setSelectedLeaveDetail] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Check-In");
  const popupRef = useRef(null);
  const triggerRef = useRef(null);
  const dateInputRef = useRef(null);
  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Editable attendance date (feature/attendance-date-picker-ui) — defaults to today,
  // but the user can pick another date to mark/view attendance for.
  const [attendanceDate, setAttendanceDate] = useState(getToday);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [attendanceStats, setAttendanceStats] = useState(initialAttendanceStats);
  const attendanceStateRef = useRef(getInitialAttendanceState());
  const attendanceStorageKey = `${ATTENDANCE_STORAGE_PREFIX}${currentUser?.id || currentUser?.email || "current-user"}`;
  const leaveStorageKey = `${LEAVE_STORAGE_PREFIX}${currentUser?.id || currentUser?.email || "current-user"}`;

  // Load leave data from localStorage (persists across refreshes)
  const [leaveData, setLeaveData] = useState(() => {
    try {
      const stored = localStorage.getItem(leaveStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist leave data to localStorage whenever it changes
  const syncLeavesToStorage = useCallback(
    (updater) => {
      setLeaveData((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        try {
          localStorage.setItem(leaveStorageKey, JSON.stringify(next));
        } catch {
          // storage quota exceeded — silently ignore
        }
        return next;
      });
    },
    [leaveStorageKey]
  );

  const [leaveStats, setLeaveStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    approvedDays: 0,
    pendingDays: 0,
  });

  const fetchLeaves = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      let activeUser = user;
      if (!activeUser) {
        try {
          activeUser = JSON.parse(localStorage.getItem("user") || "null");
        } catch {
          // ignore
        }
      }
      const role = (activeUser?.role || "").toLowerCase();
      const isAdmin = role === "admin" || role === "co-admin" || role === "coadmin";
      const endpoint = isAdmin ? "/leave/allleaves" : "/leave/myleaves";

      if (token) {
        const response = await api.get(endpoint, {
          params: { page: currentPage, limit: 10 },
        });

        const data = response.data;
        setTotalPages(data.totalPages || 1);

        if (data.stats || data.balance) {
          setLeaveStats(data.stats || data.balance);
        } else {
          api.get("/leave/balance").then(bRes => {
            if (bRes.data?.data) setLeaveStats(bRes.data.data);
          }).catch(() => {});
        }

        if (Array.isArray(data.leaves)) {
          const formattedLeaves = data.leaves.map((leave) => ({
            ...leave,
            startDate: leave.from_date || leave.startDate,
            endDate: leave.to_date || leave.endDate,
            type: leave.leave_type || leave.type || "Casual Leave",
            leave_type: leave.leave_type || leave.type || "Casual Leave",
            user_name: leave.user_name || leave.employee_name || leave.userName || "Employee",
            user_email: leave.user_email || leave.email || "—",
          }));
          setLeaveData(formattedLeaves);
          return;
        }
      }

      // If no token or empty list, fall back to local storage
      try {
        const stored = localStorage.getItem(leaveStorageKey);
        if (stored) {
          const localLeaves = JSON.parse(stored);
          if (Array.isArray(localLeaves) && localLeaves.length > 0) {
            setLeaveData(localLeaves);
          }
        }
      } catch {
        // ignore
      }
    } catch (error) {
      console.warn("Error fetching leaves from backend, using local fallback:", error.message);
      try {
        const stored = localStorage.getItem(leaveStorageKey);
        if (stored) {
          const localLeaves = JSON.parse(stored);
          if (Array.isArray(localLeaves) && localLeaves.length > 0) {
            setLeaveData(localLeaves);
          }
        }
      } catch {
        // ignore
      }
    }
  }, [user, currentPage, leaveStorageKey]);


  // Helper to fetch user's current browser location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Geolocation is not supported by your browser."));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  useEffect(() => {
    const emptyState = getInitialAttendanceState();

    try {
      const storedValue = localStorage.getItem(attendanceStorageKey);
      const storedState = storedValue ? JSON.parse(storedValue) : emptyState;
      attendanceStateRef.current = {
        presentDays: Number.isFinite(storedState.presentDays)
          ? storedState.presentDays
          : emptyState.presentDays,
        records:
          storedState.records && typeof storedState.records === "object"
            ? storedState.records
            : {},
      };
    } catch {
      attendanceStateRef.current = emptyState;
    }

    const todayRecord = attendanceStateRef.current.records[getToday()] || {};
    let isCurrent = true;

    if (isCurrent) {
      setCheckInTime(todayRecord.in || null);
      setCheckOutTime(todayRecord.out || null);
      setSelectedTab(todayRecord.in && !todayRecord.out ? "Check-Out" : "Check-In");
    }

    // Task 6: Keep correct attendance status after refresh by fetching from backend API
    const syncStatusWithBackend = async () => {
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const response = await api.get(`/attendance/my-attendance?month=${month}&year=${year}`);
        if (response.data && response.data.success && Array.isArray(response.data.records)) {
          const todayStr = getToday();
          const todayRec = response.data.records.find((r) => r.date === todayStr);
          const isSample = todayRec && String(todayRec.id).startsWith("sample-");

          if (todayRec && !isSample && isCurrent) {
            const inTime = (todayRec.check_in_time && todayRec.check_in_time !== "-") ? todayRec.check_in_time : null;
            const outTime = (todayRec.check_out_time && todayRec.check_out_time !== "-") ? todayRec.check_out_time : null;
            setCheckInTime(inTime);
            setCheckOutTime(outTime);
            setSelectedTab(inTime && !outTime ? "Check-Out" : "Check-In");

            const currentRecords = { ...attendanceStateRef.current.records };
            currentRecords[todayStr] = {
              ...currentRecords[todayStr],
              in: inTime,
              out: outTime,
              status: todayRec.status || "Present",
            };
            attendanceStateRef.current.records = currentRecords;
            try {
              localStorage.setItem(attendanceStorageKey, JSON.stringify(attendanceStateRef.current));
            } catch { /* ignore */ }
          } else if (isCurrent && (!todayRec || isSample)) {
            // No real record marked for today yet in DB - keep state ready for Check-In
            setCheckInTime(null);
            setCheckOutTime(null);
            setSelectedTab("Check-In");

            const currentRecords = { ...attendanceStateRef.current.records };
            delete currentRecords[todayStr];
            attendanceStateRef.current.records = currentRecords;
            try {
              localStorage.setItem(attendanceStorageKey, JSON.stringify(attendanceStateRef.current));
            } catch { /* ignore */ }
          }
        }
      } catch (err) {
        console.warn("Could not sync attendance status from backend:", err.message);
      }
    };

    syncStatusWithBackend();

    return () => {
      isCurrent = false;
    };
  }, [attendanceStorageKey]);

  // Whenever the selected attendance date changes (via the date picker), reflect
  // that date's stored check-in/check-out times instead of always showing today's.
  useEffect(() => {
    const record = attendanceStateRef.current.records[attendanceDate] || {};
    setCheckInTime(record.in || null);
    setCheckOutTime(record.out || null);
    setSelectedTab(record.in && !record.out ? "Check-Out" : "Check-In");
  }, [attendanceDate]);

  const canCheckIn = !checkInTime;
  const canCheckOut = Boolean(checkInTime && !checkOutTime);

  const handleConfirmAttendance = async () => {
    if (selectedTab === "Check-In" && !canCheckIn) {
      toast.info("You have already checked in for this date.");
      return;
    }

    if (selectedTab === "Check-Out" && !canCheckOut) {
      if (!checkInTime) {
        toast.error("Please check in before checking out.");
      } else {
        toast.info("You have already completed attendance for this date.");
      }
      return;
    }

    setIsSubmitting(true);

    // Task 1 & 2: Ask for current location using browser location feature
    let locationData;
    try {
      locationData = await getUserLocation();
    } catch (geoErr) {
      setIsSubmitting(false);
      // Task 4: Handle Location Permission Error
      if (geoErr.code === 1) { // PERMISSION_DENIED
        toast.error("Location permission is required to mark office attendance.");
      } else if (geoErr.code === 2) { // POSITION_UNAVAILABLE
        toast.error("Location information is unavailable. Please enable GPS and try again.");
      } else if (geoErr.code === 3) { // TIMEOUT
        toast.error("Location request timed out. Please try again.");
      } else {
        toast.error(geoErr.message || "Location permission is required to mark office attendance.");
      }
      return;
    }

    const isToday = attendanceDate === getToday();
    const endpoint = selectedTab === "Check-In" ? "/attendance/check-in" : "/attendance/check-out";

    // Task 1 & 2: Send latitude, longitude, and location accuracy to backend
    const payload = {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      accuracy: locationData.accuracy,
      date: attendanceDate,
    };

    try {
      const response = await api.post(endpoint, payload);

      if (response.data && response.data.success) {
        const serverTime =
          response.data.data?.check_in_time ||
          response.data.data?.check_out_time ||
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

        const currentRecords = { ...attendanceStateRef.current.records };
        const selectedRecord = currentRecords[attendanceDate] || {};

        if (selectedTab === "Check-In") {
          currentRecords[attendanceDate] = {
            ...selectedRecord,
            in: serverTime,
            status: "Present",
            lat: locationData.latitude,
            lng: locationData.longitude,
            accuracy: locationData.accuracy,
          };
          if (!selectedRecord.in) {
            attendanceStateRef.current.presentDays += 1;
          }
          setCheckInTime(serverTime);
          setSelectedTab("Check-Out");
          toast.success(
            response.data.message ||
              (isToday
                ? `Checked in successfully at ${serverTime}!`
                : `Checked in for ${attendanceDate} at ${serverTime}!`)
          );
        } else {
          currentRecords[attendanceDate] = {
            ...selectedRecord,
            out: serverTime,
          };
          setCheckOutTime(serverTime);
          toast.success(
            response.data.message ||
              (isToday
                ? `Checked out successfully at ${serverTime}!`
                : `Checked out for ${attendanceDate} at ${serverTime}!`)
          );
        }

        attendanceStateRef.current.records = currentRecords;

        try {
          localStorage.setItem(
            attendanceStorageKey,
            JSON.stringify(attendanceStateRef.current)
          );
        } catch {
          // ignore storage quota issues
        }

        setAttendanceStats((prev) =>
          prev.map((stat) =>
            stat.title === "Present Days"
              ? { ...stat, value: attendanceStateRef.current.presentDays }
              : stat
          )
        );

        setShowPopup(false);
      } else {
        // Task 5: Show Location Errors
        toast.error(response.data?.message || "Attendance verification failed.");
      }
    } catch (apiErr) {
      console.warn("Attendance API error response:", apiErr);
      const backendMsg = apiErr.response?.data?.message || apiErr.response?.data?.error || apiErr.message;
      // Task 5: Show Location Errors (e.g. "You are outside the workplace attendance area.")
      toast.error(backendMsg || "Attendance location verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(search.toLowerCase()), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredLeaveHistory = useMemo(() => {
    let result = [...leaveData];

    if (debouncedValue) {
      result = result.filter(
        (item) =>
          (item.reason || "").toLowerCase().includes(debouncedValue) ||
          (item.status || "").toLowerCase().includes(debouncedValue) ||
          (item.type || "").toLowerCase().includes(debouncedValue) ||
          (item.leave_type || "").toLowerCase().includes(debouncedValue) ||
          (item.user_name || item.userName || "").toLowerCase().includes(debouncedValue) ||
          (item.user_email || item.email || "").toLowerCase().includes(debouncedValue),
      );
    }

    if (appliedFilters) {
      if (appliedFilters.status && appliedFilters.status !== "All") {
        result = result.filter((item) => String(item.status || "").toLowerCase() === appliedFilters.status.toLowerCase());
      }

      if (appliedFilters.type && appliedFilters.type !== "All") {
        result = result.filter((item) => (item.type || item.leave_type) === appliedFilters.type);
      }

      if (appliedFilters.date) {
        const selectedDateStr = appliedFilters.date;
        result = result.filter((item) => {
          const startStr = item.startDate ? item.startDate.split("T")[0] : "";
          const endStr = item.endDate ? item.endDate.split("T")[0] : "";
          if (!startStr) return false;
          return selectedDateStr >= startStr && (!endStr || selectedDateStr <= endStr);
        });
      }
    }

    return result;
  }, [leaveData, debouncedValue, appliedFilters]);

  const LEAVE_PAGE_SIZE = 8;
  const totalLeavePages = Math.ceil(filteredLeaveHistory.length / LEAVE_PAGE_SIZE) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedValue, appliedFilters]);

  const paginatedLeaveHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * LEAVE_PAGE_SIZE;
    return filteredLeaveHistory.slice(startIndex, startIndex + LEAVE_PAGE_SIZE);
  }, [filteredLeaveHistory, currentPage, LEAVE_PAGE_SIZE]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    }

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
  };

  const handleOpenCreateModal = () => {
    setLeaveToEdit(null);
    setOpenModel(true);
  };

  const handleStatusChange = async (leaveItem, newStatus) => {
    try {
      const normalizedStatus = newStatus.toLowerCase();
      const displayStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();

      if (leaveItem.id) {
        await api.put(`/leave/${leaveItem.id}/status`, { status: normalizedStatus });
      }

      syncLeavesToStorage((prev) =>
        prev.map((item) =>
          item === leaveItem || (item.id && item.id === leaveItem.id)
            ? { ...item, status: displayStatus }
            : item
        )
      );

      toast.success(`Leave status updated to ${displayStatus}`);
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update leave status");
    }
  };

  const handleOpenEditModal = (leave) => {
    setLeaveToEdit(leave);
    setOpenModel(true);
  };

  const handleCloseLeaveModal = () => {
    setOpenModel(false);
    setLeaveToEdit(null);
  };

  const handleDeleteLeave = async (leave) => {
    if (!window.confirm("Are you sure you want to delete this leave request?")) {
      return;
    }
    try {
      if (leave.id) {
        await api.delete(`/leave/${leave.id}`);
      }
      syncLeavesToStorage((prev) => prev.filter((item) => item !== leave && (!item.id || item.id !== leave.id)));
      toast.success("Leave request deleted successfully.");
      fetchLeaves();
    } catch (error) {
      console.error("Error deleting leave:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete leave request");
    }
  };

  return (
    <div className="relative w-full min-h-[calc(92vh)] flex flex-col bg-[#FFFFFF] dark:bg-[#000000] pb-28">
      {/* Header Section Updated for Perfect Alignment */}
      <div className="relative flex flex-col lg:flex-row gap-y-3 items-center justify-between px-5 py-5 border-b border-[#EDEDED] dark:border-[#575757]">
        <h1 className="text-xl lg:text-2xl font-medium text-[#000000] dark:text-[#FFFFFF] w-full lg:w-auto">
          Attendance And Leave Management
        </h1>
        <div className="flex w-full flex-3/5 md:flex-2/5 2xl:flex-3/5 items-center justify-center gap-2 ">
          <Link
            to="/my-attendance"
            className="btn-hover px-4 py-2 bg-[#2461E6] dark:bg-[#73FBFD] text-white dark:text-black flex items-center gap-2 rounded-xl font-semibold text-sm transition-transform active:scale-95 shadow-sm whitespace-nowrap"
          >
            <UserCheck className="size-4" />
            <span>My Attendance</span>
          </Link>

          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className={`btn-hover px-4 py-2 flex items-center justify-center gap-2 border rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              showFilter || appliedFilters
                ? "border-[#2461E6] bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:border-[#73FBFD] dark:text-[#73FBFD]"
                : "border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#121212] text-gray-800 dark:text-gray-200 hover:border-blue-500 dark:hover:border-[#73FBFD]"
            }`}
          >
            <Funnel className="size-4" />
            <span>{appliedFilters ? "Filtered" : "Filter"}</span>
            {appliedFilters && (
              <span className="size-2 rounded-full bg-[#2461E6] dark:bg-[#73FBFD]" />
            )}
          </button>

          {/* Search bar */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2A2A2A] px-3.5 py-2 rounded-xl w-[170px] sm:w-[200px] lg:w-[220px] shadow-xs">
            <Search className="size-4 text-gray-400 dark:text-gray-500 shrink-0" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="Search leaves..."
              className="bg-transparent dark:text-gray-200 dark:placeholder:text-gray-500 text-gray-800 placeholder:text-gray-400 outline-none text-sm font-medium w-full"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute left-0 top-full mt-1 w-full z-50 px-5"
            >
              <AttendanceLeaveFilter onClose={() => setShowFilter(false)} onApply={handleApplyFilters} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isAdminOrCoAdmin && (
        <div className="flex items-center gap-2.5 px-5 sm:px-10 mt-3 mb-1">
          <button
            type="button"
            onClick={() => setActiveAdminView("leaves")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeAdminView === "leaves"
                ? "bg-blue-600 text-white dark:bg-[#73FBFD] dark:text-black shadow-xs"
                : "bg-gray-100 dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2A2A2A]"
            }`}
          >
            Leave Requests
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminView("attendance")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeAdminView === "attendance"
                ? "bg-blue-600 text-white dark:bg-[#73FBFD] dark:text-black shadow-xs"
                : "bg-gray-100 dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2A2A2A]"
            }`}
          >
            Employee Daily Attendance
          </button>
        </div>
      )}

      {isAdminOrCoAdmin && activeAdminView === "attendance" ? (
        <AdminAttendanceList defaultDate={attendanceDate} />
      ) : (
        <>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 px-4 py-3 mt-2 w-full items-stretch"
      >
        {attendanceStats.map((item, index) => (
          <div key={index} className="w-full flex justify-center">
            <AttendanceCard {...item} />
          </div>
        ))}

        <div className="relative w-full flex justify-center">
          <motion.div
            onClick={() => setShowPopup((prev) => !prev)}
            ref={triggerRef}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer w-full max-w-[220px] min-h-[90px] px-4 py-4 rounded-2xl shadow-[0_0_10px_1px_#EDEDED] dark:shadow-[0_0_10px_1px_#171717] bg-[#FFFFFF] dark:bg-[#2E2F2F] flex flex-col justify-center"
          >
            <h1 className={`font-semibold text-xs sm:text-sm ${checkInTime ? "text-[#29CC39]" : "text-[#FF0000]"}`}>
              {checkInTime ? "Presence Marked" : "Mark the Presence"}
            </h1>

            <div className="flex items-center justify-between mt-2">
              <p className="text-[#000000] dark:text-[#F8F8F8] text-xs">
                In: <span className="font-semibold">{checkInTime || "-"}</span>
              </p>

              <p className="text-[#000000] dark:text-[#F8F8F8] text-xs">
                Out: <span className="font-semibold">{checkOutTime || "-"}</span>
              </p>
            </div>
          </motion.div>

          {/* POPUP */}
          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="
                  absolute
                  right-full
                  top-0
                  mr-3
                  z-50
                  w-[90vw] sm:w-[380px] md:w-[400px]
              "
              >
                <div
                  ref={popupRef}
                  className="
                    flex flex-col gap-4
                    bg-[#FFFFFF] dark:bg-[#2E2F2F]
                    shadow-[0_0_10px_1px_#E0DDDD] dark:shadow-[0_0_10px_1px_#1D1D1D]
                    pt-2 pb-5 px-4
                    rounded-xl
                    w-full
                    sm:max-w-[420px]
                    md:max-w-[400px]
                  "
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="size-5 text-[#000000] dark:text-[#F8F8F8]" />
                      <h1 className="font-medium text-xl text-[#000000] dark:text-[#F8F8F8]">Daily Attendance</h1>
                    </div>

                    <div
                      className={`flex items-center justify-center px-3 py-1 rounded-2xl ${checkInTime ? "bg-[#D1FAE5]" : "bg-[#FFE2E2D1]"}`}
                    >
                      <p className={`text-sm font-normal ${checkInTime ? "text-[#29CC39]" : "text-[#FF0000]"}`}>
                        {checkInTime ? "Present" : "Absent"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col px-5 py-1 w-full gap-4">
                    {/* Editable date picker (feature/attendance-date-picker-ui) */}
                    <div className="flex w-full items-center gap-3 border border-[#E0DDDD] dark:border-[#575757] rounded-lg px-3 py-2 bg-white dark:bg-[#000000]">
                      <Calendar
                        className="size-5 text-[#898888] dark:text-gray-300 shrink-0 cursor-pointer"
                        onClick={() => dateInputRef.current?.showPicker?.()}
                      />

                      <input
                        ref={dateInputRef}
                        type="date"
                        value={attendanceDate}
                        max={getToday()}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        aria-label="Attendance date"
                        className="date-input w-full bg-transparent text-[#898888] dark:text-gray-200 outline-none cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      {["Check-In", "Check-Out"].map((item) => {
                        const isSelected = selectedTab === item;
                        const isDisabled = isSubmitting || (item === "Check-In" ? !canCheckIn : !canCheckOut);

                        return (
                          <motion.button
                            type="button"
                            key={item}
                            onClick={() => setSelectedTab(item)}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            disabled={isDisabled}
                            className={`flex-1 flex items-center justify-center
                              px-5 py-3 rounded-xl border
                              font-bold text-sm transition-all duration-200
                              ${
                                isSelected
                                  ? "border-[#2461E6] bg-[#EEF4FF] text-[#2461E6] dark:border-[#73FBFD] dark:bg-[#73FBFD]/10 dark:text-[#73FBFD]"
                                  : "border-[#E0E0E0] bg-transparent text-[#554D4D] dark:border-[#575757] dark:text-gray-400"
                              }
                              ${
                                isDisabled
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer hover:border-[#2461E6] dark:hover:border-[#73FBFD]"
                              }
                            `}
                          >
                            {item}
                          </motion.button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleConfirmAttendance}
                      disabled={isSubmitting || (selectedTab === "Check-In" ? !canCheckIn : !canCheckOut)}
                      className="w-full mt-2 flex items-center justify-center gap-2 bg-[#2461E6] hover:bg-[#1a4bb3] text-white dark:bg-[#73FBFD] dark:hover:bg-[#5ce1e3] dark:text-black py-2 rounded-lg font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="size-4 animate-spin" />
                          Verifying location...
                        </>
                      ) : selectedTab === "Check-In" ? (
                        canCheckIn ? (
                          "Check In"
                        ) : (
                          "Checked In"
                        )
                      ) : canCheckOut ? (
                        "Check Out"
                      ) : checkOutTime ? (
                        "Attendance Complete"
                      ) : (
                        "Check-in required first"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Leave Status Summary Banner */}
      {(!isAdminOrCoAdmin || activeAdminView === "leaves") && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 mt-4 w-full">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50/60 dark:bg-[#73FBFD]/10 border border-blue-100 dark:border-[#73FBFD]/20">
            <span className="text-xl">📋</span>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Requests</p>
              <p className="text-base font-bold text-blue-700 dark:text-[#73FBFD]">
                {leaveStats.total || leaveData.length} Requests
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Approved</p>
              <p className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                {leaveStats.approved !== undefined ? leaveStats.approved : leaveData.filter(l => (l.status || '').toLowerCase() === 'approved').length} Leaves
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30">
            <span className="text-xl">⏳</span>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Pending</p>
              <p className="text-base font-bold text-amber-700 dark:text-amber-400">
                {leaveStats.pending !== undefined ? leaveStats.pending : leaveData.filter(l => (l.status || '').toLowerCase() === 'pending').length} Requests
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/30">
            <span className="text-xl">❌</span>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Rejected</p>
              <p className="text-base font-bold text-rose-700 dark:text-rose-400">
                {leaveStats.rejected !== undefined ? leaveStats.rejected : leaveData.filter(l => (l.status || '').toLowerCase() === 'rejected').length} Requests
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:flex flex-col flex-1 w-full mt-5 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div
          className="sticky top-0 z-20
          flex items-center justify-between w-full
          border-t border-b border-[#EDEDED] dark:border-[#575757]
          bg-[#FFFFFF] dark:bg-[#000000]
          shadow-[0_4px_10px_0_rgba(0,0,0,0.25)]
          px-10 py-4"
        >
          <h1 className="uppercase text-xs font-semibold dark:text-[#FFFFFF] text-[#000000] w-[22%] text-left px-3">
            Applicant
          </h1>
          <h1 className="uppercase text-xs font-semibold dark:text-[#FFFFFF] text-[#000000] w-[16%] text-center px-2">
            Leave Type
          </h1>
          <h1 className="uppercase text-xs font-semibold dark:text-[#FFFFFF] text-[#000000] w-[22%] text-center px-2">
            Duration
          </h1>
          <h1 className="uppercase text-xs font-semibold dark:text-[#FFFFFF] text-[#000000] w-[24%] text-left px-3">
            Reason
          </h1>
          <h1 className="uppercase text-xs font-semibold dark:text-[#FFFFFF] text-[#000000] w-[16%] text-center">
            Status
          </h1>
        </div>

        <AttendanceList
          LeaveData={paginatedLeaveHistory}
          currId={selectedId}
          setCurrId={setSelectedId}
          isAdminOrCoAdmin={isAdminOrCoAdmin}
          onStatusChange={handleStatusChange}
          onEditLeave={handleOpenEditModal}
          onDeleteLeave={handleDeleteLeave}
        />

        {/* Desktop Pagination */}
        <div className="px-6 mt-4 mb-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalLeavePages}
            totalItems={filteredLeaveHistory.length}
            pageSize={LEAVE_PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="leave requests"
          />
        </div>
      </div>

      <div className="flex bg-[#FFFFFF] dark:bg-[#000000] flex-col items-center justify-center gap-5 md:hidden mt-5 w-full px-5 sm:px-10 pb-16">
        <h1 className="flex items-center justify-center w-full text-2xl text-black dark:text-white font-bold">
          Leave List
        </h1>
        <AttendanceList
          currId={selectedId}
          setCurrId={setSelectedId}
          LeaveData={paginatedLeaveHistory}
          isAdminOrCoAdmin={isAdminOrCoAdmin}
          onStatusChange={handleStatusChange}
          onEditLeave={handleOpenEditModal}
          onDeleteLeave={handleDeleteLeave}
        />

        {/* Mobile Pagination */}
        <div className="w-full mt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalLeavePages}
            totalItems={filteredLeaveHistory.length}
            pageSize={LEAVE_PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="leave requests"
          />
        </div>
      </div>
      </>
      )}

      {(!isAdminOrCoAdmin || activeAdminView === "leaves") && (
        <button
          onClick={handleOpenCreateModal}
          className="fixed cursor-pointer bottom-8 right-8 rounded-2xl font-semibold px-6 py-3 z-30 bg-[#2457C5] text-[#EDEDED] dark:bg-[#73FBFD] dark:text-[#000000] text-base lg:text-xl btn-hover flex items-center gap-2 shadow-lg"
        >
          <Plus className="size-5 lg:size-6" />
          <span>Apply Leave</span>
        </button>
      )}

      {openModel && (
        <LeaveModel
          onClose={handleCloseLeaveModal}
          setLeaveData={syncLeavesToStorage}
          editingLeave={leaveToEdit}
          onSuccess={() => fetchLeaves()}
        />
      )}
    </div>
  );
};

export default AttendanceLeave;