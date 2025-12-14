import React, { useState, useEffect, useRef } from "react"; // Added useEffect and useRef for potential outside click handling
import { IoIosArrowDown } from "react-icons/io";

const CustomSelect = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null); // Ref for detecting clicks outside

  // Optional: Add click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);


  // Find the label corresponding to the current value for display
  const displayLabel = options.find(opt => opt.value === value)?.label || value;

  return (
    // Changed: Replaced w-40 with w-full for responsiveness
    <div className="flex flex-col relative w-full" ref={selectRef}>
      {label && ( // Conditionally render label if provided
        <label className="text-sm font-medium text-gray-600 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        // Changed: Added w-full. Adjusted padding slightly if needed (px-3/py-2 is common)
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none w-full flex justify-between items-center bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* Changed: Added truncate to handle long text */}
        <span className="block truncate">{displayLabel}</span>
        <IoIosArrowDown className={`text-lg text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {isOpen && (
        // Changed: Added w-full to match the button width
        <ul
          className="absolute z-50 mt-1 border rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto w-full ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="listbox"
         // Optionally set aria-activedescendant if managing focus within the list
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value); // Call the passed onChange handler
                setIsOpen(false);
              }}
              className={`cursor-pointer px-4 py-2 hover:bg-blue-100 text-sm ${
                opt.value === value
                  ? "bg-blue-50 font-semibold text-blue-700" // Highlight selected
                  : "text-gray-900 hover:text-blue-800"
              }`}
              role="option"
              aria-selected={opt.value === value}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;