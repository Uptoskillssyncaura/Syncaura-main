const ProgressBar = ({ value = 45 }) => {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="relative w-full h-px bg-gray-200 rounded-full overflow-hidden">

        <div
          className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>

      <span className="text-[#7D8FB3] text-sm font-semibold">
        {value}%
      </span>
    </div>
  );
};

export default ProgressBar;
