

const StatsCard = ({
 label, topic
}) => {
  return (
    <div
  className={`
    flex flex-col items-center justify-center px-5 py-5 xl:py-8 rounded-2xl
    shadow-[0_6px_6px_3px_rgba(0,0,0,0.40),0_-1px_1px_1px_rgba(0,0,0,0.15)]
    bg-white dark:bg-[#1A1B1E] transition-all duration-300 
  `}
>
    <h1 style={{fontFamily: "Poppine"}}  className="text-[#6B7A99] font-bold dark:text-[#6B7A99] text-2xl">{label}</h1>
    <p  style={{fontFamily: "Poppine"}} className="text-[#8696b6] dark:text-[#ADB8CC] text-sm">{topic}</p>
      
    </div>
  );
};

export default StatsCard;
