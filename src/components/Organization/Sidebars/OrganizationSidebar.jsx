import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrgById, logoutOrganization } from "../../../redux/Organization/auth/organizationAuthSlice";
import NotificationDropdown from "../../Admin/Dropdowns/NotificationDropdown";
import UserDropdown from "../../Admin/Dropdowns/UserDropdown";
import OrganizationProfileModal from "../../../views/Organization/OrganizationDetails/Models/OrganizationProfileModal";
import toast from "react-hot-toast";
import Tooltip from "../../Common/Tooltip";
import { X, ChevronDown, ChevronRight } from 'lucide-react';

export default function OrganizationSidebar({ sidebarExpanded, setSidebarExpanded }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { orgId, currentOrg } = useSelector((state) => state.organization.auth);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
    setActiveMenu(null);
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

  const handleLogout = () => {
    dispatch(logoutOrganization());
    toast.success("Logout Successfully");
    navigate("/");
  };

  const menuItems = {
    dashboard: [
      { to: "/organization/dashboard", icon: "fas fa-tachometer-alt", label: "Dashboard" },
    ],
    organization: [
      { to: "/organization/org-feedabacks", icon: "fa fa-check", label: "Organization Feedbacks" },
      { to: "/organization/org-complaints", icon: "fas fa-exclamation-circle", label: "Organization Complaints" },
    ],
    user: [
      { to: "/organization/userlist", icon: "fas fa-users", label: "User List" },
      { to: "/organization/users/feedbacks", icon: "fa fa-check", label: "User Feedbacks" },
    ],
  };

  const getSectionIcon = (section) => {
    const icons = {
      dashboard: "tachometer-alt",
      user: "user",
      organization: "building",
    };
    return icons[section] || "circle";
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setSidebarExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 bottom-0 z-30 w-64 bg-white shadow-xl transition-all duration-300 ease-in-out
        ${sidebarExpanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between w-full h-[73px] px-4 border-b border-gray-200">
            {sidebarExpanded ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-semibold">{currentOrg?.name || "Organization"}</span>
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

          {/* Navigation */}
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
                      <i className={`fas fa-${getSectionIcon(section)} ${activeMenu === section ? "text-white" : "text-gray-500"}`}></i>
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

          {/* Footer */}
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
                    <div className="font-medium">{currentOrg?.name || "Organization"}</div>
                    <div className="text-sm text-gray-500">Administrator</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Profile Modal */}
      <OrganizationProfileModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialValues={currentOrg || {}}
        refreshData={() => {
          if (orgId) {
            dispatch(fetchOrgById(orgId));
          }
        }}
      />
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


