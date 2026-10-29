import React, { useEffect, useRef, useState } from "react";

const Tabs = ({ tabs, active, setActive }) => {
  
  const containerRef = useRef(null);
  const underlineRef = useRef(null);

  const updateUnderline = () => {
    if (!containerRef.current || !underlineRef.current) return;

    const activeTab = containerRef.current.children[active];
    if (!activeTab) return;

    underlineRef.current.style.width = `${activeTab.offsetWidth }px`;
    underlineRef.current.style.transform = `translateX(${activeTab.offsetLeft }px)`;
  };

  useEffect(() => {
    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [active]);

  return (
    <div className="relative w-full overflow-hidden px-3 sm:px-5">
      <div
        ref={containerRef}
        className="
          flex items-center justify-around gap-3 xl:gap-6
          overflow-x-auto scrollbar-hide
          relative z-10
          whitespace-nowrap
        "
      >
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActive(index)}
            className={`btn-hover relative py-2 text-[10px] xl:text-xs 2xl:text-sm font-semibold transition-colors duration-300 ${active === index ? "text-[#FF6633]" : "text-[#7D8FB3]"} `}
          >
            {tab}
          </button>
        ))}
      </div>

      <span
        ref={underlineRef}
        className="
          absolute left-0 bottom-0 h-0.5 bg-[#FF6633] rounded-full
          transition-all duration-300 ease-in-out ml-5
        "
      />

      <div className="absolute bottom-0 left-0 w-full">
        <div className="h-px bg-[#F5F6F7] dark:bg-gray-500" />
      </div>
    </div>
  );
};

export default Tabs;
