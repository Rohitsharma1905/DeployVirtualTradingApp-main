import React, { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from 'lucide-react';
import logoImage from "../../../assets/img/PGR_logo.jpeg";
import { Link } from "react-router-dom";

export default function AdminNavbar({ sidebarExpanded, setSidebarExpanded }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`sticky top-0 w-full -mb-18 h-auto min-h-[73px] z-30 bg-white shadow-lg transition-all duration-300 ease-in-out ${
      sidebarExpanded ? "lg:pl-0" : "lg:pl-0"
    }`}>
      <div className="w-full mx-auto flex flex-wrap justify-between px-4 py-3 md:px-10">
        {/* Logo and Brand */}
          <button 
            className="lg:hidden p-2 mr-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
          >
            {sidebarExpanded ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        <Link className="flex items-center" to="/">
          <img 
            src={logoImage} 
            alt="PGR Logo" 
            className="h-10 w-10 object-contain rounded-full"
          />
          <span className="hidden lg:block text-xl ml-4 font-bold">PGR - Admin Panel</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center space-x-4">
          {/* Search Bar - Desktop */}
          {/* <div className="hidden md:block relative">
            <div className="relative w-[270px]">
              <img
                src="https://cdn-icons-png.flaticon.com/512/622/622669.png"
                alt="search"
                className="absolute left-3 top-1/4 transform -translate-y-1/2 w-4 h-4"
              />
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-400 pl-10 pr-2 py-2 rounded-lg w-full h-[36px] focus:outline-none focus:shadow-md focus:border-black"
              />
            </div>
          </div> */}

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center space-x-2">
              <div className="bg-lightBlue-600 text-white px-4 py-1 rounded-lg hover:bg-lightBlue-400 hover:text-gray-100 transition-all">
                <p className="text-lg">{user?.name || "Admin"}</p>
              </div>
              
              {/* <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2"
              >
                <div className="w-10 h-10 rounded-full bg-lightBlue-600 flex items-center justify-center text-white">
                  <i className="fas fa-user-circle text-xl"></i>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}/>
              </button> */}
            </div>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <button 
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsDropdownOpen(false);
                    }} 
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}