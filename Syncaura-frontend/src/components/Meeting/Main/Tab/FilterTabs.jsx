import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function FilterTabs({ activeFilter, setActiveFilter }) {
  const { t } = useTranslation();
  
  const filters = [
    { key: "all", label: t('filter_all', 'All') },
    { key: "ongoing", label: t('filter_ongoing', 'Ongoing') },
    { key: "upcoming", label: t('filter_upcoming', 'Upcoming') },
    { key: "past", label: t('filter_past', 'Past') },
  ];
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
  
      <div
        className="
          bg-[#ededed]
          dark:bg-[#383838]
          w-fit
          flex items-center
          gap-1
          p-1
          rounded-full
          relative
        "
      >
  
        {filters.map((item) => {
  
          const isActive = activeFilter === item.key;
  
          return (
            <div
              key={item.key}
              className="relative"
            >
  
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                  }}
                  className="
                    absolute inset-0
                    bg-[#2563eb]
                    dark:bg-[#73FBFD]
                    rounded-full
                  "
                />
              )}
  
              <button
                onClick={() => setActiveFilter(item.key)}
                className={`btn-hover relative z-10 px-4 py-1.5 text-[13px] font-medium rounded-full whitespace-nowrap transition ${isActive
                    ? "text-white dark:text-black"
                    : "text-[#4b5563] dark:text-[#d1d5db]"
                  } `}
              >
                {item.label}
              </button>
  
            </div>
          );
        })}
      </div>
  
    </div>
  );}
