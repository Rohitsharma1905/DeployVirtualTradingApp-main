import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, itemsPerPage, onPageChange, onItemsPerPageChange }) => {
  return (
    <>
      {/* Desktop View - hidden on mobile */}
      <div className="hidden md:flex justify-between items-center mt-4 px-4 py-3">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={onItemsPerPageChange}
            className="form-select px-6 py-2 rounded-md border-gray-300 shadow-sm 
                       focus:border-lightBlue-500 focus:ring focus:ring-lightBlue-200 
                       focus:ring-opacity-50 text-sm"
          >
            {[10, 50, 100, 200].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="px-4 text-sm font-medium text-gray-700">
            {(currentPage - 1) * itemsPerPage + 1}-{" "}
            {Math.min(currentPage * itemsPerPage, totalPages)} of {totalPages}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? "bg-lightBlue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Mobile View - hidden on desktop */}
      <div className="md:hidden flex flex-col gap-3 mt-4 px-4 py-3">
        {/* First Row - Items per page and count */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={onItemsPerPageChange}
              className="form-select px-3 py-1 rounded-md border-gray-300 shadow-sm 
                         focus:border-lightBlue-500 focus:ring focus:ring-lightBlue-200 
                         focus:ring-opacity-50 text-sm"
            >
              {[10, 50, 100, 200].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {(currentPage - 1) * itemsPerPage + 1}-{" "}
            {Math.min(currentPage * itemsPerPage, totalPages)} of {totalPages}
          </span>
        </div>

        {/* Second Row - Page navigation */}
        <div className="flex justify-center items-center w-full gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex overflow-x-auto mx-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-md mx-1 ${
                  currentPage === page
                    ? "bg-lightBlue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Pagination;