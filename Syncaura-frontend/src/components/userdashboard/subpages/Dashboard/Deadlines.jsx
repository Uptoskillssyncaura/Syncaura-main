const Deadlines = ({
  bgColor = "bg-[#FEF2F2]",
  borderColor = "border-[#FCC0C4]",
  titleColor = "text-[#B60000]",
  descColor = "text-[#E76060]",
  title = "API Auth Bug",
  status = "HIGH",
  due = "Due Today, 5:00 PM",
  statusColor = "bg-[#EF4444]",
}) => {
  return (
    <div
      className={`
        flex
        flex-col
        justify-center
        w-[239px] 
        h-[64px]
        ${bgColor}
        ${borderColor}
        border
        rounded-lg
        px-3
        py-2
      `}
    >
      <div className="flex items-center justify-between w-full gap-2">
        <h1
          className={`${titleColor} text-sm font-semibold truncate`}
        >
          {title}
        </h1>

        <div
          className={`flex items-center justify-center ${statusColor} rounded-md py-0.5 px-1.5`}
        >
          <p className="uppercase text-white text-[9px] font-bold">
            {status}
          </p>
        </div>
      </div>

      <p
        className={`${descColor} text-[10px] font-medium w-full`}
      >
        {due}
      </p>
    </div>
  );
};

export default Deadlines;