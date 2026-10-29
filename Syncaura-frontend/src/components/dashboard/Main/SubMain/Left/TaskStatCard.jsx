
import { Ellipsis } from "lucide-react";

const TaskStatCard = ({
  title = "Task Completed",
  value = "80%",
  valueColor = "text-[#3361FF]",
  icon = "/images/task/taskcompleted.png",
  change = "+23%",
  changeColor = "text-[#29CC39]",
}) => {
  return (
    <div className="w-full rounded-xl bg-white shadow-[0_6px_6px_3px_rgba(0,0,0,0.40),0_-1px_1px_1px_rgba(0,0,0,0.15)] flex flex-col gap-2 xl:gap-4 items-center justify-start dark:bg-[#1A1B1E] pt-4 pb-8 px-3 xl:pl-8 xl:pr-6">
      <div className="flex items-center justify-between w-full">
        <h2 className="flex items-center justify-start text-[#4D5E80] text-xs xl:text-sm font-semibold">
          {title}
        </h2>
        <div className="flex items-center justify-center">
          <Ellipsis className=" size-4   xl:size-7 text-[#C3CAD9]" />
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
        <h1
          className={`flex items-center justify-start text-2xl font-semibold ${valueColor}`}
        >
          {value}
        </h1>

        <div className="flex items-center flex-col  justify-center">
          <img src={icon} className="size-6 xl:size-8" />
          <p className={`font-semibold text-xs ${changeColor}`}>
            {change}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskStatCard;
