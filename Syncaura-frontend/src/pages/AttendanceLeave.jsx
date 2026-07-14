import {
  Calendar,
  CircleCheckBig,
  Clock,
  Funnel,
  Search,
  XCircleIcon,
} from "lucide-react";
import AttendanceCard from "../components/AttendanceLeave/AttendanceCard";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import AttendanceList from "../components/AttendanceLeave/AttendanceList";
import { motion, AnimatePresence } from "framer-motion";
import { leaveHistory } from "../constant/constant";
import LeaveModel from "../components/AttendanceLeave/LeaveModel";
import AttendanceLeaveFilter from "../components/AttendanceLeave/AttendanceLeaveFilter";

const attendanceData = [
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

const AttendanceLeave = () => {
  const [selectedId, setSelectedId] = useState(0);
  const [openModel, setOpenModel] = useState(false);
  const [leaveData, setLeaveData] = useState(leaveHistory);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Check-In");
  const popupRef = useRef(null);
  const triggerRef = useRef(null);
  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

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
          item.status.toLowerCase().includes(debouncedValue),
      );
    }

    if (appliedFilters) {
      if (appliedFilters.status) {
        result = result.filter((item) => item.status === appliedFilters.status);
      }

      if (appliedFilters.type) {
        result = result.filter((item) => item.type === appliedFilters.type);
      }

      if (appliedFilters.date) {
        const selectedDate = new Date(appliedFilters.date);

        result = result.filter((item) => {
          const start = new Date(item.startDate);
          const end = new Date(item.endDate);
          return selectedDate >= start && selectedDate <= end;
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

  return (
    <div className="relative w-full min-h-[calc(92vh)] flex flex-col bg-[#FFFFFF] dark:bg-[#000000]">
      <div className="flex flex-col sm:flex-row gap-y-3 items-center justify-between px-5 py-5 border-b border-[#EDEDED]">
        <h1 className="text-2xl flex-2/5 xl:flex-3/5 font-medium text-[#000000] dark:text-[#FFFFFF]">
          Attendance And Leave Management
        </h1>
        <div className="flex w-full flex-3/5 md:flex-2/5 2xl:flex-1/5 items-center justify-center gap-2 ">
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
              Filter
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
              placeholder="Search"
              className="bg-transparent  dark:text-[#A19C9C] dark:placeholder:text-[#A19C9C] text-[#5C5C5C] placeholder:text-[#5C5C5C] outline-none text-sm w-full"
            />
          </div>
        </div>
      </div>
      <motion.div
  initial={{ opacity: 0, x: -40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
  className="flex items-center gap-6 px-4 py-3 mt-2 ml-4 max-w-[980px]"
>
        {attendanceData.map((item, index) => (
          <AttendanceCard key={index} {...item} />
        ))}
        <div className="relative inline-block ml-20">
          {/* TOP CARD */}
          <motion.div
  onClick={() => setShowPopup((prev) => !prev)}
  ref={triggerRef}
  whileTap={{ scale: 0.97 }}
  className="cursor-pointer w-[220px] h-[65px] px-4 rounded-2xl shadow-[0_0_10px_1px_#EDEDED] dark:shadow-[0_0_10px_1px_#171717] bg-[#FFFFFF] dark:bg-[#2E2F2F] flex flex-col justify-center"
>
  <h1 className="text-[#FF0000] font-medium text-lg">
    Mark the Presence
  </h1>

  <div className="flex items-center justify-between mt-1">
    <p className="text-[#000000] dark:text-[#F8F8F8] text-sm">
      In: -
    </p>

    <p className="text-[#000000] dark:text-[#F8F8F8] text-sm">
      Out: -
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
                    left-1/2 
                    -translate-x-1/2
                    mt-2 md:mt-5
                    z-50
                    w-[95vw] sm:w-[90vw] md:w-[400px] 
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
                        Daily Attendance
                      </h1>
                    </div>

                    <div className="flex items-center justify-center bg-[#FFE2E2D1] px-3 py-1 rounded-2xl">
                      <p className="text-sm font-normal text-[#FF0000]">
                        Absent
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col px-5 py-1 w-full gap-4">
                    <div className="flex w-full items-center justify-center border border-[#E0DDDD] dark:border-[#000000]">
                      <input
                        type="date"
                        className="w-full h-full text-[#898888] px-3 py-1 bg-white dark:bg-[#000000] dark:text-gray-200 outline-none date-input"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      {["Check-In", "CheckOut"].map((item, idx) => (
                        <motion.div
                          onClick={() => setSelectedTab(item)}
                          key={idx}
                          whileTap={{ scale: 0.95 }}
                          layout
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          className={`flex flex-1 items-center justify-center border ${
                            selectedTab === item
                              ? "border-[#2461E6] dark:border-[#73FBFD]"
                              : "border-[#EDEDED] dark:border-[#575757] cursor-pointer"
                          } px-5 py-2`}
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
                      ))}
                    </div>
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
            Date Range
          </h1>
          <h1 className="uppercase text-base font-medium dark:text-[#FFFFFF] text-[#000000] flex-1/9 w-full text-center">
            Type
          </h1>
          <h1 className="uppercase text-base font-medium dark:text-[#FFFFFF] text-[#000000] flex-3/9 w-full text-left">
            Reason
          </h1>
          <h1 className="uppercase text-base font-medium dark:text-[#FFFFFF] text-[#000000] flex-1/9 w-full text-center">
            Status
          </h1>
          <h1 className="uppercase text-base font-medium dark:text-[#FFFFFF] text-[#000000] flex-1/9 w-full text-center">
            Actions
          </h1>
        </div>

        <AttendanceList
          LeaveData={filteredLeaveHistory}
          currId={selectedId}
          setCurrId={setSelectedId}
        />
      </div>
      <div className="flex bg-[#FFFFFF] dark:bg-[#000000] flex-col items-center justify-center gap-5 md:hidden mt-5  w-full px-5 sm:px-10 ">
        <h1 className="flex items-center justify-center w-full text-2xl text-black dark:text-white font-bold">
          Leave List
        </h1>
        <AttendanceList
          currId={selectedId}
          setCurrId={setSelectedId}
          LeaveData={filteredLeaveHistory}
        />
      </div>

      <button
        onClick={() => setOpenModel(true)}
        className="fixed cursor-pointer bottom-8 right-8 rounded-2xl font-semibold px-7 py-3 z-30 bg-[#2457C5] text-[#EDEDED] dark:bg-[#73FBFD] dark:text-[#000000] text-base lg:text-xl btn-hover"
      >
        <p>Apply Leave</p>
      </button>

      {openModel && (
        <LeaveModel
          onClose={() => setOpenModel(false)}
          setLeaveData={setLeaveData}
        />
      )}
    </div>
  );
};

export default AttendanceLeave;
