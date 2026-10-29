import React from 'react'

const PaginationDots = ({pages, currentPage, setDirection, setCurrentPage}) => {
  return (
    <div
          className="absolute top-1/2 right-0 -translate-y-1/2 
                  flex flex-col items-center gap-3 
                  p-3 bg-gray-100 dark:bg-[#2a2a2a] 
                  rounded-l-2xl shadow-xl z-40"
        >
          {Array.from({ length: pages }).map((_, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (idx > currentPage) {
                  setDirection(1); // next
                } else {
                  setDirection(-1); // prev
                }
                setCurrentPage(idx);
              }}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300
          ${
            currentPage === idx
              ? "bg-blue-500 scale-125"
              : "bg-gray-400 dark:bg-gray-600 hover:scale-110"
          }`}
            />
          ))}
        </div>
  )
}

export default PaginationDots