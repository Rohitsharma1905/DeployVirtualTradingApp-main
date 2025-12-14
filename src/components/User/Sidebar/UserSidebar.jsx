// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { fetchUserData } from "../../../redux/User/userprofileSlice";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import { X, ChevronDown, ChevronRight } from 'lucide-react';
// import { logout } from '../../../redux/User/authSlice'; //

// export default function UserSidebar({ sidebarExpanded, setSidebarExpanded }) {
  
//   const [activeMenu, setActiveMenu] = React.useState(null);
//   const dispatch = useDispatch();
//   const { userData } = useSelector((state) => state.user.profile);
//   const location = useLocation();
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     dispatch(fetchUserData());
//   }, [dispatch]);
  
//   const userName = userData ? userData.name : "User";
  

  
//   const handleSidebarToggle = () => {
//     setSidebarExpanded(!sidebarExpanded);
//     setActiveMenu(null);
//   };

//   // const handleLogout = () => {
//   //   localStorage.removeItem("token");
//   //   localStorage.removeItem("user");
//   //   toast.success("Logout Successfully");
//   //   navigate("/");
//   // };

//   const handleLogout = () => {
//     // Dispatch the main user logout action
//     dispatch(logout()); // <--- DISPATCH THIS

//     // The logout action should handle removing localStorage items.
//     // localStorage.removeItem("token");
//     // localStorage.removeItem("user");

//     toast.success("Logout Successfully");
//     navigate("/");
//   };


//   const toggleMenu = (menuName) => {
//     if (!sidebarExpanded) {
//       setSidebarExpanded(true);
//     }
//     setActiveMenu(activeMenu === menuName ? null : menuName);
//   };

//   // Function to handle menu item clicks
//   const handleMenuItemClick = () => {
//     // Close sidebar in both mobile and desktop views when clicking sub-menu items
//     setSidebarExpanded(false);
//   };

//   return (
//     <>
//       {sidebarExpanded && (
//         <div 
//           className="fixed inset-0 bg-black/50 lg:hidden z-20"
//           onClick={() => setSidebarExpanded(false)}
//         />
//       )}

//       <div
//         className={`fixed top-0 left-0 bottom-0 z-30 w-64 bg-white shadow-xl transition-all duration-300 ease-in-out 
//           ${sidebarExpanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"}`}
//       >
//         <div className="flex flex-col h-full">
//           <div className="flex items-center justify-between w-full h-[73px] px-4 border-b border-gray-200">
//             {sidebarExpanded ? (
//               <div className="flex items-center justify-between w-full">
//                 <Link
//                   to="/user/dashboard"
//                   className="text-lg font-semibold capitalize truncate"
//                 >
//                   {userName}
//                 </Link>
//                 <button
//                   onClick={() => setSidebarExpanded(false)}
//                   className="p-1 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none"
//                 >
//                   <X className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>
//             ) : (
//               <div className="w-full flex justify-center">
//                 <button
//                   onClick={() => setSidebarExpanded(true)}
//                   className="p-1 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none"
//                 >
//                   <i className="fas fa-bars text-gray-600"></i>
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className={`flex-1 overflow-y-auto ${sidebarExpanded ? "px-1" : "px-0"}`}>
//             <SidebarSection
//               name="dashboard"
//               icon="fas fa-tachometer-alt"
//               label="Dashboard"
//               activeMenu={activeMenu}
//               toggleMenu={toggleMenu}
//               sidebarExpanded={sidebarExpanded}
//               onItemClick={handleMenuItemClick}
//             >
//               <MenuLink 
//                 to="/user/dashboard" 
//                 icon="fas fa-tachometer-alt" 
//                 label="Dashboard" 
//                 isActive={location.pathname === "/user/dashboard"} 
//                 sidebarExpanded={sidebarExpanded}
//                 onClick={handleMenuItemClick}
//               />
//             </SidebarSection>

//             <SidebarSection
//               name="tables"
//               icon="fas fa-table"
//               label="Stocks"
//               activeMenu={activeMenu}
//               toggleMenu={toggleMenu}
//               sidebarExpanded={sidebarExpanded}
//               onItemClick={handleMenuItemClick}
//             >
//               <MenuLink 
//                 to="/user/niftytable" 
//                 icon="fas fa-chart-line" 
//                 label="Nifty 50" 
//                 isActive={location.pathname === "/user/niftytable"} 
//                 sidebarExpanded={sidebarExpanded}
//                 onClick={handleMenuItemClick}
//               />
//               <MenuLink 
//                 to="/user/etftable" 
//                 icon="fas fa-table" 
//                 label="ETF" 
//                 isActive={location.pathname === "/user/etftable"} 
//                 sidebarExpanded={sidebarExpanded}
//                 onClick={handleMenuItemClick}
//               />
//               <MenuLink 
//                 to="/user/nifty500table" 
//                 icon="fas fa-chart-bar" 
//                 label="Nifty 500" 
//                 isActive={location.pathname === "/user/nifty500table"} 
//                 sidebarExpanded={sidebarExpanded}
//                 onClick={handleMenuItemClick}
//               />
//             </SidebarSection>

//             <SidebarSection
//               name="portfolio"
//               icon="fas fa-briefcase"
//               label="My Portfolio"
//               activeMenu={activeMenu}
//               toggleMenu={toggleMenu}
//               sidebarExpanded={sidebarExpanded}
//               onItemClick={handleMenuItemClick}
//             >
//               <MenuLink 
//                 to="/user/tradingnifty" 
//                 icon="fas fa-exchange-alt" 
//                 label="Trading" 
//                 isActive={location.pathname === "/user/tradingnifty"} 
//                 sidebarExpanded={sidebarExpanded}
//                 onClick={handleMenuItemClick}
//               />
//             </SidebarSection>
            
//             <SidebarSection
//               name="certificates"
//               icon="fas fa-certificate"
//               label="Certificates"
//               activeMenu={activeMenu}
//               toggleMenu={toggleMenu}
//               sidebarExpanded={sidebarExpanded}
//               onItemClick={handleMenuItemClick}
//             >
//               <MenuLink 
//                 to="/user/my-certificates" 
//                 icon="fas fa-certificate" 
//                 label="My Certificates" 
//                 isActive={location.pathname === "/user/my-certificates"} 
//                 sidebarExpanded={sidebarExpanded}
//                 onClick={handleMenuItemClick}
//               />
//             </SidebarSection>

//             <SidebarSection
//               name="feedback"
//               icon="fas fa-comment"
//               label="Feedback"
//               activeMenu={activeMenu}
//               toggleMenu={toggleMenu}
//               sidebarExpanded={sidebarExpanded}
//               onItemClick={handleMenuItemClick}
//             >
//               <MenuLink 
//                 to="/user/feedback" 
//                 icon="fas fa-comment-dots" 
//                 label="Submit Feedback" 
//                 isActive={location.pathname === "/user/feedback"} 
//                 sidebarExpanded={sidebarExpanded}
//                 onClick={handleMenuItemClick}
//               />
//             </SidebarSection>

//             <SidebarSection
//               name="complaint"
//               icon="fas fa-exclamation-circle"
//               label="Complaint"
//               activeMenu={activeMenu}
//               toggleMenu={toggleMenu}
//               sidebarExpanded={sidebarExpanded}
//               onItemClick={handleMenuItemClick}
//             >
//               <MenuLink 
//                 to="/user/complaint" 
//                 icon="fas fa-exclamation-triangle" 
//                 label="Submit Complaint" 
//                 isActive={location.pathname === "/user/complaint"} 
//                 sidebarExpanded={sidebarExpanded}
//                 onClick={handleMenuItemClick}
//               />
//             </SidebarSection>

//             <SidebarSection
//               name="events"
//               icon="fas fa-calendar-alt"
//               label="Events"
//               activeMenu={activeMenu}
//               toggleMenu={toggleMenu}
//               sidebarExpanded={sidebarExpanded}
//               onItemClick={handleMenuItemClick}
//             >
//               <MenuLink 
//                 to="/user/eventspage" 
//                 icon="fas fa-calendar-check" 
//                 label="View Events" 
//                 isActive={location.pathname === "/user/eventspage"} 
//                 sidebarExpanded={sidebarExpanded}
//                 onClick={handleMenuItemClick}
//               />
//               <MenuLink 
//                 to="/user/my-events" 
//                 icon="fas fa-calendar-minus" 
//                 label="My Events" 
//                 isActive={location.pathname === "/user/my-events"} 
//                 sidebarExpanded={sidebarExpanded}
//                 onClick={handleMenuItemClick}
//               />
//             </SidebarSection>
//           </div>

//           <div className="mt-auto">
//             <div className="p-4">
//               <button 
//                 onClick={() => {
//                   handleLogout();
//                   handleMenuItemClick();
//                 }}
//                 className={`w-full flex items-center justify-center text-red-500 hover:text-red-700 transition-colors rounded-lg p-3
//                   ${sidebarExpanded ? "bg-red-50 hover:bg-red-100 space-x-2" : "hover:bg-red-50"}`}
//                 title={!sidebarExpanded ? "Logout" : ""}
//               >
//                 <i className="fas fa-sign-out-alt"></i>
//                 {sidebarExpanded && <span>Logout</span>}
//               </button>
//             </div>

//             <div className={`border-t bg-gray-50 p-4 flex items-center ${sidebarExpanded ? "justify-between" : "justify-center"}`}>
//               <div className="flex items-center space-x-4">
//                 <div className="relative">
//                   <div className="w-12 h-12 rounded-xl bg-lightBlue-600 flex items-center justify-center shadow-lg">
//                     <i className="fas fa-user text-white"></i>
//                   </div>
//                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                 </div>
//                 {sidebarExpanded && (
//                   <div>
//                     <div className="font-medium truncate">{userName}</div>
//                     <div className="text-sm text-gray-500">User</div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// const SidebarSection = ({ name, icon, label, activeMenu, toggleMenu, sidebarExpanded, children, onItemClick }) => {
//   const handleClick = () => {
//     toggleMenu(name);
//   };

//   return (
//     <div className="space-y-1">
//       <button
//         onClick={handleClick}
//         className={`w-full flex items-center ${sidebarExpanded ? "justify-between p-2" : "justify-center p-3"} rounded-lg transition-all duration-200 
//           ${activeMenu === name ? "bg-lightBlue-600 text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"}`}
//         title={!sidebarExpanded ? label : ""}
//       >
//         <div className="flex items-center space-x-2">
//           <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 
//             ${activeMenu === name ? "bg-white/20" : "bg-lightBlue-100 hover:bg-gray-200"}`}>
//             <i className={`${icon} ${activeMenu === name ? "text-white" : "text-gray-500"}`}></i>
//           </div>
//           {sidebarExpanded && <span className="font-medium">{label}</span>}
//         </div>
//         {sidebarExpanded && (
//           activeMenu === name ? (
//             <ChevronDown className="w-4 h-4 transition-transform duration-200" />
//           ) : (
//             <ChevronRight className="w-4 h-4 transition-transform duration-200" />
//           )
//         )}
//       </button>
//       {sidebarExpanded && activeMenu === name && (
//         <div className="pl-4 space-y-1">
//           {React.Children.map(children, child => 
//             React.cloneElement(child, { onClick: onItemClick })
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const MenuLink = ({ to, icon, label, isActive, sidebarExpanded, onClick }) => {
//   return (
//     <Link
//       to={to}
//       onClick={onClick}
//       className={`flex items-center ${sidebarExpanded ? "space-x-3 px-4 py-2" : "justify-center p-3"} rounded-lg transition-all duration-200 
//         ${isActive ? "bg-blue-50 text-lightBlue-600" : "text-gray-600 hover:bg-gray-100"}`}
//       title={!sidebarExpanded ? label : ""}
//     >
//       <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
//         isActive ? "bg-blue-100" : "bg-gray-100"
//       }`}>
//         <i className={`${icon} ${isActive ? "text-lightBlue-600" : "text-gray-500"}`}></i>
//       </div>
//       {sidebarExpanded && <span className="text-sm font-medium">{label}</span>}
//     </Link>
//   );
// };


import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchUserData } from "../../../redux/User/userprofileSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { X, ChevronDown, ChevronRight, User as UserIconLucide } from 'lucide-react'; // Import User icon from Lucide
import { logout } from '../../../redux/User/authSlice';

export default function UserSidebar({ sidebarExpanded, setSidebarExpanded }) {
  const [activeMenu, setActiveMenu] = React.useState(null);
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user.profile);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const userName = userData && userData.name ? userData.name : "User";
  const userPhoto = userData?.userPhoto || null;


  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout Successfully");
    navigate("/");
  };

  const toggleMenu = (menuName) => {
    if (!sidebarExpanded) {
      setSidebarExpanded(true);
    }
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuItemClick = () => {
    if (window.innerWidth < 1024) {
        setSidebarExpanded(false);
    }
  };

  const navbarHeight = "73px"; 

  return (
    <>
      {sidebarExpanded && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setSidebarExpanded(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 bottom-0 z-30 w-64 bg-white shadow-xl transition-all duration-300 ease-in-out
          ${sidebarExpanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"}`}
        style={{ paddingTop: navbarHeight }} 
      >
        <div className="flex flex-col h-full"> 
          {/* Sidebar Header - MODIFIED */}
          <div className={`flex items-center w-full h-[73px] border-b border-gray-200 
                           ${sidebarExpanded ? "justify-between px-4" : "justify-center px-0"}`}> {/* Adjusted padding for collapsed */}
            {sidebarExpanded ? (
              // WHEN SIDEBAR IS EXPANDED
              <>
                <Link
                  to="/user/dashboard" // Or link to a profile page
                  className="text-lg font-semibold capitalize truncate hover:text-lightBlue-600"
                  title={userName} // Add title for potential truncation
                >
                  {userName}
                </Link>
                <button
                  onClick={() => setSidebarExpanded(false)}
                  className="p-1 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </>
            ) : (
              // WHEN SIDEBAR IS COLLAPSED (lg:w-16)
              // Display a user icon
              <Link
                to="/user/dashboard" // Or link to a profile page if clickable
                className="p-3 flex items-center justify-center w-full h-full rounded-lg hover:bg-gray-100 transition-colors"
                title={userName} // Tooltip with the username
              >
                {/* Using Font Awesome as an example, ensure it's set up */}
                <i className="fas fa-user text-xl text-gray-600"></i>
                {/* Or use Lucide Icon: */}
                {/* <UserIconLucide className="w-6 h-6 text-gray-600" /> */}
              </Link>
            )}
          </div>

          {/* Sidebar Navigation Content */}
          <div className={`flex-1 overflow-y-auto ${sidebarExpanded ? "px-1" : "px-0"}`}>
            {/* ... Your SidebarSection and MenuLink components ... */}
            <SidebarSection
              name="dashboard"
              icon="fas fa-tachometer-alt"
              label="Dashboard"
              activeMenu={activeMenu}
              toggleMenu={toggleMenu}
              sidebarExpanded={sidebarExpanded}
              onItemClick={handleMenuItemClick}
            >
              <MenuLink 
                to="/user/dashboard" 
                icon="fas fa-tachometer-alt" 
                label="Dashboard" 
                isActive={location.pathname === "/user/dashboard"} 
                sidebarExpanded={sidebarExpanded}
                onClick={handleMenuItemClick}
              />
            </SidebarSection>

            <SidebarSection
              name="tables"
              icon="fas fa-table"
              label="Stocks"
              activeMenu={activeMenu}
              toggleMenu={toggleMenu}
              sidebarExpanded={sidebarExpanded}
              onItemClick={handleMenuItemClick}
            >
              <MenuLink 
                to="/user/niftytable" 
                icon="fas fa-chart-line" 
                label="Nifty 50" 
                isActive={location.pathname === "/user/niftytable"} 
                sidebarExpanded={sidebarExpanded}
                onClick={handleMenuItemClick}
              />
              <MenuLink 
                to="/user/etftable" 
                icon="fas fa-table" 
                label="ETF" 
                isActive={location.pathname === "/user/etftable"} 
                sidebarExpanded={sidebarExpanded}
                onClick={handleMenuItemClick}
              />
              <MenuLink 
                to="/user/nifty500table" 
                icon="fas fa-chart-bar" 
                label="Nifty 500" 
                isActive={location.pathname === "/user/nifty500table"} 
                sidebarExpanded={sidebarExpanded}
                onClick={handleMenuItemClick}
              />
            </SidebarSection>

            <SidebarSection
              name="portfolio"
              icon="fas fa-briefcase"
              label="My Portfolio"
              activeMenu={activeMenu}
              toggleMenu={toggleMenu}
              sidebarExpanded={sidebarExpanded}
              onItemClick={handleMenuItemClick}
            >
              <MenuLink 
                to="/user/tradingnifty" 
                icon="fas fa-exchange-alt" 
                label="Trading" 
                isActive={location.pathname === "/user/tradingnifty"} 
                sidebarExpanded={sidebarExpanded}
                onClick={handleMenuItemClick}
              />
            </SidebarSection>
            
            <SidebarSection
              name="certificates"
              icon="fas fa-certificate"
              label="Certificates"
              activeMenu={activeMenu}
              toggleMenu={toggleMenu}
              sidebarExpanded={sidebarExpanded}
              onItemClick={handleMenuItemClick}
            >
              <MenuLink 
                to="/user/my-certificates" 
                icon="fas fa-certificate" 
                label="My Certificates" 
                isActive={location.pathname === "/user/my-certificates"} 
                sidebarExpanded={sidebarExpanded}
                onClick={handleMenuItemClick}
              />
            </SidebarSection>

            <SidebarSection
              name="feedback"
              icon="fas fa-comment"
              label="Feedback"
              activeMenu={activeMenu}
              toggleMenu={toggleMenu}
              sidebarExpanded={sidebarExpanded}
              onItemClick={handleMenuItemClick}
            >
              <MenuLink 
                to="/user/feedback" 
                icon="fas fa-comment-dots" 
                label="Submit Feedback" 
                isActive={location.pathname === "/user/feedback"} 
                sidebarExpanded={sidebarExpanded}
                onClick={handleMenuItemClick}
              />
            </SidebarSection>

            <SidebarSection
              name="complaint"
              icon="fas fa-exclamation-circle"
              label="Complaint"
              activeMenu={activeMenu}
              toggleMenu={toggleMenu}
              sidebarExpanded={sidebarExpanded}
              onItemClick={handleMenuItemClick}
            >
              <MenuLink 
                to="/user/complaint" 
                icon="fas fa-exclamation-triangle" 
                label="Submit Complaint" 
                isActive={location.pathname === "/user/complaint"} 
                sidebarExpanded={sidebarExpanded}
                onClick={handleMenuItemClick}
              />
            </SidebarSection>

            <SidebarSection
              name="events"
              icon="fas fa-calendar-alt"
              label="Events"
              activeMenu={activeMenu}
              toggleMenu={toggleMenu}
              sidebarExpanded={sidebarExpanded}
              onItemClick={handleMenuItemClick}
            >
              <MenuLink 
                to="/user/eventspage" 
                icon="fas fa-calendar-check" 
                label="View Events" 
                isActive={location.pathname === "/user/eventspage"} 
                sidebarExpanded={sidebarExpanded}
                onClick={handleMenuItemClick}
              />
              <MenuLink 
                to="/user/my-events" 
                icon="fas fa-calendar-minus" 
                label="My Events" 
                isActive={location.pathname === "/user/my-events"} 
                sidebarExpanded={sidebarExpanded}
                onClick={handleMenuItemClick}
              />
            </SidebarSection>
          </div>

          {/* Sidebar Footer */}
          <div className="mt-auto">
            <div className="p-4">
              <button
                onClick={() => {
                  handleLogout();
                  handleMenuItemClick();
                }}
                className={`w-full flex items-center justify-center text-red-500 hover:text-red-700 transition-colors rounded-lg p-3
                  ${sidebarExpanded ? "bg-red-50 hover:bg-red-100 space-x-2" : "hover:bg-red-50"}`}
                title={!sidebarExpanded ? "Logout" : ""}
              >
                <i className="fas fa-sign-out-alt"></i>
                {sidebarExpanded && <span>Logout</span>}
              </button>
            </div>

            <div className={`border-t bg-gray-50 p-3 flex items-center ${sidebarExpanded ? "justify-between" : "justify-center"}`}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt="User"
                      className={`rounded-full object-cover ${sidebarExpanded ? "w-12 h-12" : "w-8 h-8"}`}
                    />
                  ) : (
                    <div className={`rounded-full bg-lightBlue-600 flex items-center justify-center text-white ${sidebarExpanded ? "w-12 h-12 text-xl" : "w-8 h-8 text-base"}`}>
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                  {!sidebarExpanded && (
                     <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                  )}
                   {sidebarExpanded && (
                     <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                   )}
                </div>
                {sidebarExpanded && (
                  <div>
                    <div className="font-medium truncate">{userName}</div>
                    <div className="text-sm text-gray-500">User</div>
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

// SidebarSection and MenuLink components remain the same
const SidebarSection = ({ name, icon, label, activeMenu, toggleMenu, sidebarExpanded, children, onItemClick }) => {
  const handleClick = () => {
    toggleMenu(name);
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleClick}
        className={`w-full flex items-center ${sidebarExpanded ? "justify-between p-2" : "justify-center p-3"} rounded-lg transition-all duration-200 
          ${activeMenu === name ? "bg-lightBlue-600 text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"}`}
        title={!sidebarExpanded ? label : ""}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 
            ${activeMenu === name ? "bg-white/20" : "bg-lightBlue-100 hover:bg-gray-200"}`}>
            <i className={`${icon} ${activeMenu === name ? "text-white" : "text-gray-500"}`}></i>
          </div>
          {sidebarExpanded && <span className="font-medium">{label}</span>}
        </div>
        {sidebarExpanded && (
          activeMenu === name ? (
            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
          ) : (
            <ChevronRight className="w-4 h-4 transition-transform duration-200" />
          )
        )}
      </button>
      {sidebarExpanded && activeMenu === name && (
        <div className="pl-4 space-y-1">
          {React.Children.map(children, child => 
            React.cloneElement(child, { onClick: onItemClick })
          )}
        </div>
      )}
    </div>
  );
};

const MenuLink = ({ to, icon, label, isActive, sidebarExpanded, onClick }) => {
  return (
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
};