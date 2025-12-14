import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

import OrgBookDemoForm from "./OrgBookDemoForm";
import UserBookDemoForm from "./UserBookDemoForm";

// Toggle Switch Component
const ToggleSwitch = ({ isOn, onToggle, disabled }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only"
      checked={isOn}
      onChange={onToggle}
      disabled={disabled}
    />

    {/* Track */}
    <div
      className={`
        relative w-[330px] h-10 rounded-full bg-white border-2 border-sky-600 transition-opacity
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {/* Sliding Toggle */}
      <div
        className={`
          absolute h-9 w-[162px] rounded-full bg-lightBlue-600 transition-transform duration-300 ease-in-out
          ${isOn ? "translate-x-[165px]" : "translate-x-0"}
        `}
      />

      {/* Labels */}
      <div className="absolute inset-0 flex justify-between items-center px-6 text-sm font-semibold z-10">
        <span className={`transition-colors duration-300 text-lg ${isOn ? "text-lightBlue-600" : "text-white"}`}>
          Organization
        </span>
        <span className={`transition-colors duration-300 text-lg ${isOn ? "text-white" : "text-lightBlue-600"}`}>
          User &nbsp;&nbsp;&nbsp;
        </span>
      </div>
    </div>
  </label>
);

// Main Modal Component
const BookDemoBGModal = ({ closeModal }) => {

// User Form Component
const UserForm = () => (
  <div className="p-0">
    <UserBookDemoForm closeModal={closeModal}/>
  </div>
);

// Organization Form Component
const OrganizationForm = () => (
  <div className="p-0">
    <OrgBookDemoForm closeModal={closeModal}/>
  </div>
);

  const [isUser, setIsUser] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-gray-900 opacity-50"
        onClick={closeModal}
      />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-5xl mx-auto my-6 bg-white rounded-2xl shadow-2xl border border-gray-100 px-6 py-4"
      >
        {/* Header Section */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 mb-2">
          {/* Left side: Icon and title */}
          <div className="flex items-center space-x-3">
            <div className="mb-2 w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-chalkboard-teacher text-white fa-lg" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-800">Book A Demo</h2>
          </div>

          {/* Middle: Toggle Switch */}
          <div className="flex items-center space-x-2 mb-2">
            <ToggleSwitch isOn={!isUser} onToggle={() => setIsUser(!isUser)} />
          </div>

          {/* Right side: Close button */}
          <button
          onClick={closeModal}
          className="mb-2 p-2 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
          >
            <FaTimes className="text-gray-400 hover:text-gray-600 text-lg" />
          </button>
        </div>

        {/* Body Section */}
        <div>
          {!isUser ? <UserForm /> : <OrganizationForm />}
        </div>
      </div>
    </div>
  );
};

export default BookDemoBGModal;