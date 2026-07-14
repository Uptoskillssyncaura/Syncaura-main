import { memo } from "react";

const AttendanceCard = memo(({ title, value, borderColor, icon }) => {
  return (
    <div className="bg-[#FFFFFF] dark:bg-[#2E2F2F] w-[220px] h-[65px] px-4 rounded-2xl shadow-[0_0_10px_1px_#EDEDED] dark:shadow-[0_0_10px_1px_#171717] flex items-center justify-between">
      
      <div className="flex flex-col leading-[1]">
        <h1 className="text-xs font-semibold text-[#000000] dark:text-[#FFFFFF]">
          {title}
        </h1>

        <h1 className="text-2xl font-bold text-[#000000] dark:text-[#FFFFFF] mt-1">
          {value}
        </h1>

        <p className="text-[9px] text-[#8A8A8A] mt-1">
          This Month
        </p>
      </div>

      <div
        className={`w-7 h-7 rounded-full border ${borderColor} flex items-center justify-center`}
      >
        {icon}
      </div>
    </div>
  );
});

export default AttendanceCard;
