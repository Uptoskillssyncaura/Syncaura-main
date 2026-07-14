import { FiArrowRight } from "react-icons/fi";
import { AiFillHome } from "react-icons/ai";
import ProjectListItem from "./ProjectListItem";
import { ClipboardList, Ellipsis, MessageSquare, MessagesSquare, Phone } from "lucide-react";
import StatsItems from "./StatsItems";
import RecentProjectItems from "./RecentProjectItems";
import { useState } from "react";

export default function SidebarPanel({ show }) {
  const [selectedRecentProjectItems, setSelectedRecentProjectItems] = useState(
    "Facebook Application"
  );
  const handleSelectedRecentProjectItems = (item) => {
    setSelectedRecentProjectItems(item);
  };
  const projectItems = [
    { icon: <MessagesSquare className="fill-orange-500" />, label: "chats", color: "" },
    { icon: <ClipboardList size={30} className="fill-blue-400 " />, label: "Tasks", color: "text-black" },
    {
      icon: (
        <svg
          width="26"
          height="24"
          viewBox="0 0 26 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.3984 12.6046H13.8092C13.3345 12.6046 12.9461 12.9591 12.9461 13.3924V15.7558C12.9461 16.1891 13.3345 16.5436 13.8092 16.5436H16.3984C16.8731 16.5436 17.2615 16.1891 17.2615 15.7558V13.3924C17.2615 12.9591 16.8731 12.6046 16.3984 12.6046ZM16.3984 4.72672V5.51451H9.49383V4.72672C9.49383 4.29344 9.10545 3.93893 8.63076 3.93893C8.15607 3.93893 7.76768 4.29344 7.76768 4.72672V5.51451H6.90461C5.9466 5.51451 5.1871 6.22352 5.1871 7.09009L5.17847 18.1191C5.17847 18.9857 5.9466 19.6947 6.90461 19.6947H18.9876C19.937 19.6947 20.7138 18.9857 20.7138 18.1191V7.09009C20.7138 6.22352 19.937 5.51451 18.9876 5.51451H18.1246V4.72672C18.1246 4.29344 17.7362 3.93893 17.2615 3.93893C16.7868 3.93893 16.3984 4.29344 16.3984 4.72672ZM18.1246 18.1191H7.76768C7.29299 18.1191 6.90461 17.7646 6.90461 17.3314V9.45346H18.9876V17.3314C18.9876 17.7646 18.5992 18.1191 18.1246 18.1191Z"
            fill="#29CC39"
          />
        </svg>
      ),
      label: "Calendars",
      color: "text-green-500",
    },
    {
      icon: <MessageSquare className="fill-blue-600" />,
      label: "Messages",
      color: "text-blue-600",
    },
    { icon: <Phone />, label: "Meetings", color: "text-green-400" },
  ];

  const statsOvelCard = [
    { label: "Projects", value: 3, color: "bg-green-500" },
    { label: "Tasks", value: 3, color: "bg-purple-600" },
    { label: "Messages", value: 3, color: "bg-blue-500" },
    { label: "Chats", value: 3, color: "bg-orange-500" },
  ];

  const recentProjectItems = [
    "Twitter App",
    "Web Application Development",
    "City Advertising Campaign",
    "Facebook Application",
  ];
  return (
    <div className="w-full min-w-0 space-y-3 sm:space-y-4">
      <div
        className={`
    bg-white dark:bg-[#000000]
    shadow-lg rounded-2xl p-4
    transition-all duration-500 ease-in-out
    transform
    ${show
            ? "opacity-0 -translate-y-4 max-h-0 overflow-hidden pointer-events-none"
            : "opacity-100 translate-y-0 max-h-125"
          }
  `}
      >
        <div className="bg-purple-600 rounded-xl px-4 py-3 sm:px-5 sm:py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 xl:gap-2">
            <AiFillHome className="text-purple-400 text-sm xl:text-lg" />
            <h3 className="text-white font-semibold text-xs sm:text-sm xl:text-base">My projects</h3>
          </div>

          <div className="text-xs bg-white/30 text-white flex size-7 shrink-0 items-center justify-center rounded-[50%/50%] font-semibold">
            9
          </div>
        </div>

        <div className="mt-4 space-y-1">
          {projectItems.map((item, idx) => (
            <ProjectListItem
              label={item.label}
              color={item.color}
              icon={item.icon}
              key={idx}
            />
          ))}
        </div>
      </div>

      <div className="dark:bg-[#000000] transition-colors duration-550 shadow-[0_5px_5px_1px_rgba(0,0,0,0.25)] rounded-2xl p-4 sm:p-5 space-y-4 sm:space-y-6">
        <div className="flex bg-white dark:bg-[#1A1B1E] flex-col px-3 sm:px-4 xl:px-5 py-4 rounded-xl shadow-[0_3px_3px_1px_rgba(0,0,0,0.28),0_-1px_0px_0px_rgba(0,0,0,0.15)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-500">
              Projects on Deadlines
            </h3>
            <span className="text-gray-400 text-lg">
              <Ellipsis />
            </span>
          </div>

          <div className="bg-orange-50 dark:bg-[#1A1B1E] transition-colors duration-550 border border-orange-200 dark:border-gray-200 rounded-xl px-2 py-4 xl:p-4 flex items-center justify-between cursor-pointer">
            <div className="text-orange-600 font-medium text-xs xl:text-sm">
              Develop Chat Application
            </div>
            <FiArrowRight className="text-orange-600 text-lg" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {statsOvelCard.map(({ label, value, color }, index) => (
            <StatsItems key={index} label={label} value={value} color={color} />
          ))}
        </div>

        <div className="flex flex-col bg-white dark:bg-[#000000] transition-colors duration-550 py-3 shadow-[0_3px_2px_1px_rgba(0,0,0,0.10),0_-1px_0px_0px_rgba(0,0,0,0.005)] rounded-2xl px-0 xl:px-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-400">
              Recent Projects
            </h3>
            <span className="text-gray-400 text-lg">
              <Ellipsis />
            </span>
          </div>

          <div className="space-y-3 flex flex-col   rounded-xl ">
            {recentProjectItems.map((proj, idx) => (
              <RecentProjectItems
                key={idx}
                proj={proj}
                currItem={selectedRecentProjectItems}
                setCurrItem={handleSelectedRecentProjectItems}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
