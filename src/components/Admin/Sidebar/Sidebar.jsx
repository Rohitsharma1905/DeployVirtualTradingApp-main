import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import { resetAdminState } from '../../../redux/Admin/AdminSlice';
import toast from "react-hot-toast";
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { logout } from '../../../redux/User/authSlice'; //
export default function Sidebar({ sidebarExpanded, setSidebarExpanded }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
    setActiveMenu(null);
  };

  const handleLogout = () => {
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    // dispatch(resetAdminState());
    dispatch(logout()); 
    toast.success("Logout Successfully");
    navigate('/');
  };

  const handleMenuToggle = (menuName) => {
    if (!sidebarExpanded) {
      setSidebarExpanded(true);
    }
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarExpanded(false);
    }
  };

  const menuItems = {
    dashboard: [
      { to: "/admin/dashboard", icon: "fas fa-chart-line", label: "Dashboard" },
    ],
    stocks: [
      { to: "/admin/niftytable", icon: "fas fa-table", label: "Nifty 50" },
      { to: "/admin/nifty500table", icon: "fas fa-chart-line", label: "Nifty 500" },
      { to: "/admin/etftable", icon: "fas fa-list", label: "ETF" },
    ],
    users: [
      { to: "/admin/registeredUsers", icon: "fas fa-users", label: "Users" },
    ],
    organizations: [
      { to: "/admin/OrgRegister", icon: "fas fa-building", label: "Organizations" },
    ],
    queries: [
      { to: "/admin/queries", icon: "fas fa-envelope", label: "Queries" },
    ],
    feedback: [
      { to: "/admin/feedback", icon: "fas fa-comments", label: "Feedback" },
    ],
    complaint: [
      { to: "/admin/complaint", icon: "fas fa-exclamation-circle", label: " User" },
      { to: "/admin/org-complaint", icon: "fas fa-exclamation-circle", label: "Organization" },
    ],    
    events: [
      { to: "/admin/events", icon: "fas fa-calendar-alt", label: "Events" },
      { to: "/admin/participants", icon: "fas fa-calendar-alt", label: "Participants" },
    ],
    gallery: [
      { to: "/admin/gallery/categories", icon: "fas fa-folder-open", label:"Categories"},
      { to: "/admin/gallery/images", icon: "fas fa-photo-video", label:"Images"}
    ],
    BookedDemos: [
      {to: "/admin/demo/userDemo", icon: "fas fa-chalkboard-teacher", label:"User Bookings"},
      {to: "/admin/demo/organizationDemo", icon: "fas fa-handshake", label:"Organization Bookings"}
    ],
  };

  return (
    <>
      {sidebarExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setSidebarExpanded(false)}
        />
      )}

      <div className={`fixed top-0 left-0 bottom-0 z-30 w-64 bg-white shadow-xl transition-all duration-300 ease-in-out
        ${sidebarExpanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between w-full h-[73px] px-4 border-b border-gray-200">
            {sidebarExpanded ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-semibold">Admin Panel</span>
                <button
                  onClick={handleSidebarToggle}
                  className="p-1 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <button
                  onClick={handleSidebarToggle}
                  className="p-1 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none"
                >
                  <i className="fas fa-bars text-gray-600"></i>
                </button>
              </div>
            )}
          </div>
                    <div className={`flex-1 overflow-y-auto ${sidebarExpanded ? "px-1" : "px-0"}`}>
            {Object.entries(menuItems).map(([section, items]) => (
              <div key={section} className="space-y-1">
                <button
                  onClick={() => handleMenuToggle(section)}
                  className={`w-full flex items-center ${sidebarExpanded ? "justify-between p-2" : "justify-center p-3"} rounded-lg transition-all duration-200 
                    ${activeMenu === section ? "bg-lightBlue-600 text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"}`}
                  title={!sidebarExpanded ? section : ""}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 
                      ${activeMenu === section ? "bg-white/20" : "bg-lightBlue-100 hover:bg-gray-200"}`}>
                      <i className={`${getSectionIcon(section)} ${activeMenu === section ? "text-white" : "text-gray-500"}`}></i>
                    </div>
                    {sidebarExpanded && <span className="font-medium capitalize">{section}</span>}
                  </div>
                  {sidebarExpanded && (
                    activeMenu === section ? (
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                    )
                  )}
                </button>

                {sidebarExpanded && activeMenu === section && (
                  <div className="pl-4 space-y-1">
                    {items.map((item) => (
                      <MenuLink 
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        isActive={location.pathname === item.to}
                        sidebarExpanded={sidebarExpanded}
                        onClick={handleLinkClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <div className="p-4">
              <button 
                onClick={handleLogout}
                className={`w-full flex items-center justify-center text-red-500 hover:text-red-700 transition-colors rounded-lg p-3
                  ${sidebarExpanded ? "bg-red-50 hover:bg-red-100 space-x-2" : "hover:bg-red-50"}`}
                title={!sidebarExpanded ? "Logout" : ""}
              >
                <i className="fas fa-sign-out-alt"></i>
                {sidebarExpanded && <span>Logout</span>}
              </button>
            </div>

            <div className={`border-t bg-gray-50 p-4 flex items-center ${sidebarExpanded ? "justify-between" : "justify-center"}`}>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-lightBlue-600 flex items-center justify-center shadow-lg">
                    <i className="fas fa-user text-white"></i>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                {sidebarExpanded && (
                  <div>
                    <div className="font-medium">Admin</div>
                    <div className="text-sm text-gray-500">Administrator</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const MenuLink = ({ to, icon, label, isActive, sidebarExpanded, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center ${sidebarExpanded ? "space-x-3 px-4 py-2" : "justify-center p-3"} rounded-lg transition-all duration-200 
      ${isActive ? "bg-blue-50 text-lightBlue-600" : "text-gray-600 hover:bg-gray-100"}`}
    title={!sidebarExpanded ? label : ""}
  >
    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
      isActive ? "bg-blue-100" : "bg-gray-100"
    }`}>
      <i className={`${icon} ${isActive ? "text-lightBlue-600" : "text-gray-500"}`}></i>
    </div>
    {sidebarExpanded && <span className="text-sm font-medium">{label}</span>}
  </Link>
);

const getSectionIcon = (section) => {
  const icons = {
    dashboard: "fas fa-chart-line",
    stocks: "fas fa-chart-bar",
    users: "fas fa-users",
    organizations: "fas fa-building",
    queries: "fas fa-envelope",
    feedback: "fas fa-comments",
    complaint: "fas fa-exclamation-circle",
    events: "fas fa-calendar-alt",
    gallery: "fas fa-images",
    BookedDemos: "fas fa-calendar-check",
  };
  return icons[section] || "fas fa-circle";
};

Sidebar.propTypes = {
  sidebarExpanded: PropTypes.bool.isRequired,
  setSidebarExpanded: PropTypes.func.isRequired,
};

MenuLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  sidebarExpanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func
};
