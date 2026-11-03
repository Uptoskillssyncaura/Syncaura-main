
const QuickActions = ({actions}) => {
  return (
    <div
      className="w-full flex items-center justify-around px-5 2xl:px-17 pb-5 pt-6 xl:pb-7 xl:pt-8 rounded-md
      shadow-[0_6px_6px_2px_rgba(0,0,0,0.55),0_-1px_0px_0px_rgba(0,0,0,0.15)]
      bg-white dark:bg-[#1A1B1E] transition-all duration-300"
    >
      {actions.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center gap-2 cursor-pointer"
        >
          <img
            src={item.icon}
            alt={item.label}
            className="object-contain size-5 xl:size-7.5"
          />
          <p
            style={{ fontFamily: "Poppins" }}
            className="text-[9px] xl:text-xs text-gray-500 dark:text-gray-400 font-semibold"
          >
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;
