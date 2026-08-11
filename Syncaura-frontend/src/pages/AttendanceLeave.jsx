import {
  Calendar,
  CircleCheckBig,
  Clock,
  Funnel,
  Search,
  XCircleIcon,
  Loader,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import AttendanceCard from "../components/AttendanceLeave/AttendanceCard";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import AttendanceList from "../components/AttendanceLeave/AttendanceList";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { leaveHistory } from "../constant/constant";
import LeaveModel from "../components/AttendanceLeave/LeaveModel";
import AttendanceLeaveFilter from "../components/AttendanceLeave/AttendanceLeaveFilter";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const initialAttendanceStats = [
  {
    title: "Present Days",
    value: 13,
    borderColor: "border-[#29CC39]",
    icon: <CircleCheckBig className="size-3.5 text-[#29CC39]" />,
  },
  {
    title: "Absent Days",
    value: 2,
    borderColor: "border-[#FF0000]",
    icon: (
      <div className="border border-[#FF0000] size-3.5">
        <XCircleIcon className="size-full text-[#FF0000]" />
      </div>
    ),
  },
  {
    title: "Leave Taken",
    value: 4,
    borderColor: "border-[#FF9500]",
    icon: <Calendar className="size-3.5 text-[#FF9500]" />,
  },
];

const ATTENDANCE_STORAGE_PREFIX = "syncaura:attendance:";

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
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [selectedId, setSelectedId] = useState(0);
  const [openModel, setOpenModel] = useState(false);
  const [leaveData, setLeaveData] = useState(leaveHistory);
  const [leaveToEdit, setLeaveToEdit] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Check-In");
  const popupRef = useRef(null);
  const triggerRef = useRef(null);
  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

  const [attendanceDate] = useState(getToday);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState(initialAttendanceStats);
  const attendanceStateRef = useRef(getInitialAttendanceState());
  const attendanceStorageKey = `${ATTENDANCE_STORAGE_PREFIX}${user?.id || user?.email || "current-user"}`;

  // Until an attendance API exists, this keeps a user's daily status stable across
  // refreshes, logins, and logouts. Replace this with a GET attendance-status call
  // when the backend endpoint is available.
  useEffect(() => {
    const emptyState = getInitialAttendanceState();

    try {
      const storedValue = localStorage.getItem(attendanceStorageKey);
      const storedState = storedValue ? JSON.parse(storedValue) : emptyState;
      attendanceStateRef.current = {
        presentDays: Number.isFinite(storedState.presentDays)
          ? storedState.presentDays
          : emptyState.presentDays,
        records: storedState.records && typeof storedState.records === "object"
          ? storedState.records
          : {},
      };
    } catch {
      attendanceStateRef.current = emptyState;
    }

    const todayRecord = attendanceStateRef.current.records[getToday()] || {};
    let isCurrent = true;

    queueMicrotask(() => {
      if (!isCurrent) return;

      setCheckInTime(todayRecord.checkInTime || null);
      setCheckOutTime(todayRecord.checkOutTime || null);
      setAttendanceStats((previousStats) =>
        previousStats.map((stat) =>
          stat.title === "Present Days"
            ? { ...stat, value: attendanceStateRef.current.presentDays }
            : stat,
        ),
      );
    });

    return () => {
      isCurrent = false;
    };
  }, [attendanceStorageKey]);

  const saveAttendanceState = (nextState) => {
    attendanceStateRef.current = nextState;
    localStorage.setItem(attendanceStorageKey, JSON.stringify(nextState));
  };

  const canCheckIn = !checkInTime && !checkOutTime;
  const canCheckOut = Boolean(checkInTime) && !checkOutTime;

  const handleConfirmAttendance = () => {
const nextState = {
  presentDays: attendanceStateRef.current.presentDays + 1,
  records: {
    ...attendanceStateRef.current.records,
    [attendanceDate]: { ...currentRecord, checkInTime: timeString },
  },
};

saveAttendanceState(nextState);

setAttendanceStats((previousStats) =>
  previousStats.map((stat) =>
    stat.title === "Present Days"
      ? { ...stat, value: nextState.presentDays }
      : stat,
  ),
);

setSelectedTab("CheckOut");

toast.success(t("attendance_marked_success", { date: attendanceDate }));
} else if (selectedTab === "CheckOut") {
  setCheckOutTime(timeString);

  saveAttendanceState({
    ...attendanceStateRef.current,
    records: {
      ...attendanceStateRef.current.records,
      [attendanceDate]: { ...currentRecord, checkOutTime: timeString },
    },
  });

  toast.success(t("attendance_checkout_success"));
}

    setIsSubmitting(true);
    // This is UI-only until the backend provides attendance endpoints.
    setTimeout(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const currentRecord = attendanceStateRef.current.records[attendanceDate] || {};
      
      if (selectedTab === "Check-In") {
        setCheckInTime(timeString);
const nextState = {
  presentDays: attendanceStateRef.current.presentDays + 1,
  records: {
    ...attendanceStateRef.current.records,
    [attendanceDate]: {
      ...currentRecord,
      checkInTime: timeString,
    },
  },
};

saveAttendanceState(nextState);

setAttendanceStats((previousStats) =>
  previousStats.map((stat) =>
    stat.title === "Present Days"
      ? { ...stat, value: nextState.presentDays }
      : stat,
  ),
);

setSelectedTab("CheckOut");

toast.success(t("attendance_marked_success", { date: attendanceDate }));

} else if (selectedTab === "CheckOut") {
  setCheckOutTime(timeString);

  saveAttendanceState({
    ...attendanceStateRef.current,
    records: {
      ...attendanceStateRef.current.records,
      [attendanceDate]: {
        ...currentRecord,
        checkOutTime: timeString,
      },
    },
  });

  toast.success(t("attendance_checkout_success"));
}
      }
      setIsSubmitting(false);
      setShowPopup(false);
    }, 1000);
  };

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedValue(search.toLowerCase()),
      500,
    );
    return () => clearTimeout(timer);
  }, [search]);

  const filteredLeaveHistory = useMemo(() => {
    let result = [...leaveData];

    if (debouncedValue) {
      result = result.filter(
        (item) =>
          item.reason.toLowerCase().includes(debouncedValue) ||
          item.status.toLowerCase().includes(debouncedValue) ||
          item.type.toLowerCase().includes(debouncedValue),
      );
    }

    if (appliedFilters) {
      if (appliedFilters.status && appliedFilters.status !== "All") {
        result = result.filter((item) => item.status === appliedFilters.status);
      }

      if (appliedFilters.type && appliedFilters.type !== "All") {
        result = result.filter((item) => item.type === appliedFilters.type);
      }

      if (appliedFilters.date) {
        const selectedDateStr = appliedFilters.date;
        result = result.filter((item) => {
          const startStr = item.startDate ? item.startDate.split("T")[0] : "";
          const endStr = item.endDate ? item.endDate.split("T")[0] : "";
          if (!startStr) return false;
          if (!endStr) return selectedDateStr >= startStr;
          return selectedDateStr >= startStr && selectedDateStr <= endStr;
        });
      }
    }

    return result;
  }, [leaveData, debouncedValue, appliedFilters]);

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

  const handleApplyFilters = useCallback((newFilters) => {
    setAppliedFilters(newFilters);
  }, []);

  const handleOpenCreateModal = () => {
    setLeaveToEdit(null);
    setOpenModel(true);
  };

  const handleOpenEditModal = (leave) => {
    setLeaveToEdit(leave);
    setOpenModel(true);
  };

  const handleCloseLeaveModal = () => {
    setOpenModel(false);
    setLeaveToEdit(null);
  };

  const handleDeleteLeave = (leave) => {
    if (!window.confirm("Are you sure you want to delete this leave request?")) {
      return;
    }

    setLeaveData((prev) => prev.filter((item) => item !== leave));
    toast.success("Leave request deleted successfully.");
  };

  return (
    <div className="relative w-full min-h-[calc(92vh)] flex flex-col bg-[#FFFFFF] dark:bg-[#000000]">
      <div className="flex flex-col sm:flex-row gap-y-3 items-center justify-between px-5 py-5 border-b border-[#EDEDED]">
        <h1 className="text-2xl flex-2/5 xl:flex-3/5 font-medium text-[#000000] dark:text-[#FFFFFF]">
          {t("attendanceAndLeaveManagement")}
        </h1>
        <div className="flex w-full flex-3/5 md:flex-2/5 2xl:flex-1/5 items-center justify-center gap-2 ">
          <Link
            to="/my-attendance"
            className="btn-hover px-4 py-2 bg-[#2461E6] dark:bg-[#73FBFD] text-white dark:text-black flex items-center gap-2 rounded-4xl font-semibold text-sm transition-transform active:scale-95 shadow-sm"
          >
            <UserCheck className="size-4" />
            <span>My Attendance</span>
          </Link>
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className={`btn-hover px-4 py-2 bg-white dark:bg-[#000000] flex items-center gap-2 border rounded-4xl ${showFilter ? "border-[#2461E6] dark:border-[#73FBFD]" : "border-[#989696] dark:border-[#989696]"} `}
          >
            <Funnel
              className={`size-5 ${showFilter ? "text-[#2461E6] dark:text-[#73FBFD]" : "text-[#082A44] dark:text-[#B2B2B2]"} `}
            />
            <h1
              className={`text-base ${showFilter ? "text-[#2461E6] dark:text-[#73FBFD]" : "text-[#575757] dark:text-[#8f8e8e]"}  font-semibold`}
            >
              {t("filter")}
            </h1>
          </button>
          <AnimatePresence mode="wait">
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full absolute left-0 top-30 md:top-20 z-100"
              >
                <AttendanceLeaveFilter
                  onClose={() => setShowFilter(false)}
                  onApply={handleApplyFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex w-full items-center gap-2 bg-[#EDEDED] dark:bg-[#2E2F2F]  px-3 py-2 rounded-4xl">
            <Search className="size-6 text-gray-500 dark:text-[#A19C9C]" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder={t("search")}
              className="bg-transparent  dark:text-[#A19C9C] dark:placeholder:text-[#A19C9C] text-[#5C5C5C] placeholder:text-[#5C5C5C] outline-none text-sm w-full"
            />
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-wrap items-center gap-4 sm:gap-6 px-4 py-3 mt-2 w-full"
      >
        {attendanceStats.map((item, index) => (
          <AttendanceCard key={index} {...item} />
        ))}
       <div className="relative w-full flex justify-center mt-2">
          {/* TOP CARD */}
          <motion.div
            onClick={() => setShowPopup((prev) => !prev)}
            ref={triggerRef}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer w-[220px] min-h-[90px] px-4 rounded-2xl shadow-[0_0_10px_1px_#EDEDED] dark:shadow-[0_0_10px_1px_#171717] bg-[#FFFFFF] dark:bg-[#2E2F2F] flex flex-col justify-center"
          >
            <h1 className={`font-medium text-lg ${checkInTime ? 'text-[#29CC39]' : 'text-[#FF0000]'}`}>
              {checkInTime ? t("attendance_presence_marked") : t("attendance_mark_presence")}
            </h1>

            <div className="flex items-center justify-between mt-1">
              <p className="text-[#000000] dark:text-[#F8F8F8] text-sm">
                {t("attendance_in")}: {checkInTime || '-'}
              </p>

              <p className="text-[#000000] dark:text-[#F8F8F8] text-sm">
                {t("attendance_out")}: {checkOutTime || '-'}
              </p>
            </div>
          </motion.div>

          {/* POPUP */}
          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 8, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="
                    absolute 
                    right-0
                    top-full
                    mt-2 md:mt-3
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
                      <h1 className="font-medium text-xl text-[#000000] dark:text-[#F8F8F8]">
                        {t("dailyAttendance")}
                      </h1>
                    </div>

                    <div className={`flex items-center justify-center px-3 py-1 rounded-2xl ${checkInTime ? 'bg-[#D1FAE5]' : 'bg-[#FFE2E2D1]'}`}>
                      <p className={`text-sm font-normal ${checkInTime ? 'text-[#29CC39]' : 'text-[#FF0000]'}`}>
                        {checkInTime ? t("present") : t("absent")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col px-5 py-1 w-full gap-4">
                    <div className="flex w-full items-center justify-center border border-[#E0DDDD] dark:border-[#000000]">
                      <input
                        type="date"
                        value={attendanceDate}
                        disabled
                        aria-label="Attendance date"
                        className="w-full h-full text-[#898888] px-3 py-1 bg-white dark:bg-[#000000] dark:text-gray-200 outline-none date-input disabled:cursor-not-allowed disabled:opacity-80"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      {["Check-In", "CheckOut"].map((item, idx) => {
                        const isDisabled = item === "Check-In" ? !canCheckIn : !canCheckOut;

                        return (
                        <motion.div
                          onClick={() => !isDisabled && setSelectedTab(item)}
                          key={idx}
                          whileTap={{ scale: 0.95 }}
                          layout
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          aria-disabled={isDisabled}
                          className={`flex flex-1 items-center justify-center border ${
                            selectedTab === item
                              ? "border-[#2461E6] dark:border-[#73FBFD]"
                              : "border-[#EDEDED] dark:border-[#575757]"
                          } ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} px-5 py-2 rounded-lg`}
                        >
                          <p
                            className={`font-bold text-xs ${
                              selectedTab === item
                                ? "text-[#2461E6] dark:text-[#73FBFD]"
                                : "text-[#554d4d] dark:text-gray-400"
                            }`}
                          >
                            {item}
                          </p>
                        </motion.div>
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
                          {t("attendance_confirming")}
                        </>
                      ) : (
selectedTab === "Check-In"
  ? canCheckIn
    ? "Check In"
    : "Checked In"
  : canCheckOut
    ? "Check Out"
    : checkOutTime
      ? "Attendance Complete"
      : t("attendance_check_in_required")
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="hidden md:flex flex-col flex-1 w-full mt-5 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div
          className="sticky top-0 z-20
          flex items-center justify-between w-full
          border-t border-b border-[#EDEDED] dark:border-[#575757]
          bg-[#FFFFFF] dark:bg-[#000000]
          shadow-[0_4px_10px_0_rgba(0,0,0,0.25)]
          px-11 py-5"
        >
          <h1 className="uppercase text-base font-medium dark:text-[#FFFFFF] text-[#000000] flex-3/9 w-full text-center">
            {t("dateRange")}
          </h1>
          <h1 className="uppercase text-base font-medium dark:text-[#FFFFFF] text-[#000000] flex-1/9 w-full text-center">
            {t("type")}
          </h1>
          <h1 className="uppercase text-base font-medium dark:text-[#FFFFFF] text-[#000000] flex-3/9 w-full text-left">
            {t("reason")}
          </h1>
          <h1 className="uppercase text-base font-medium dark:text-[#FFFFFF] text-[#000000] flex-1/9 w-full text-center">
            {t("status")}
          </h1>
          <h1 className="uppercase text-base font-medium dark:text-[#FFFFFF] text-[#000000] flex-1/9 w-full text-center">
            {t("actions")}
          </h1>
        </div>

        <AttendanceList
          LeaveData={filteredLeaveHistory}
          currId={selectedId}
          setCurrId={setSelectedId}
          onEditLeave={handleOpenEditModal}
          onDeleteLeave={handleDeleteLeave}
        />
      </div>
      <div className="flex bg-[#FFFFFF] dark:bg-[#000000] flex-col items-center justify-center gap-5 md:hidden mt-5  w-full px-5 sm:px-10 ">
        <h1 className="flex items-center justify-center w-full text-2xl text-black dark:text-white font-bold">
          {t("leaveList")}
        </h1>
        <AttendanceList
          currId={selectedId}
          setCurrId={setSelectedId}
          LeaveData={filteredLeaveHistory}
          onEditLeave={handleOpenEditModal}
          onDeleteLeave={handleDeleteLeave}
        />
      </div>

      <button
        onClick={handleOpenCreateModal}
        className="fixed cursor-pointer bottom-8 right-8 rounded-2xl font-semibold px-7 py-3 z-30 bg-[#2457C5] text-[#EDEDED] dark:bg-[#73FBFD] dark:text-[#000000] text-base lg:text-xl btn-hover"
      >
        <p>{t("applyLeave")}</p>
      </button>

      {openModel && (
        <LeaveModel
          onClose={handleCloseLeaveModal}
          setLeaveData={setLeaveData}
          editingLeave={leaveToEdit}
        />
      )}

      {selectedLeaveDetail && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-xs"
            onClick={() => setSelectedLeaveDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#2E2F2F] rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700">
                <h2 className="text-xl font-bold dark:text-white text-black">
                  {t("leaveDetails")}
                </h2>
                <button
                  onClick={() => setSelectedLeaveDetail(null)}
                  className="text-gray-500 hover:text-black dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-3 text-sm dark:text-gray-200">
                <div>
                  <span className="font-semibold text-gray-500 dark:text-gray-400">{t("leaveTypeLabel")}</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-[#73FBFD]">{selectedLeaveDetail.type}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 dark:text-gray-400">{t("status")}</span>{" "}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${selectedLeaveDetail.status === 'Approved' ? 'bg-green-100 text-green-700' : selectedLeaveDetail.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedLeaveDetail.status}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 dark:text-gray-400">{t("duration")}</span>{" "}
                  {new Date(selectedLeaveDetail.startDate).toLocaleDateString()} - {new Date(selectedLeaveDetail.endDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold text-gray-500 dark:text-gray-400">{t("reason")}</span>
                  <p className="mt-1 p-3 bg-gray-100 dark:bg-black/30 rounded-xl italic">
                    "{selectedLeaveDetail.reason}"
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLeaveDetail(null)}
                className="mt-6 w-full bg-blue-600 dark:bg-[#73FBFD] dark:text-black text-white py-2 rounded-xl font-medium"
              >
                {t("close")}
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default AttendanceLeave;
