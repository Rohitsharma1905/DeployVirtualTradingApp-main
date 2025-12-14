import React, { useEffect, useState } from "react";
import UserDropdown from "../DropDowns/UserDropdown";
import logoImage from "../../../assets/img/PGR_logo.jpeg";
import { fetchOrgById } from "../../../redux/Organization/auth/organizationAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X } from 'lucide-react';
import {Link} from "react-router-dom"

export default function OrganizationNavbar({ sidebarExpanded, setSidebarExpanded }) {
  const dispatch = useDispatch();
  const { orgId, currentOrg } = useSelector((state) => state.organization.auth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    if (orgId) {
      dispatch(fetchOrgById(orgId));
    }
  }, [dispatch, orgId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className={`sticky top-0 w-full -mb-18 h-auto min-h-[73px] z-30 bg-white shadow-lg transition-all duration-300 ease-in-out ${
      sidebarExpanded ? "lg:pl-" : "lg:pl-0"
    }`}>
    
      <div className="w-full mx-auto flex items-center justify-between p-4 md:px-10 px-4">
        {/* Mobile Menu Button and Logo */}
        <div className="flex items-center space-x-4">
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
          >
            {sidebarExpanded ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          {/* Logo - Always visible on mobile */}
          <Link
            className="flex items-center space-x-4 font-bold hover:text-gray-900 transition-colors"
            to="/"
            // onClick={(e) => e.preventDefault()}
          >
            <img 
              src={logoImage} 
              alt="PGR Logo" 
              className="h-10 w-10 object-contain rounded-full"
            />
            <span className="hidden lg:block text-xl font-bold text-gray-900">
              PGR - Virtual Trading App
            </span>
          </Link>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <form className="hidden md:flex flex-row flex-wrap items-center lg:ml-auto mr-3">
          <div className="relative flex w-full flex-wrap items-stretch">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search here..."
              className="border border-gray-200 px-3 py-2 placeholder-gray-400 text-gray-700 relative bg-white rounded-lg text-sm shadow-sm outline-none focus:outline-none focus:ring-2 focus:ring-lightBlue-600 focus:border-lightBlue-600 w-full pl-10 transition-all duration-200"
            />
          </div>
        </form>

        {/* Organization Name - Hidden on mobile if there's not enough space */}
        <div className="bg-lightBlue-600 text-white px-4 py-1 rounded-lg hover:bg-lightBlue-400 hover:text-gray-100 transition-all mx-2 md:mx-4">
          <p 
            title="organization name" 
            className="text-sm md:text-lg uppercase truncate max-w-[120px] md:max-w-none"
          >
            {currentOrg?.name}
          </p>
        </div>

        {/* User Dropdown - Hidden on mobile if there's not enough space */}
        <div className="flex-col md:flex-row list-none items-center hidden md:flex">
          <UserDropdown orgId={orgId} />
        </div>

        {/* Mobile User Dropdown - Only shown on mobile */}
        {isMobile && (
          <div className="md:hidden">
            <UserDropdown orgId={orgId} mobile />
          </div>
        )}
      </div>
    </nav>
  );
}


