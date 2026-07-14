import { AnimatePresence, motion } from 'framer-motion'
import { Funnel, Search } from 'lucide-react'
import { useState } from 'react'
import ComplaintFilters from '../ComplaintFilters'

const Complaintheader = ({ search, setSearch, onApplyFilters }) => {
    const [openFilter, setOpenFilter]=useState(false)
    return (
        <div className="flex transition-colors duration-500 flex-col md:flex-row px-6  items-center justify-between gap-4 mb-6">
            <h1 className=" text-2xl sm:text-3xl flex-5/9 font-semibold text-black dark:text-[#FFFFFF]">
                Complaints Management
            </h1>

            <div className="flex items-center justify-center sm:justify-end gap-3 flex-2/9   ">
              
      {/* Filter Button */}
      <button
        onClick={() => setOpenFilter((prev) => !prev)}
        className={`btn-hover rounded-full flex items-center justify-center border px-4 py-2 text-sm gap-3 transition-colors ${
            openFilter
              ? "border-[#2461E6] text-[#2461E6] dark:border-[#73FBFD] dark:text-[#73FBFD]"
              : "border-gray-300 text-black dark:border-[#777575] dark:text-[#8A8A8A]"
          } `}
      >
        <Funnel className="size-4" />
        <span>Filter</span>
      </button>

       <AnimatePresence mode="wait">
        {openFilter && (
         <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full absolute left-0 top-30 md:top-20 z-100"
    >
           <ComplaintFilters
  onClose={() => setOpenFilter(false)}
  onApply={onApplyFilters}
/>

          </motion.div>
        )}
      </AnimatePresence>
   
                <div
                    className="flex w-3/5 sm:w-full items-center gap-x-2 
             bg-[#EDEDED] dark:bg-[#2E2F2F] 
             px-4 rounded-3xl h-10"
                >
                    <Search className="size-4 sm:size-5 text-[#777575] shrink-0" />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search"
                        className="flex-1 min-w-0 text-lg outline-none 
               text-gray-700 dark:text-[#8A8A8A] font-semibold
               dark:placeholder:text-[#8A8A8A]
               placeholder:text-sm placeholder:text-[#989696]"
                    />
                </div>

            </div>
        </div>
    )
}

export default Complaintheader