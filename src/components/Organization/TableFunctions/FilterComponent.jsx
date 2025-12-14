
// update filed remove

import React, { useState, useEffect } from "react";
import { X, Filter } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FilterComponent = ({
  isFilterOpen,
  setFilterOpen,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  gender,
  onGenderChange,
  onClearFilters,
  onApplyFilters,
  searchQuery,
  setSearchQuery,
}) => {
  // Local state for temporary filter values
  const [localStartDate, setLocalStartDate] = useState(startDate ? new Date(startDate) : null);
  const [localEndDate, setLocalEndDate] = useState(endDate ? new Date(endDate) : null);
  const [localGender, setLocalGender] = useState(gender);

  // Sync local state with global state
  useEffect(() => {
    setLocalStartDate(startDate ? new Date(startDate) : null);
    setLocalEndDate(endDate ? new Date(endDate) : null);
    setLocalGender(gender);
  }, [startDate, endDate, gender]);

  // Handle apply filters
  const handleApply = (e) => {
    e.stopPropagation(); // Prevent event propagation
    onStartDateChange(localStartDate);
    onEndDateChange(localEndDate);
    onGenderChange(localGender);
    onApplyFilters();
  };

  // Handle clear filters
  const handleClear = (e) => {
    e.stopPropagation(); // Prevent event propagation
    setLocalStartDate(null);
    setLocalEndDate(null);
    setLocalGender("");
    setSearchQuery("");
    onClearFilters();
  };

  return (
    <>
      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="bg-gray-50 rounded-md shadow-inner mt-0 overflow-hidden transition-max-height duration-300 ease-in-out max-h-96 p-6 z-50">
          <div className="flex items-end gap-4 flex-grow">
            {/* Gender Filter */}
            <div className="w-full max-w-52"> {/* Ensure full width */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={localGender}
                onChange={(e) => setLocalGender(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightBlue-600 h-[42px]" // Adjusted height
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="w-full "> {/* Ensure full width */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex space-x-2">
                <DatePicker
                  selected={localStartDate}
                  onChange={(date) => setLocalStartDate(date)}
                  selectsStart
                  startDate={localStartDate}
                  endDate={localEndDate}
                  placeholderText="Start Date"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightBlue-600 h-[42px]" // Adjusted height
                />
                <DatePicker
                  selected={localEndDate}
                  onChange={(date) => setLocalEndDate(date)}
                  selectsEnd
                  startDate={localStartDate}
                  endDate={localEndDate}
                  minDate={localStartDate}
                  placeholderText="End Date"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightBlue-600 h-[42px]" // Adjusted height
                />
              </div>
            </div>

            {/* Apply and Clear Buttons */}
            
            <div className="flex justify-end gap-x-4 w-full h-full items-end"> {/* ✅ Aligns to bottom */}
                 <button
                  onClick={handleClear}
                  className="flex items-center px-4 py-2 h-[42px] rounded-lg border border-gray-300 hover:bg-gray-50 text-sm md:text-base"
                  >
                  <X size={16} className="mr-1" />
                  Clear
            </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 h-[42px] rounded-lg bg-lightBlue-600 text-white hover:bg-lightBlue-700 text-sm md:text-base"
                >
                  Apply
             </button>
          </div>

          </div>
        </div>
      )}
    </>
  );
};

export default FilterComponent;







