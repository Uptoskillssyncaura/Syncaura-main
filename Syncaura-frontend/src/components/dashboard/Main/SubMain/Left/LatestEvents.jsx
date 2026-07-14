import { FiMoreHorizontal } from "react-icons/fi";
import { GiBackwardTime } from "react-icons/gi";
import { HiUserCircle } from "react-icons/hi";
import { IoIosCloudDone } from "react-icons/io";
import { RiMessage2Fill } from "react-icons/ri";

export default function LatestEvents() {
  const events = [
    {
      icon: <GiBackwardTime className="-rotate-60 size-5 xl:size-7" />,
      color: "text-green-500 bg-green-500/10",
      text: "Added new tasks",
      time: "12:45",
    },
    {
      icon: <HiUserCircle className="text-[#1A1B1E] fill-blue-600 size-6 xl:size-8" />,
      color: " bg-blue-500/10",
      text: "Added Members",
      time: "11:32",
    },
    {
      icon: (
        <img src="/images/LatestEvent/stage.png" className="text-sm size-7 xl:size-7" />
      ),
      color: "bg-red-500/10 bg-red-100",
      text: "Add Stages",
      time: "12 Oct",
    },
    {
      icon: (
        <RiMessage2Fill className="text-[#1A1B1E] fill-purple-600 size-4 xl:size-6" />
      ),
      color: "bg-purple-500/10",
      text: "Add Message",
      time: "9 Oct",
    },
    {
      icon: <IoIosCloudDone className="text-[#1A1B1E] fill-blue-400 size-4 xl:size-6" />,
      color: "bg-blue-500/10",
      text: "Add Message",
      time: "7 Oct",
    },
    {
      icon: (
        <img src="/images/LatestEvent/bag.png" className="text-sm size-4 xl:size-6" />
      ),
      color: "bg-red-500/10 ",
      text: "Add Company",
      time: "4 Oct",
    },
    {
      icon: <HiUserCircle className="text-[#1A1B1E] fill-blue-600 size-6 xl:size-8" />,
      color: " bg-blue-500/10",
      text: "Add Company",
      time: "4 Oct",
    },
  ];

  return (
    <div
      className="
        bg-white dark:bg-[#1A1B1E]
        shadow-[0_6px_6px_3px_rgba(0,0,0,0.40),0_-1px_1px_1px_rgba(0,0,0,0.15)] rounded-xl
       
      
         pt-4 pb-5
      "
    >
      <div className="flex px-5 2xl:px-10 items-center justify-between pb-3 ">
        <h2 className="text-[14px] font-semibold text-gray-700 dark:text-gray-200">
          Latest events
        </h2>
        <FiMoreHorizontal className="text-gray-500 text-xl cursor-pointer" />
      </div>
      <div className="h-[0.5px] w-full bg-gray-200 dark:bg-gray-400" />

      <div className="flex flex-col gap-4 mt-4 px-5 2xl:px-10">
        {events.map((ev, idx) => (
          <div key={idx} className="grid grid-cols-6 ">
            <div className="col-span-1">
              <div
                className={`
                  w-10 h-7 xl:w-13 xl:h-10 rounded-[50%/50%] flex items-center justify-center
                  ${ev.color} 
                `}
              >
                {ev.icon}
              </div>
            </div>

            <div className="text-gray-700 col-span-4 dark:text-[#7D7D7D] font-semibold text-sm xl:text-xl pl-3">
              {ev.text}
            </div>

            {/* TIME */}
            <div className="text-gray-400 col-span-1   dark:text-gray-500 text-[10px] xl:text-sm">
              <div className="flex items-center justify-end  ">
                <p className="bg-gray-500/10 transition-colors duration-550  dark:bg-[#000000]  w-15 px-1 py-0.5 flex items-center justify-center rounded-xl ">
                  {ev.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SHOW MORE */}
      <div className="px-5 -mt-2 xl:mt-0 xl:px-10">
        <button
          className="mt-6 w-full bg-blue-500/10 text-blue-600 py-2 rounded-lg text-xs xl:text-sm font-medium hover:bg-[#E2E5FF] transition btn-hover"
        >
          Show More
        </button>
      </div>
    </div>
  );
}
