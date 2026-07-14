import { Calendar, CheckCircle2, Ellipsis, Flag, Tally2 } from "lucide-react";
import { motion } from "framer-motion";

const ProjectCard = ({
  title,
  department,
  priority,
  progress,
  avatars,
  dueDate,
}) => {
  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  };

  const priorityColor = {
    Critical: "bg-[#FEE2E2] text-[#C71212]",
    Ongoing: "bg-[#DBEAFE] text-[#0000A5]",
    "On Hold": "bg-[#F3F4F6] text-[#69707E]",
    Completed: "bg-[#DCFCE7] text-[#004500]",
  };
  const bottomIconBgColor = {
    Critical: "bg-[#FEE2E2] text-[#C71212] dark:bg-[#212121]",
    Ongoing: "bg-[#DBEAFE] text-[#0000A5] dark:bg-[#212121]",
    "On Hold": "bg-[#F3F4F6] text-[#69707E] dark:bg-[#212121]",
    Completed: "bg-[#DCFCE7] text-[#004500] dark:bg-[#212121]",
  };
  const bottomIcon = {
    Critical: (
      <Flag className="size-3.5 text-[#C71212] fill-[#C71212]" />
    ),
    Ongoing: (
      <Calendar className="size-3.5 text-[#0000A5]" />
    ),
    "On Hold": (
      <Tally2 className="size-5 text-[#69707E]" />
    ),
    Completed: (
      <CheckCircle2 className="size-5 text-[#004500]" />
    ),
  };

  const visibleAvatars = avatars.slice(0, 2);
  const extraCount = avatars.length - visibleAvatars.length;

  return (
    <div className="bg-white dark:bg-[#2E2F2F] w-60 md:w-80 flex flex-col gap-12 shrink-0 box-border px-4 py-3 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
      {/* Header */}
      <div className="flex flex-col w-full gap-3">
        <div className="flex items-center justify-between w-full">
          <div className={`px-3 py-1 rounded-xl ${priorityColor[priority]}`}>
            <p className=" text-xs font-semibold">{priority}</p>
          </div>
          <Ellipsis className="size-5 text-[#989696]" />
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-black dark:text-[#FFFFFF]">{title}</h1>
          <p className="text-sm text-[#989696] dark:text-[#989696]">{department}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between px-2">
            <p className="text-sm font-semibold text-[#989696]">Progress</p>
            <p className="text-sm font-semibold text-[#989696]">{progress}%</p>
          </div>

          <div className="relative w-full h-2 bg-[#F3F4F6] rounded-2xl">
            <motion.div
             className={`absolute top-0 left-0 h-2 ${
              priority === "Critical"
                ? "bg-[#C71212]"
                : priority === "Ongoing"
                ? "bg-[#0000A5]"
                : priority === "On Hold"
                ? "bg-[#69707E]"
                : "bg-[#004500]"
            } rounded-l-2xl ${progress === 100 ? "rounded-r-2xl" : ""}`}/>
          </div>
        </div>

        {/* Avatars + Date */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center -space-x-3">
            {visibleAvatars.map((src, i) => (
              <img
                key={i}
                src={src}
                className="size-8 rounded-full border-2 border-white"
              />
            ))}

            {extraCount > 0 && (
              <span className="size-8 text-xs font-semibold flex items-center justify-center bg-[#F3F4F6] rounded-full border  border-white text-[#000000]">
                +{extraCount}
              </span>
            )}
          </div>

          <div
            className={`flex items-center gap-1 ${bottomIconBgColor[priority]} px-3 py-1 rounded-lg`}
          >
            {bottomIcon[priority]}
            <p className="text-xs font-semibold ">
              {priority === "Completed"
                ? "Done"
                : priority === "on Hold"
                ? "TBD"
                : formatDate(dueDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
