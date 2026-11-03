import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Search,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Laptop,
  RefreshCw,
  Loader,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../config/axios";
import { toast } from "react-toastify";
import Pagination from "../common/Pagination";

const statusBadgeStyle = {
  present:
    "text-[#29CC39] dark:text-[#34D399] bg-[#E8F8EA] dark:bg-[#064E3B]/40 border border-[#29CC39]/30",
  late:
    "text-[#C05328] dark:text-[#FBBF24] bg-[#FDEEE8] dark:bg-[#78350F]/40 border border-[#C05328]/30",
  absent:
    "text-[#C71212] dark:text-[#F87171] bg-[#FCE8E8] dark:bg-[#7F1D1D]/40 border border-[#C71212]/30",
  "on leave":
    "text-[#FF9500] dark:text-[#FBAE3C] bg-[#FFF7EB] dark:bg-[#78350F]/30 border border-[#FF9500]/30",
  leave:
    "text-[#FF9500] dark:text-[#FBAE3C] bg-[#FFF7EB] dark:bg-[#78350F]/30 border border-[#FF9500]/30",
};

const statusIcon = {
  present: <CheckCircle2 className="size-3.5 text-[#29CC39] dark:text-[#34D399]" />,
  late: <Clock className="size-3.5 text-[#C05328] dark:text-[#FBBF24]" />,
  absent: <XCircle className="size-3.5 text-[#C71212] dark:text-[#F87171]" />,
  "on leave": <Calendar className="size-3.5 text-[#FF9500] dark:text-[#FBAE3C]" />,
  leave: <Calendar className="size-3.5 text-[#FF9500] dark:text-[#FBAE3C]" />,
};

export default function AdminAttendanceList({ defaultDate }) {
  const getTodayStr = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;
    return new Date(now.getTime() - offset).toISOString().split("T")[0];
  };

  const [date, setDate] = useState(defaultDate || getTodayStr());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const [attendanceData, setAttendanceData] = useState({
    summary: { totalEmployees: 0, presentCount: 0, absentCount: 0, leaveCount: 0 },
    records: [],
  });

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/attendance/all?date=${date}`);
      if (res.data?.success && res.data?.data) {
        setAttendanceData(res.data.data);
      }
    } catch (err) {
      console.warn("Failed to fetch admin attendance roster:", err);
      toast.error(err.response?.data?.message || "Failed to load employee attendance roster");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  useEffect(() => {
    setCurrentPage(1);
  }, [date, search, statusFilter]);

  const filteredRecords = useMemo(() => {
    let list = attendanceData.records || [];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.role?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") {
      const sf = statusFilter.toLowerCase();
      list = list.filter((r) => {
        const s = (r.status || "absent").toLowerCase();
        if (sf === "present") return s === "present" || s === "late";
        if (sf === "on leave") return s === "on leave" || s === "leave";
        return s === sf;
      });
    }
    return list;
  }, [attendanceData.records, search, statusFilter]);

  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE) || 1;
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredRecords.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredRecords, currentPage, PAGE_SIZE]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-10 py-2">
      {/* Top Controls & Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#181818] border border-gray-100 dark:border-[#2D2D2D] p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-[#73FBFD]">
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Staff</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {attendanceData.summary?.totalEmployees || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181818] border border-gray-100 dark:border-[#2D2D2D] p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Present</p>
            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {attendanceData.summary?.presentCount || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181818] border border-gray-100 dark:border-[#2D2D2D] p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <XCircle className="size-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Absent</p>
            <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {attendanceData.summary?.absentCount || 0}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181818] border border-gray-100 dark:border-[#2D2D2D] p-4 rounded-2xl shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <Calendar className="size-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">On Leave</p>
            <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {attendanceData.summary?.leaveCount || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#181818] p-4 rounded-2xl border border-gray-100 dark:border-[#2D2D2D] mb-5 shadow-xs">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date Selector */}
          <div className="flex items-center gap-2 border border-gray-200 dark:border-[#383838] bg-gray-50 dark:bg-[#242424] px-3.5 py-1.5 rounded-xl">
            <Calendar className="size-4 text-gray-500 dark:text-gray-400" />
            <input
              type="date"
              value={date}
              max={getTodayStr()}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
            />
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {["All", "Present", "Absent", "On Leave"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === tab
                    ? "bg-blue-600 text-white dark:bg-[#73FBFD] dark:text-black shadow-xs"
                    : "bg-gray-100 dark:bg-[#242424] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#303030]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#242424] px-3.5 py-1.5 rounded-xl flex-1 md:w-64 border border-transparent focus-within:border-blue-500">
            <Search className="size-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff by name or email..."
              className="bg-transparent outline-none text-xs text-gray-800 dark:text-gray-200 w-full placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={fetchAttendance}
            disabled={loading}
            className="p-2 rounded-xl bg-gray-100 dark:bg-[#242424] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#303030] transition-colors cursor-pointer"
            title="Refresh records"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin text-blue-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Roster Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
          <Loader className="size-6 animate-spin text-blue-600 dark:text-[#73FBFD]" />
          <p className="text-xs">Loading attendance roster for {date}...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-16 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-[#2D2D2D]">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No staff attendance found</p>
          <p className="text-xs mt-1">Try selecting a different date or clearing the search filter.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:flex flex-col w-full bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-[#2D2D2D] overflow-hidden shadow-xs">
            <div className="grid grid-cols-12 px-6 py-3.5 bg-gray-50 dark:bg-[#222222] border-b border-gray-200 dark:border-[#333333] text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
              <div className="col-span-4 text-left">Staff Member</div>
              <div className="col-span-2 text-center">Check-In Time</div>
              <div className="col-span-2 text-center">Check-Out Time</div>
              <div className="col-span-2 text-center">Working Hours</div>
              <div className="col-span-2 text-center">Status</div>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="divide-y divide-gray-100 dark:divide-[#282828]">
              {paginatedRecords.map((item) => {
                const normalizedStatus = (item.status || "absent").toLowerCase();
                const avatarInitial = (item.name || "U").charAt(0).toUpperCase();

                return (
                  <motion.div
                    key={item.userId}
                    variants={itemVariants}
                    className="grid grid-cols-12 px-6 py-3.5 items-center hover:bg-gray-50/70 dark:hover:bg-[#222222]/50 transition-colors"
                  >
                    {/* Staff info */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="size-9 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-[#73FBFD] font-bold text-xs flex items-center justify-center shrink-0">
                        {avatarInitial}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {item.email}
                        </span>
                      </div>
                    </div>

                    {/* Check-In */}
                    <div className="col-span-2 text-center text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {item.checkInTime ? (
                        <span className="text-emerald-600 dark:text-emerald-400">{item.checkInTime}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>

                    {/* Check-Out */}
                    <div className="col-span-2 text-center text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {item.checkOutTime ? (
                        <span className="text-blue-600 dark:text-[#73FBFD]">{item.checkOutTime}</span>
                      ) : item.checkInTime ? (
                        <span className="text-amber-500 font-medium italic">Active / Working</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>

                    {/* Working Hours */}
                    <div className="col-span-2 text-center text-xs font-medium text-gray-700 dark:text-gray-300">
                      {item.workingHours ? (
                        <span>{item.workingHours} hrs</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          statusBadgeStyle[normalizedStatus] || "text-gray-600 bg-gray-100"
                        }`}
                      >
                        {statusIcon[normalizedStatus] || <Clock className="size-3.5" />}
                        <span className="capitalize">{item.status || "Absent"}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Mobile Card View */}
          <div className="flex md:hidden flex-col gap-3">
            {paginatedRecords.map((item) => {
              const normalizedStatus = (item.status || "absent").toLowerCase();
              const avatarInitial = (item.name || "U").charAt(0).toUpperCase();

              return (
                <div
                  key={item.userId}
                  className="bg-white dark:bg-[#181818] p-4 rounded-2xl border border-gray-100 dark:border-[#2D2D2D] shadow-xs flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#2D2D2D]">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-[#73FBFD] font-bold text-xs flex items-center justify-center">
                        {avatarInitial}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 truncate max-w-[180px]">{item.email}</p>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        statusBadgeStyle[normalizedStatus] || "text-gray-600 bg-gray-100"
                      }`}
                    >
                      {statusIcon[normalizedStatus]}
                      <span className="capitalize">{item.status || "Absent"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-gray-50 dark:bg-[#222222] p-2 rounded-xl">
                      <p className="text-[10px] text-gray-400 font-medium">In</p>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {item.checkInTime || "—"}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#222222] p-2 rounded-xl">
                      <p className="text-[10px] text-gray-400 font-medium">Out</p>
                      <p className="font-bold text-blue-600 dark:text-[#73FBFD] mt-0.5">
                        {item.checkOutTime || (item.checkInTime ? "Active" : "—")}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#222222] p-2 rounded-xl">
                      <p className="text-[10px] text-gray-400 font-medium">Hours</p>
                      <p className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                        {item.workingHours ? `${item.workingHours}h` : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredRecords.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemLabel="staff members"
            />
          </div>
        </>
      )}
    </div>
  );
}
