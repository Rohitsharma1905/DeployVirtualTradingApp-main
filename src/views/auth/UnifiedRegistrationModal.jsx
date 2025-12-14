import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import UserRegisterForm from "./Register";
import OrgRegisterForm from "../Organization/OrganizationDetails/Models/OrganizationRegistration";

const ToggleSwitch = ({ isOn, onToggle, disabled = false }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only"
      checked={isOn}
      onChange={onToggle}
      disabled={disabled}
    />
    <div
      className={`relative w-[180px] md:w-[220px] h-9 rounded-full bg-white border-2 border-lightBlue-600 transition-opacity ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div
        className={`absolute h-8 w-[86px] md:w-[106px] rounded-full bg-lightBlue-600 transition-transform duration-300 ease-in-out ${
          isOn ? "translate-x-[90px] md:translate-x-[110px]" : "translate-x-0"
        }`}
      />
      <div className="absolute inset-0 flex justify-between items-center px-3 md:px-4 text-sm font-medium z-10">
        <span className={`transition-colors duration-300 text-sm ${isOn ? "text-lightBlue-600" : "text-white"}`}>
          User
        </span>
        <span className={`transition-colors duration-300 text-sm ${isOn ? "text-white" : "text-lightBlue-600"}`}>
          Organization
        </span>
      </div>
    </div>
  </label>
);

const UnifiedRegisterModal = ({ isOpen, onClose, onOpenLogin }) => {
  const [isUser, setIsUser] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[80vw] max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-lightBlue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-user text-white text-sm" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Register</h2>
          </div>
          <div className="flex items-center">
            <ToggleSwitch 
              isOn={!isUser} 
              onToggle={() => setIsUser(!isUser)} 
            />
            <button
              onClick={onClose}
              className="ml-2 p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FaTimes className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>
        <div className="p-4 md:p-6 max-h-[80vh] overflow-y-auto">
          {isUser ? (
            <UserRegisterForm 
              onClose={onClose}
              onOpenLogin={onOpenLogin}
            />
          ) : (
            <OrgRegisterForm 
              onClose={onClose}
              onOpenLogin={onOpenLogin}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedRegisterModal;