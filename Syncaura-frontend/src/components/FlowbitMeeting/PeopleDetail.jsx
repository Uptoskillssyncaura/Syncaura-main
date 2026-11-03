import { Search } from "lucide-react";
import { useRef, useState } from "react";
import MembersPanel from "./MembersPanel";

const PeopleDetail = ({ participants, isDarkTheme }) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex flex-col w-full h-full px-5 gap-6 ">
      <div
        className={`
      flex items-center w-full py-1 px-2 xl:px-4 xl:py-2
      gap-3 xl:gap-5 rounded-xl border
      transition-all duration-200
      ${ isFocused ?  "border-blue-500 dark:border-[#73FBFD]" : "border-[#989696] dark:border-gray-300"}
    `}
      >
        <Search className="text-[#989696] size-6" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for People"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="text-lg w-full placeholder:text-[#989696]
                 text-[#989696] font-normal
                 border-none outline-none bg-transparent"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 w-full min-h-0 gap-3">
        {/* Title */}
        <div className="flex items-center w-full">
          <p className="text-[#6C6969] dark:text-gray-200 text-base font-normal">IN THE MEETING</p>
        </div>

        <div className="flex-1 w-full  min-h-0">
          <MembersPanel PARTICIPANTS={participants} />
        </div>
      </div>
    </div>
  );
};

export default PeopleDetail