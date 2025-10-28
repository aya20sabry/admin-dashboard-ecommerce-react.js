// src/components/common/Pagination.jsx

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Reusable Pagination Component
 *
 * Features:
 * - Page navigation (Previous/Next)
 * - Page info display
 * - Items per page selector
 * - Mobile-first responsive design
 * - Touch-friendly buttons
 * - Accessible
 * - Customizable styling
 */

const Pagination = ({
  // Data
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,

  // Callbacks
  onPageChange,
  onItemsPerPageChange = null,

  // Items per page options
  itemsPerPageOptions = [5, 10, 20, 50],

  // Labels
  itemsLabel = "items",
  showingLabel = "Showing",
  ofLabel = "of",
  pageLabel = "Page",

  // Styling
  className = "",
  showItemsPerPage = true,
  showPageInfo = true,
  showTotalItems = true,

  // Disabled states
  disablePrevious = false,
  disableNext = false,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange && !disablePrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange && !disableNext) {
      onPageChange(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    if (onItemsPerPageChange) {
      const newLimit = Number(e.target.value);
      onItemsPerPageChange(newLimit);
      // Reset to page 1 when changing items per page
      if (onPageChange) {
        onPageChange(1);
      }
    }
  };

  const isPreviousDisabled = currentPage <= 1 || disablePrevious;
  const isNextDisabled = currentPage >= totalPages || disableNext;

  // Calculate range of items being shown
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}
    >
      <div className="flex flex-col xs:flex-row items-center justify-between gap-3">
        {/* Page Info & Items Count */}
        <div className="text-sm text-gray-600 order-2 xs:order-1">
          {showPageInfo && (
            <span className="inline-block">
              {pageLabel} {currentPage} {ofLabel} {totalPages}
            </span>
          )}
          {showPageInfo && showTotalItems && <span className="mx-2">•</span>}
          {showTotalItems && (
            <span className="hidden sm:inline">
              {showingLabel} {startItem}-{endItem} {ofLabel} {totalItems}{" "}
              {itemsLabel}
            </span>
          )}
          {showTotalItems && (
            <span className="sm:hidden">
              {totalItems} {itemsLabel}
            </span>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2 order-1 xs:order-2">
          {/* Items Per Page Selector */}
          {showItemsPerPage && onItemsPerPageChange && (
            <div className="flex items-center gap-2 mr-2 sm:mr-4">
              <label
                htmlFor="items-per-page"
                className="text-sm text-gray-600 whitespace-nowrap hidden sm:block"
              >
                Show:
              </label>
              <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tap-highlight-transparent touch-manipulation bg-white min-w-[70px]"
                aria-label="Items per page"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={isPreviousDisabled}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-touch min-w-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-touch min-w-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next page"
          >
            <span>Next</span>
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
