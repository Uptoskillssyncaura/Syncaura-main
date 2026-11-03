import React from "react";
import { Ellipsis } from "lucide-react";
import ProgressBar from "./ProgressBar";

const ProjectItem = ({
  logo = "/images/LastProjects/facebook.png",
  title = "Develop Chat Application",
  progress = 17,
  members = [],
  stages = 5,
  deadline = "09.25.2025",
  income = "$5000",
  tasks = 21,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-2 justify-center px-2 xl:px-5 ">
        <div className="grid grid-cols-12 xl:grid-cols-11 gap-2 w-full">
          <div className="col-span-3">
            <div className="size-16  2xl:size-20 dark:bg-black p-3s 2xl:p-5 flex items-center justify-center rounded-full border border-[#000000]">
              <img src={logo} className="size-2/3 2xl:size-full object-contain" />
            </div>
          </div>

          <div className=" col-span-7 xl:col-span-6 flex flex-col gap-0.75">
            <h1 className="text-[#4D5E80] flex items-center justify-center font-semibold text-[11px] xl:text-[12px] 2xl:text-[16px]">
              {title}
            </h1>

            <div className="flex flex-col gap-0.5">
              <div className="pl-4">
                <ProgressBar value={progress} />
              </div>

              <div className="px-5 flex gap-2 items-center justify-center">
                {members.map((img, idx) => (
                  <div className="size-4  2xl:size-6" key={idx}>
                    <img
                      src={img}
                      className="rounded-full size-full object-cover border border-[#000000]"
                      alt="avatar"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-2 flex items-start justify-end">
            <Ellipsis className="size-xl fill-[#C3CAD9] text-[#C3CAD9]" />
          </div>
        </div>

        <div className="flex flex-col items-center w-full px-2 xl:px-0">
          <div className="flex items-center justify-around w-full">
            <div className="flex items-center justify-start flex-1/2 gap-1.5">
              <img src="/images/stages.png" className="size-6 xl:size-8" />
              <p className="text-[#6B7A99] text-[9px] xl:text-xs 2xl:text-sm font-semibold">
                {stages} Stages
              </p>
            </div>

            <div className="flex items-center justify-start flex-1/2 gap-1.5">
              <img src="/images/LastProjects/time.png" className="size-6 xl:size-8" />
              <p className="text-[#6B7A99] text-[9px] xl:text-xs 2xl:text-sm font-semibold">
                Deadline: {deadline}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-around w-full">
            <div className="flex items-center justify-start flex-1/2 gap-1.5">
              <img src="/images/LastProjects/wallet.png" className="size-6 xl:size-8" />
              <p className="text-[#6B7A99] text-[9px] xl:text-xs 2xl:text-sm font-semibold">
                Income: {income}
              </p>
            </div>

            <div className="flex items-center justify-start flex-1/2 gap-1.5">
              <img
                src="/images/LastProjects/remainingtime.png"
                className="size-6 xl:size-8"
              />
              <p className="text-[#6B7A99] text-[9px] xl:text-xs 2xl:text-sm font-semibold">
                {tasks} Tasks
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-400" />
    </div>
  );
};

export default ProjectItem;
