const Tab = ({ name, curr, tabKey, setCurr }) => {
  const isActive = curr === tabKey;

  return (
    <div
      onClick={() => setCurr(tabKey)}
      className={`px-4 py-1 rounded-full cursor-pointer text-sm font-semibold transition
        ${
          isActive
            ? "bg-[#2461E6] text-white dark:bg-[#73FBFD] dark:text-black"
            : "bg-white text-[#082A44] border border-[#EAECEF] hover:bg-blue-50 hover:text-blue-800 dark:bg-black dark:text-[#B2B2B2] dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-[#73FBFD]"
        }`}
    >
      {name}
    </div>
  );
};

export default Tab;