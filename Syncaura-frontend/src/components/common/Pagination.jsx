import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

/**
 * Reusable Pagination Component for Syncaura
 * 
 * @param {Object} props
 * @param {number} props.currentPage - 1-indexed current active page
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total count of items
 * @param {number} props.pageSize - Number of items per page
 * @param {Function} props.onPageChange - Callback function (pageNumber) => void
 * @param {string} [props.className] - Additional wrapper styling classes
 * @param {string} [props.itemLabel] - Label for items (e.g. "items", "projects", "tasks")
 * @param {boolean} [props.showInfo] - Whether to show "Showing X-Y of Z" text (default: true)
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  className = "",
  itemLabel = "items",
  showInfo = true,
}) {
  if (totalPages <= 1 && totalItems <= pageSize) {
    return null;
  }

  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startItem = totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(validCurrentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include page 1
      pages.push(1);

      if (validCurrentPage > 3) {
        pages.push("ellipsis-1");
      }

      const start = Math.max(2, validCurrentPage - 1);
      const end = Math.min(totalPages - 1, validCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (validCurrentPage < totalPages - 2) {
        pages.push("ellipsis-2");
      }

      // Always include last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== validCurrentPage) {
      onPageChange(page);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2.5 py-4 px-2 w-full select-none text-center ${className}`}
    >
      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* First Page */}
        <button
          type="button"
          onClick={() => handlePageClick(1)}
          disabled={validCurrentPage === 1}
          title="First Page"
          className="p-1.5 rounded-lg border border-gray-200 dark:border-[#2d2f33] bg-white dark:bg-[#1c1d1e] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282a2d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronsLeft className="size-4" />
        </button>

        {/* Prev Page */}
        <button
          type="button"
          onClick={() => handlePageClick(validCurrentPage - 1)}
          disabled={validCurrentPage === 1}
          title="Previous Page"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-[#2d2f33] bg-white dark:bg-[#1c1d1e] text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282a2d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden xs:inline">Prev</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (typeof page === "string" && page.startsWith("ellipsis")) {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-gray-400 dark:text-gray-500 font-bold"
                >
                  •••
                </span>
              );
            }

            const isActive = page === validCurrentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => handlePageClick(page)}
                aria-current={isActive ? "page" : undefined}
                className={`min-w-[32px] h-8 flex items-center justify-center px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#2457C5] dark:bg-[#73FBFD] text-white dark:text-black shadow-xs"
                    : "border border-gray-200 dark:border-[#2d2f33] bg-white dark:bg-[#1c1d1e] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282a2d]"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => handlePageClick(validCurrentPage + 1)}
          disabled={validCurrentPage === totalPages}
          title="Next Page"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-[#2d2f33] bg-white dark:bg-[#1c1d1e] text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282a2d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="size-4" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => handlePageClick(totalPages)}
          disabled={validCurrentPage === totalPages}
          title="Last Page"
          className="p-1.5 rounded-lg border border-gray-200 dark:border-[#2d2f33] bg-white dark:bg-[#1c1d1e] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282a2d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronsRight className="size-4" />
        </button>
      </div>

      {/* Showing X - Y of Z text */}
      {showInfo && totalItems > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center">
          Showing <span className="font-bold text-gray-800 dark:text-gray-200">{startItem}</span>
          –<span className="font-bold text-gray-800 dark:text-gray-200">{endItem}</span> of{" "}
          <span className="font-bold text-gray-800 dark:text-gray-200">{totalItems}</span> {itemLabel}
        </div>
      )}
    </div>
  );
}
