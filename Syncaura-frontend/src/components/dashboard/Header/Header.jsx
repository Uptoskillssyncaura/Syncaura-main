import { memo } from "react";
import { Ellipsis, Search } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import { FaBell } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { HiChartSquareBar } from "react-icons/hi";

const DotGrid = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    {[0, 8, 16].map((y) =>
      [0, 8, 16].map((x) => (
        <rect
          key={`${x}-${y}`}
          x={x + 3}
          y={y + 3}
          width="4"
          height="4"
          rx="1"
          className="fill-gray-400 "
        />
      ))
    )}
  </svg>
);

const Header = memo(({ currTab, show, setShow }) => {
  return (
    <div className="header-layout">
      <div className="flex gap-3 xl:gap-9 items-center col-span-3">
        <div className="shadow-custom " onClick={() => setShow((prev) => !prev)}>
          <DotGrid />
        </div>
        <h1
          style={{ fontFamily: "Poppins" }}
          className=" tracking-[4px] text-lg xl:text-2xl font-extralight text-gray-500 dark:text-gray-400"
        >
          FLOWBIT
        </h1>
      </div>
      <div className="flex justify-center gap-3 xl:gap-9 items-center col-span-3">
        <h2 className="text-sm font-bold text-[#8833FF]">{currTab}</h2>
        <div>
          <Ellipsis className="text-gray-400 dark:text-gray-200" />
        </div>
      </div>
      <div
        class="flex col-span-5 items-center  gap-x-2 bg-gray-200/10 
            shadow-[0_4px_4px_0_rgba(0,0,0,0.25),0_0px_4px_0_rgba(0,0,0,0.15)] 
             px-4 xl:px-10  rounded-3xl h-10 "
      >
        <input
          type="text"
          placeholder="Try Searching <<New Pages today>>"
          className="flex-1 outline-none text-gray-700 dark:text-gray-300 text-sm font-semibold placeholder:text-xs placeholder:font-bold"
        />
        <Search className="size-5 text-gray-500" />
      </div>
      <div className="flex col-span-5 items-center justify-center gap-5 xl:gap-10">
        <ToggleSwitch />
        <div className="relative bg-[#F3EAFF] p-1.5 xl:p-2 rounded-full">

          <div className="absolute -top-1 xl:-top-2 left-4.5 xl:left-5 size-4 xl:size-6 bg-[#8833FF] rounded-full flex items-center justify-center text-xs">
            <p className="text-white">1</p>
          </div>

          <FaBell className="text-[#8833FF] text-sm  xl:text-xl" />
        </div>
        <MdMessage className="text-gray-400  text-lg xl:text-xl" />
        <FaUserGroup className="text-gray-400  text-lg xl:text-xl" />
        <HiChartSquareBar className="text-gray-400  text-lg xl:text-xl" />
      </div>
    </div>
  );
});

export default Header;
