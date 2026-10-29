import { AnimatePresence, motion } from 'framer-motion'
import { Funnel, Search } from 'lucide-react'
import { useState } from 'react'
import ComplaintFilters from '../ComplaintFilters'

const Complaintheader = ({
  search,
  setSearch,
  onApplyFilters,
  appliedFilters,
  onResetFilters,
  title = "Issues & Complaints",
}) => {
    const [openFilter, setOpenFilter] = useState(false);
    const hasActiveFilters = Boolean(
      appliedFilters && (
        (appliedFilters.status && appliedFilters.status.toLowerCase() !== "all") ||
        appliedFilters.date
      )
    );

    return (
        <div className="flex transition-colors duration-500 flex-col md:flex-row px-6 items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl flex-5/9 font-semibold text-black dark:text-[#FFFFFF]">
                {title}
            </h1>

            <div className="flex items-center justify-center sm:justify-end gap-3 flex-2/9">
              
      {/* Filter Button */}
      <button
        onClick={() => setOpenFilter((prev) => !prev)}
        className={`btn-hover px-4 py-2 flex items-center justify-center gap-2 border rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            openFilter || hasActiveFilters
              ? "border-[#2461E6] bg-blue-50 dark:bg-blue-950/40 text-[#2461E6] dark:border-[#73FBFD] dark:text-[#73FBFD]"
              : "border-gray-200 bg-white dark:border-[#2A2A2A] dark:bg-[#121212] text-gray-800 dark:text-gray-200 hover:border-blue-500 dark:hover:border-[#73FBFD]"
          }`}
      >
        <Funnel className="size-4" />
        <span>{hasActiveFilters ? "Filtered" : "Filter"}</span>
        {hasActiveFilters && (
          <span className="size-2 rounded-full bg-[#2461E6] dark:bg-[#73FBFD]" />
        )}
      </button>

       <AnimatePresence mode="wait">
        {openFilter && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full absolute left-0 top-30 md:top-20 z-100"
          >
           <ComplaintFilters
             currentFilters={appliedFilters}
             onClose={() => setOpenFilter(false)}
             onApply={onApplyFilters}
             onReset={onResetFilters}
           />
          </motion.div>
        )}
      </AnimatePresence>
   
      <div
        className="flex w-3/5 sm:w-full items-center gap-x-2 
          bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2A2A2A]
          px-3.5 rounded-xl h-10 shadow-xs"
      >
        <Search className="size-4 text-gray-400 dark:text-gray-500 shrink-0" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search issues..."
          className="flex-1 min-w-0 text-sm outline-none 
            text-gray-800 dark:text-gray-200 font-medium
            dark:placeholder:text-gray-500
            placeholder:text-gray-400"
        />
      </div>

            </div>
        </div>
    )
}

export default Complaintheader