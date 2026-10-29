import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  CircleCheckBig,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  RefreshCw,
  UserCheck,
  X,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../config/axios";
import Pagination from "../components/common/Pagination";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const YEARS = [2024, 2025, 2026];

// Shared localStorage keys (written by AttendanceLeave page)
const ATTENDANCE_STORAGE_PREFIX = "syncaura:attendance:";
const LEAVE_STORAGE_PREFIX = "syncaura:leaves:";

export default function MyAttendance() {
  const user = useSelector((state) => state.auth.user);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalPresentDays: 0,
    totalAbsentDays: 0,
    totalLeaveDays: 0,
    totalLateEntries: 0,
    attendancePercentage: 0,
    totalWorkingDaysTracked: 0,
  });
  const [records, setRecords] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedYear, searchFilter, statusFilter]);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/attendance/my-attendance?month=${selectedMonth}&year=${selectedYear}`
      );
      if (response.data && response.data.success) {
        setSummary(response.data.summary);
        setRecords(response.data.records);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn("Attendance API not available — using localStorage fallback:", err.message);

      const userKey = user?.id || user?.email || "current-user";

      // ── Read check-in / check-out records for this user ─────────────────────
      let attendanceRecords = {};
      try {
        const stored = localStorage.getItem(`${ATTENDANCE_STORAGE_PREFIX}${userKey}`);
        attendanceRecords = stored ? (JSON.parse(stored).records || {}) : {};
      } catch { /* ignore parse errors */ }

      // ── Build daily records for the selected month (Only Actual Attendance Logs) ──
      const builtRecords = [];

      // Check-in/check-out entries
      Object.entries(attendanceRecords).forEach(([date, rec]) => {
        const d = new Date(date);
        if (d.getFullYear() !== selectedYear || d.getMonth() + 1 !== selectedMonth) return;
        builtRecords.push({
          id: `local-att-${date}`,
          date,
          check_in_time: rec.checkInTime || null,
          check_out_time: rec.checkOutTime || null,
          working_hours: rec.checkInTime && rec.checkOutTime
            ? (() => {
                const parse = (t) => {
                  const [time, meridiem] = t.split(" ");
                  let [h, m] = time.split(":").map(Number);
                  if (meridiem === "PM" && h !== 12) h += 12;
                  if (meridiem === "AM" && h === 12) h = 0;
                  return h * 60 + m;
                };
                const diff = parse(rec.checkOutTime) - parse(rec.checkInTime);
                return diff > 0 ? (diff / 60).toFixed(2) : "0.00";
              })()
            : "0.00",
          status: "Present",
        });
      });

      // Sort newest first
      builtRecords.sort((a, b) => b.date.localeCompare(a.date));

      // ── Compute summary stats ──────────────────────────────────────────────
      const present = builtRecords.filter((r) => r.status === "Present").length;
      const absent  = builtRecords.filter((r) => r.status === "Absent").length;
      const leave   = 0; // Leave requests are managed on the Attendance & Leave (Leave Management) page
      const late    = builtRecords.filter((r) => r.status === "Late").length;
      const total   = builtRecords.length;
      const pct     = total > 0 ? Math.round(((present + late) / total) * 1000) / 10 : 0;

      setRecords(builtRecords);
      setSummary({
        totalPresentDays: present,
        totalAbsentDays: absent,
        totalLeaveDays: leave,
        totalLateEntries: late,
        attendancePercentage: pct,
        totalWorkingDaysTracked: total,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, user?.id, user?.email]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesDate = searchFilter === "" || r.date === searchFilter;
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      return matchesDate && matchesStatus;
    });
  }, [records, searchFilter, statusFilter]);

  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE) || 1;
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredRecords.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredRecords, currentPage, PAGE_SIZE]);

  const getStatusBadge = (status) => {
    const configs = {
      Present: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20", dot: "bg-emerald-500" },
      Absent:  { cls: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20", dot: "bg-rose-500" },
      Late:    { cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20", dot: "bg-amber-500" },
      Leave:   { cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20", dot: "bg-blue-500" },
    };
    const cfg = configs[status];
    if (!cfg) return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-transparent">{status}</span>;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
        <span className={`size-1.5 rounded-full ${cfg.dot}`} />
        {status}
      </span>
    );
  };

  const statCards = [
    { title: "Present Days",    value: summary.totalPresentDays,          icon: CircleCheckBig, accent: "from-emerald-500 to-emerald-400", iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15", iconColor: "text-emerald-600 dark:text-emerald-400", valueColor: "text-emerald-700 dark:text-emerald-300" },
    { title: "Absent Days",     value: summary.totalAbsentDays,           icon: XCircle,        accent: "from-rose-500 to-rose-400",       iconBg: "bg-rose-500/10 dark:bg-rose-500/15",       iconColor: "text-rose-600 dark:text-rose-400",       valueColor: "text-rose-700 dark:text-rose-300" },
    { title: "Leave Days",      value: summary.totalLeaveDays,            icon: CalendarIcon,   accent: "from-blue-500 to-blue-400",       iconBg: "bg-blue-500/10 dark:bg-blue-500/15",       iconColor: "text-blue-600 dark:text-blue-400",       valueColor: "text-blue-700 dark:text-blue-300" },
    { title: "Late Entries",    value: summary.totalLateEntries,          icon: AlertTriangle,  accent: "from-amber-500 to-amber-400",     iconBg: "bg-amber-500/10 dark:bg-amber-500/15",     iconColor: "text-amber-600 dark:text-amber-400",     valueColor: "text-amber-700 dark:text-amber-300" },
    { title: "Attendance Rate", value: `${summary.attendancePercentage}%`, icon: TrendingUp,    accent: "from-violet-500 to-indigo-500",   iconBg: "bg-violet-500/10 dark:bg-violet-500/15",   iconColor: "text-violet-600 dark:text-violet-400",   valueColor: "text-violet-700 dark:text-violet-300", isPercentage: true },
  ];

  const currentMonthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label;

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-[#0A0A0B] text-gray-900 dark:text-gray-100">

      {/* Page Header */}
      <div className="bg-white dark:bg-[#0F1011] border-b border-gray-200 dark:border-gray-800/60 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              to="/attendance-leave"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-[#73FBFD] hover:opacity-80 transition-opacity mb-2"
            >
              <ArrowLeft className="size-3.5" />
              Attendance &amp; Leave Overview
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-[#73FBFD]/10">
                <UserCheck className="size-5 text-blue-600 dark:text-[#73FBFD]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">My Attendance</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {currentMonthLabel} {selectedYear} &mdash; {user?.name || user?.email || "Employee"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-gray-50 dark:bg-[#1C1D1F] text-gray-800 dark:text-gray-100 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#73FBFD] cursor-pointer transition"
            >
              {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-gray-50 dark:bg-[#1C1D1F] text-gray-800 dark:text-gray-100 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#73FBFD] cursor-pointer transition"
            >
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <button
              onClick={fetchAttendance}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C1D1F] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252628] transition disabled:opacity-50 text-sm font-medium"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: idx * 0.06 }}
                className="relative bg-white dark:bg-[#141516] rounded-2xl border border-gray-200 dark:border-gray-800/70 p-5 overflow-hidden hover:shadow-md dark:hover:shadow-black/30 transition-shadow"
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.accent}`} />
                <div className="flex items-start justify-between">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-tight pr-1">{card.title}</p>
                  <div className={`p-2 rounded-xl ${card.iconBg} shrink-0`}>
                    <Icon className={`size-4 ${card.iconColor}`} />
                  </div>
                </div>
                <p className={`mt-3 text-3xl font-bold tracking-tight ${card.valueColor}`}>
                  {loading ? <span className="inline-block w-10 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" /> : card.value}
                </p>
                {card.isPercentage && !loading && (
                  <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(0, summary.attendancePercentage))}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className={`h-full rounded-full bg-gradient-to-r ${card.accent}`}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Attendance Table */}
        <div className="bg-white dark:bg-[#141516] rounded-2xl border border-gray-200 dark:border-gray-800/70 overflow-hidden shadow-sm">

          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="size-4 text-blue-600 dark:text-[#73FBFD]" />
                Attendance Log &mdash; {currentMonthLabel} {selectedYear}
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""} shown
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white dark:bg-[#0B0B0B] text-gray-800 dark:text-gray-200 text-xs font-semibold border border-gray-200 dark:border-[#2A2A2A] rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#2461E6] dark:focus:ring-[#73FBFD] cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                <option value="Leave">Leave</option>
              </select>
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#0B0B0B] border border-gray-200 dark:border-[#2A2A2A] rounded-xl px-3 py-1.5 shadow-xs">
                <CalendarIcon className="size-3.5 text-gray-400 shrink-0" />
                <input
                  type="date"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-transparent text-gray-800 dark:text-gray-200 text-xs font-medium outline-none cursor-pointer w-28 date-input"
                />
                {searchFilter && (
                  <button onClick={() => setSearchFilter("")} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
                    <X className="size-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="size-7 text-blue-500 dark:text-[#73FBFD] animate-spin" />
                <p className="text-xs font-medium text-gray-400">Loading records&hellip;</p>
              </motion.div>
            ) : filteredRecords.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 px-4 text-center gap-3">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#1C1D1F]">
                  <CalendarIcon className="size-8 text-gray-300 dark:text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">No records found</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
                    No attendance data for {currentMonthLabel} {selectedYear}
                    {statusFilter !== "All" ? ` with status "${statusFilter}"` : ""}.
                  </p>
                </div>
                {(searchFilter || statusFilter !== "All") && (
                  <button onClick={() => { setSearchFilter(""); setStatusFilter("All"); }}
                    className="text-xs text-blue-600 dark:text-[#73FBFD] hover:underline font-medium">
                    Clear filters
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-[#17181A] text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800/60">
                        <th className="py-3 px-5 text-left">Date</th>
                        <th className="py-3 px-5 text-left">Check-In</th>
                        <th className="py-3 px-5 text-left">Check-Out</th>
                        <th className="py-3 px-5 text-left">Hours</th>
                        <th className="py-3 px-5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRecords.map((record, i) => {
                        const d = new Date(record.date);
                        const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
                        const dateFmt = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                        const workingHrs = record.working_hours ? `${parseFloat(record.working_hours).toFixed(1)}h` : "\u2014";
                        return (
                          <tr key={record.id || record.date}
                            className={`border-b border-gray-50 dark:border-gray-800/40 hover:bg-blue-50/40 dark:hover:bg-[#1A1C1F] transition-colors ${i % 2 !== 0 ? "bg-gray-50/40 dark:bg-[#131415]" : ""}`}>
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#202225] flex items-center justify-center shrink-0">
                                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{dayName}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white text-xs">{dateFmt}</p>
                                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{record.date}</p>
                                  {record.status === "Leave" && record.leaveType && (
                                    <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5 font-medium">
                                      {record.leaveType}{record.leaveReason ? ` — ${record.leaveReason}` : ""}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-5">
                              <span className="font-mono text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#1E2023] px-2 py-1 rounded-md">{record.check_in_time || "\u2014"}</span>
                            </td>
                            <td className="py-3.5 px-5">
                              <span className="font-mono text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#1E2023] px-2 py-1 rounded-md">{record.check_out_time || "\u2014"}</span>
                            </td>
                            <td className="py-3.5 px-5">
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{workingHrs}</span>
                            </td>
                            <td className="py-3.5 px-5 text-right">{getStatusBadge(record.status)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-800/40">
                  {paginatedRecords.map((record) => {
                    const d = new Date(record.date);
                    const dateFmt = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                    return (
                      <div key={record.id || record.date} className="p-4 hover:bg-gray-50 dark:hover:bg-[#1A1C1F] transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{dateFmt}</span>
                          {getStatusBadge(record.status)}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "Check-In",  val: record.check_in_time  || "\u2014" },
                            { label: "Check-Out", val: record.check_out_time || "\u2014" },
                            { label: "Hours",     val: record.working_hours ? `${parseFloat(record.working_hours).toFixed(1)}h` : "\u2014" },
                          ].map(({ label, val }) => (
                            <div key={label} className="bg-gray-50 dark:bg-[#1C1D1F] rounded-xl p-2.5">
                              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-1">{label}</p>
                              <p className="text-xs font-mono font-medium text-gray-800 dark:text-gray-200">{val}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <div className="px-5 py-2 border-t border-gray-100 dark:border-gray-800/60">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredRecords.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                    itemLabel="attendance records"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
