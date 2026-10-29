import React, { useState } from "react";
import { Edit3, Trash2, CheckCircle2, Clock, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const statusColor = {
  approved:
    "text-[#29CC39] dark:text-[#34D399] bg-[#E8F8EA] dark:bg-[#064E3B]/40 border border-[#29CC39]/30",
  pending:
    "text-[#C05328] dark:text-[#FBBF24] bg-[#FDEEE8] dark:bg-[#78350F]/40 border border-[#C05328]/30",
  rejected:
    "text-[#C71212] dark:text-[#F87171] bg-[#FCE8E8] dark:bg-[#7F1D1D]/40 border border-[#C71212]/30",
};

const statusIcon = {
  approved: (
    <CheckCircle2 className="size-3.5 text-[#29CC39] dark:text-[#34D399]" />
  ),
  pending: (
    <Clock className="size-3.5 text-[#C05328] dark:text-[#FBBF24]" />
  ),
  rejected: (
    <XCircle className="size-3.5 text-[#C71212] dark:text-[#F87171]" />
  ),
};

const AttendanceList = ({
  LeaveData = [],
  setCurrId,
  currId,
  isAdminOrCoAdmin = false,
  onStatusChange,
  onEditLeave,
  onDeleteLeave,
}) => {
  const user = useSelector((state) => state.auth.user);
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    // ignore
  }
  const currentUser = user || storedUser;
  const currentUserId = currentUser?.id || currentUser?._id;
  const currentUserEmail = (currentUser?.email || "").toLowerCase();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  const formattedDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!LeaveData || LeaveData.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 text-center text-gray-500 dark:text-gray-400">
        <p className="text-base font-medium">No leave requests found.</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          When leave requests are submitted, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="hidden md:flex flex-col w-full px-1 mt-1"
      >
        {LeaveData.map((item, idx) => {
          const { startDate, endDate, type, reason, status } = item;
          const isSelected = currId === idx;
          const normalizedStatus = (status || "Pending").toLowerCase();

          const userName = item.user_name || item.employee_name || item.userName || "Employee";
          const userEmail = item.user_email || item.email || item.userEmail || "—";
          const leaveType = type || item.leave_type || "Leave";

          const isOwner = Boolean(
            (item.user_id && currentUserId && String(item.user_id) === String(currentUserId)) ||
            (item.user_email && currentUserEmail && item.user_email.toLowerCase() === currentUserEmail) ||
            (!item.user_id && !isAdminOrCoAdmin)
          );

          return (
            <motion.div
              variants={itemVariants}
              onClick={() => {
                setCurrId(idx);
              }}
              key={item.id || idx}
              className={`flex relative transition-all duration-200 items-center justify-between w-full bg-[#FFFFFF] dark:bg-[#000000] px-10 py-5 border-b border-gray-100 dark:border-gray-800 ${
                isSelected
                  ? "bg-blue-50/60 dark:bg-[#1C3939]/50"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900/60 cursor-pointer"
              }`}
            >
              <span
                className={`absolute left-0 top-0 h-full w-1 bg-blue-500 dark:bg-[#73FBFD] transition-transform duration-200 ${
                  isSelected ? "scale-y-100" : "scale-y-0"
                }`}
              />

              {/* 1. Applicant (Name & Unique Email) */}
              <div className="flex flex-col items-start justify-center w-[22%] px-3 text-left">
                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-full">
                  {userName}
                </span>
                <span
                  className="text-xs text-blue-600 dark:text-[#73FBFD] truncate max-w-full font-medium mt-0.5"
                  title={userEmail}
                >
                  {userEmail}
                </span>
              </div>

              {/* 2. Leave Type */}
              <div className="text-sm text-[#000000] dark:text-[#F8F8F8] font-medium flex items-center justify-center w-[16%] px-2 text-center">
                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-xs font-semibold text-blue-700 dark:text-[#73FBFD] border border-blue-200 dark:border-blue-800">
                  {leaveType}
                </span>
              </div>

              {/* 3. Duration */}
              <div className="text-xs lg:text-sm text-[#000000] dark:text-[#F8F8F8] font-medium flex items-center justify-center w-[22%] px-2 flex-wrap text-center">
                <span className="text-gray-800 dark:text-gray-200 font-semibold">{formattedDate(startDate)}</span>
                <span className="mx-1 text-gray-400">→</span>
                <span className="text-gray-800 dark:text-gray-200 font-semibold">{formattedDate(endDate)}</span>
              </div>

              {/* 4. Reason */}
              <div
                className="text-sm text-gray-700 dark:text-gray-300 font-normal flex items-center justify-start w-[24%] px-3 break-words line-clamp-2"
                title={reason}
              >
                {reason || "—"}
              </div>

              {/* 5. Status & Smart Inline Actions */}
              <div className="flex items-center justify-center w-[16%] gap-2">
                {isAdminOrCoAdmin && !isOwner ? (
                  <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={normalizedStatus}
                      onChange={(e) => onStatusChange?.(item, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs outline-none cursor-pointer text-center transition-colors ${
                        statusColor[normalizedStatus] || "text-gray-700 bg-gray-100"
                      }`}
                    >
                      <option value="pending" className="bg-white dark:bg-gray-800 text-[#C05328] dark:text-[#FBBF24]">
                        Pending
                      </option>
                      <option value="approved" className="bg-white dark:bg-gray-800 text-[#29CC39] dark:text-[#34D399]">
                        Approved
                      </option>
                      <option value="rejected" className="bg-white dark:bg-gray-800 text-[#C71212] dark:text-[#F87171]">
                        Rejected
                      </option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5">
                    <div
                      className={`${
                        statusColor[normalizedStatus] || "text-gray-700 bg-gray-100"
                      } px-3 py-1 flex items-center justify-center gap-1.5 rounded-2xl`}
                    >
                      {statusIcon[normalizedStatus]}
                      <p className="text-xs font-semibold capitalize">{status}</p>
                    </div>

                    {isOwner && normalizedStatus === "pending" && (
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrId(idx);
                            onEditLeave?.(item);
                          }}
                          className="p-1 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                          title="Edit Leave"
                          aria-label="Edit leave"
                        >
                          <Edit3 className="size-3.5 text-[#2461E6] dark:text-[#73FBFD]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrId(idx);
                            onDeleteLeave?.(item);
                          }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                          title="Delete Leave"
                          aria-label="Delete leave"
                        >
                          <Trash2 className="size-3.5 text-[#C71212] dark:text-[#FF6B6B]" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mobile Card View */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex md:hidden w-full flex-col items-center justify-center gap-4 px-2 py-2"
      >
        {LeaveData.map((item, idx) => {
          const { startDate, endDate, type, reason, status } = item;
          const normalizedStatus = (status || "Pending").toLowerCase();

          const userName = item.user_name || item.employee_name || item.userName || "Employee";
          const userEmail = item.user_email || item.email || item.userEmail || "—";
          const leaveType = type || item.leave_type || "Casual Leave";

          const isOwner = Boolean(
            (item.user_id && currentUserId && String(item.user_id) === String(currentUserId)) ||
            (item.user_email && currentUserEmail && item.user_email.toLowerCase() === currentUserEmail) ||
            (!item.user_id && !isAdminOrCoAdmin)
          );

          return (
            <motion.div
              key={item.id || idx}
              variants={itemVariants}
              className="flex w-full flex-col p-5 gap-3 rounded-2xl bg-[#FFFFFF] dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 shadow-sm"
            >
              {/* Applicant Header */}
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
                    Applicant
                  </span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                    {userName}
                  </h3>
                  <span className="text-xs font-medium text-blue-600 dark:text-[#73FBFD] mt-0.5 break-all">
                    {userEmail}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-xs font-semibold text-blue-700 dark:text-[#73FBFD] border border-blue-200 dark:border-blue-800 shrink-0">
                  {leaveType}
                </span>
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase">
                  Duration
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {formattedDate(startDate)} → {formattedDate(endDate)}
                </span>
              </div>

              {/* Reason */}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase">
                  Reason
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {reason || "—"}
                </p>
              </div>

              {/* Status and Action Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">
                    Status:
                  </span>
                  {isAdminOrCoAdmin && !isOwner ? (
                    <select
                      value={normalizedStatus}
                      onChange={(e) => onStatusChange?.(item, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl outline-none cursor-pointer ${
                        statusColor[normalizedStatus] || "text-gray-700 bg-gray-100"
                      }`}
                    >
                      <option value="pending" className="bg-white dark:bg-gray-800 text-[#C05328] dark:text-[#FBBF24]">
                        Pending
                      </option>
                      <option value="approved" className="bg-white dark:bg-gray-800 text-[#29CC39] dark:text-[#34D399]">
                        Approved
                      </option>
                      <option value="rejected" className="bg-white dark:bg-gray-800 text-[#C71212] dark:text-[#F87171]">
                        Rejected
                      </option>
                    </select>
                  ) : (
                    <div
                      className={`${
                        statusColor[normalizedStatus] || "text-gray-700 bg-gray-100"
                      } px-2.5 py-1 flex items-center gap-1.5 rounded-xl`}
                    >
                      {statusIcon[normalizedStatus]}
                      <span className="text-xs font-semibold capitalize">{status}</span>
                    </div>
                  )}
                </div>

                {isOwner && normalizedStatus === "pending" && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrId(idx);
                        onEditLeave?.(item);
                      }}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-full cursor-pointer"
                      title="Edit Leave"
                    >
                      <Edit3 className="size-4 text-[#2461E6] dark:text-[#73FBFD]" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrId(idx);
                        onDeleteLeave?.(item);
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full cursor-pointer"
                      title="Delete Leave"
                    >
                      <Trash2 className="size-4 text-[#C71212] dark:text-[#FF6B6B]" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};

export default AttendanceList;

