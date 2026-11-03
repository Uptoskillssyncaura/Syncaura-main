import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const RecentProjectItems = ({ proj, currItem, setCurrItem }) => {
  const isActive = currItem === proj;

  return (
    <div
      onClick={() => setCurrItem(proj)}
      className={`
        px-3 py-2 xl:py-3 xl:pr-6 rounded-xl text-sm font-semibold cursor-pointer
        flex items-center transition-all duration-300 ease-in-out
        ${isActive
          ? "bg-green-50 border border-green-300 text-green-500 justify-between shadow-sm"
          : "bg-gray-100 dark:bg-[#1A1B1E] hover:bg-gray-200 dark:hover:bg-[#222] text-gray-700 dark:text-gray-500"
        }
      `}
    >
      <p className="flex-1 text-xs xl:text-sm transition-colors duration-300">
        {proj}
      </p>

      <MdOutlineKeyboardArrowRight
        className={`
          text-2xl transition-all duration-300
          ${isActive
            ? "text-green-500 translate-x-1"
            : "text-gray-400 group-hover:translate-x-1"
          }
        `}
      />
    </div>
  );
};

export default RecentProjectItems;
