
import {  FiPlusCircle } from "react-icons/fi";

export default function DashboardHeader({active, setActive}) {
  const tabs = ["Dashboard", "All Projects", "Schedule", "Meeting", "Activity", "Members"];
 

  return (
    <div className=" flex  items-center justify-between px-5 mr-1 xl:mr-5 2xl:px-10 py-2">


      <h2 className=" text-sm xl:text-base  font-bold text-[#8833FF]">
        Dashboard Projects
      </h2>

      <div className="flex items-center bg-white transition-colors duration-550 dark:bg-[#000000] shadow-[0_4px_4px_0_rgba(0,0,0,0.25),0_0px_4px_0_rgba(0,0,0,0.15)]   rounded-full px-3 xl:px-6 py-2 gap-4 xl:gap-6">
        {tabs.map((tab) => (
          <button
          onClick={()=>setActive(tab)}
            key={tab}
            className={`btn-hover text-xs xl:text-sm transition font-semibold ${
              tab === active
                ? "text-[#8833FF] font-bold"
                : "text-gray-400 hover:text-[#c39bfa]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* RIGHT — Button */}
      <button className="flex gap-1 xl:gap-3 text-gray-400 fill-gray-500 items-center btn-hover">
        <div><FiPlusCircle className="text-white dark:text-[#1A1B1E] fill-[#C3CAD9] dark:fill-[#C3CAD9] size-4 xl:size-6"/></div>
        <p style={{fontFamily: "Poppins"}} className="text-gray-500 dark:text-[#7D8FB3] text-[9px] xl:text-xs font-bold">Add New Project</p>
      </button>
    </div>
  );
}
