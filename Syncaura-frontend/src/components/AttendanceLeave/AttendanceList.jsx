import { CircleAlert, CircleCheck, Clock, Eye } from "lucide-react";
import { motion } from "framer-motion";

const AttendanceList = ({ LeaveData, currId, setCurrId, isLeaveRequests, onStatusUpdate }) => {
  const statusColor = {
    Pending: "text-[#C05328] bg-[#FEF2C2]",
    Approved: "text-[#29CC39] bg-[#D1FAE5]",
    Rejected: "text-[#C71212] bg-[#FFC2C2]",
  };
  const statusIcon = {
    Pending: <Clock className="size-4 " />,
    Approved: <CircleCheck className="size-4 " />,
    Rejected: <CircleAlert className="size-4 " />,
  };
  const formattedDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="hidden md:flex flex-col w-full px-1 mt-2 "
      >

        {LeaveData.map(({ id, startDate, endDate, type, reason, status, appliedBy }, idx) => (
          <motion.div
            variants={itemVariants}
            onClick={() => setCurrId(idx)}
            key={idx}
            className={`flex  relative transition-all duration-300 items-center justify-between w-full bg-[#FFFFFF] dark:bg-[#000000]  px-10 py-6 ${
              currId === idx
                ? "bg-blue-50 dark:bg-[#1C3939]"
                : "hover:bg-[#d1d4db75] dark:hover:bg-gray-800 hover:scale-[1.005] cursor-pointer"
            }`}
          >
            <span
              className={`absolute  left-0 top-0 h-full w-1 bg-blue-500 dark:bg-gray-400 transition-transform duration-300
                  ${
                    currId === idx
                      ? "scale-y-100"
                      : "scale-y-0 group-hover:scale-y-100"
                  }`}
            />
            {isLeaveRequests && (
              <h1 className="text-base text-[#000000] dark:text-[#F8F8F8] font-semibold flex items-center justify-start flex-2/9">
                {appliedBy || "User"}
              </h1>
            )}
            <div className={`text-base text-[#000000] dark:text-[#F8F8F8] font-medium flex items-center justify-center ${isLeaveRequests ? "flex-2/9" : "flex-3/9"} flex-wrap w-full`}>
              <h1>{formattedDate(startDate)}</h1>
              <h1>{" - "}</h1>
              <h1>{formattedDate(endDate)}</h1>
            </div>
            <h1 className=" text-base text-[#000000] dark:text-[#F8F8F8] font-medium flex items-center justify-center flex-1/9">
              {type}
            </h1>
            <h1 className={`text-base text-[#000000] dark:text-[#F8F8F8] font-medium flex items-center justify-start ${isLeaveRequests ? "flex-2/9" : "flex-3/9"}`}>
              {reason}
            </h1>
            <div className="  flex items-center justify-center flex-1/9">
              <div
                className={`${statusColor[status]} px-4 py-1 flex items-center justify-center gap-2 rounded-2xl`}
              >
                {statusIcon[status]}
                <p className=" text-xs font-semibold">{status}</p>
              </div>
            </div>
            <div className=" text-base  font-medium flex items-center justify-center flex-1/9">
              {isLeaveRequests && status === "Pending" ? (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onStatusUpdate(id || idx, "Approved")}
                    className="px-2.5 py-1 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onStatusUpdate(id || idx, "Rejected")}
                    className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <Eye className="size-5 text-[#000000] dark:text-[#F8F8F8] cursor-pointer" />
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex md:hidden w-full flex-col items-center justify-center gap-5 px-2 py-1"
      >
        {LeaveData.map(({ id, startDate, endDate, type, reason, status, appliedBy }, idx) => (
          <motion.div
            variants={itemVariants}
            key={idx}
            className="flex w-full flex-col px-5 sm:px-10 py-7 gap-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#2E2F2F] shadow-[0_0_10px_1px_#EDEDED] dark:shadow-[2px_4px_10px_2px_rgba(255,255,255,0.3)] dark:border border-gray-500  ">
            {isLeaveRequests && (
              <div className="flex justify-between w-full items-center gap-y-3">
                <h1 className="text-[#000000] dark:text-[#FFFFFF] text-base font-semibold flex-3/7">
                  User
                </h1>
                <h1 className="text-[#000000] dark:text-[#FFFFFF] text-sm font-semibold flex-4/7 text-right">
                  {appliedBy || "User"}
                </h1>
              </div>
            )}
            <div className="flex flex-col xs:flex-row items-center flex-wrap justify-between w-full gap-y-4 ">
              <div className="flex flex-row xs:flex-col justify-between w-full xs:w-auto xs:justify-center items-start gap-y-1 ">
                <h1 className="text-[#000000] dark:text-[#FFFFFF] text-base font-semibold flex-2/5">
                  Start Date
                </h1>
                <h1 className="text-[#000000] dark:text-[#FFFFFF] text-sm font-light flex-3/5">
                  {formattedDate(startDate)}
                </h1>
              </div>
              <div className="flex flex-row xs:flex-col justify-between w-full xs:w-auto xs:justify-center items-start gap-y-1 ">
                <h1 className="text-[#000000] dark:text-[#FFFFFF] text-base font-semibold flex-2/5">
                  End Date
                </h1>
                <h1 className="text-[#000000] dark:text-[#FFFFFF] text-sm font-light flex-3/5">
                  {formattedDate(endDate)}
                </h1>
              </div>
              <div className="flex flex-row xs:flex-col justify-between w-full xs:w-auto xs:justify-center items-start gap-y-1 ">
                <h1 className="text-[#000000] dark:text-[#FFFFFF] text-base font-semibold flex-2/5">
                  Type
                </h1>
                <h1 className="text-[#000000] dark:text-[#FFFFFF] text-sm font-light flex-3/5">
                  {type}
                </h1>
              </div>
            </div>
            <div className="flex  justify-between w-full  items-center gap-y-3 ">
              <h1 className="text-[#000000] dark:text-[#FFFFFF] text-base font-semibold flex-3/7">
                Reason
              </h1>
              <h1 className="text-[#000000] dark:text-[#FFFFFF] text-sm font-light flex-4/7">
                {reason}
              </h1>
            </div>
            <div className="flex flex-col xs:flex-row items-center flex-wrap justify-between w-full gap-y-4 ">
              <div className="flex flex-row xs:flex-col justify-between w-full xs:w-auto xs:justify-center items-start gap-y-1 ">
                <h1 className="text-[#000000] dark:text-[#FFFFFF] text-base font-semibold flex-2/5">
                  Status
                </h1>
                <div
                  className={`px-4 py-1.5 rounded-2xl ${statusColor[status]} flex items-center justify-center gap-2`}
                >
                  {statusIcon[status]}
                  <p className="text-sm font-semibold ">{status}</p>
                </div>
              </div>
              <div className="flex flex-row xs:flex-col justify-between w-full xs:w-auto xs:justify-center items-start gap-y-1 ">
                <h1 className="text-[#000000] dark:text-[#FFFFFF] text-base font-semibold flex-2/5">
                  Action
                </h1>
                <div className="text-[#000000] dark:text-[#FFFFFF] text-sm font-semibold flex-3/5">
                  {isLeaveRequests && status === "Pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onStatusUpdate(id || idx, "Approved")}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-green-600 rounded-lg cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onStatusUpdate(id || idx, "Rejected")}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 rounded-lg cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <Eye className="size-5 text-[#000000] dark:text-[#F8F8F8] cursor-pointer" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default AttendanceList;
