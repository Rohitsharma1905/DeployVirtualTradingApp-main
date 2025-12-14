// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import CardSettings from "../Cards/CardSettings";
// import logoImage from "../../../assets/img/PGR_logo.jpeg";
// import { fetchUserData } from "../../../redux/User/userprofileSlice";
// import ChangePasswordModal from "../Cards/ChangePasswordModal";
// import { useDispatch, useSelector } from "react-redux";
// import { Trophy, X, ChevronDown, Menu } from 'lucide-react';
// import { 
//   clearActiveEvent, 
//   selectActiveEvent,
//   selectActiveEvents,
//   setActiveEvent
// } from "../../../redux/User/events/eventsSlice";
// import { toast } from 'react-hot-toast';
// import { Link } from "react-router-dom";

// export default function UserNavbar({ sidebarExpanded, setSidebarExpanded }) {
//   const dispatch = useDispatch();
//   const { userData } = useSelector((state) => state.user.profile);
//   const activeEvent = useSelector(selectActiveEvent);
//   const events = useSelector(selectActiveEvents);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);
//   const eventDropdownRef = useRef(null);

//   useEffect(() => {
//     dispatch(fetchUserData());
//   }, [dispatch]);

//   const userName = userData ? userData.name : "User";
//   const userPhoto = userData?.userPhoto || "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png";

//   const handleProfile = () => {
//     setIsProfileModalOpen(true);
//     setIsDropdownOpen(false);
//   };

//   const handleChangePassword = () => {
//     setIsChangePasswordModalOpen(true);
//     setIsDropdownOpen(false);
//   };

//   const handleClearActiveEvent = () => {
//     dispatch(clearActiveEvent());
//     toast.success('Event deactivated');
//   };

//   const handleEventSelect = (event) => {
//     dispatch(setActiveEvent(event));
//     setIsEventDropdownOpen(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//       if (eventDropdownRef.current && !eventDropdownRef.current.contains(event.target)) {
//         setIsEventDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
// <nav className={`sticky top-0 w-full h-auto min-h-[73px] z-20 bg-white shadow-lg transition-all duration-300 ease-in-out ${
//   sidebarExpanded ? "lg:pl-64" : "lg:pl-16"
// }`}>
//       <div className="w-full mx-auto flex flex-wrap items-center justify-between px-4 py-3 md:px-10">
//         {/* Logo and Brand */}
//           <button 
//             className="lg:hidden p-2 mr-2 rounded-lg hover:bg-gray-100"
//             onClick={() => setSidebarExpanded(!sidebarExpanded)}
//           >
//             <Menu className="h-6 w-6" /> 
//           </button>
//         <Link className="flex items-start md:items-center"  to="/">

//           <img 
//             src={logoImage} 
//             alt="PGR Logo" 
//             className="h-10 w-10 object-contain rounded-full"
//           />
//           <span className="hidden lg:block text-xl ml-4 font-bold">PGR - Virtual Trading App</span>
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="flex items-center space-x-4">
       
              
//           {/* Event Selection - Desktop */}
//           {events && events.length > 0 && (
//             <div className="relative hidden md:block" ref={eventDropdownRef}>
//               <div className="flex items-center space-x-2">
//                 {activeEvent && (
//                   <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-800 shadow-sm">
//                     <Trophy className="w-4 h-4 mr-1 flex-shrink-0" />
//                     <span className="truncate max-w-[120px]">{activeEvent.title}</span>
//                     <button 
//                       onClick={handleClearActiveEvent}
//                       className="ml-1 p-0.5 rounded-full hover:bg-blue-100 transition-colors"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </div>
//                 )}
                
//                 <button
//                   onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
//                   className="flex items-center space-x-1 bg-white px-3 py-2 rounded-lg shadow border border-gray-200 hover:bg-gray-50 transition-colors"
//                 >
//                   <span>{activeEvent ? 'Change Event' : 'Select Event'}</span>
//                   <ChevronDown className={`w-4 h-4 transition-transform ${isEventDropdownOpen ? 'transform rotate-180' : ''}`}/>
//                 </button>
//               </div>
              
//               {isEventDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200 max-h-60 overflow-y-auto">
//                   {events.map(event => (
//                     <button
//                       key={event._id}
//                       onClick={() => handleEventSelect(event)}
//                       className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
//                         activeEvent?._id === event._id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
//                       }`}
//                     >
//                       {event.title}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//           < div className="bg-lightBlue-600 text-white px-4 py-1 rounded-lg hover:bg-lightBlue-400 hover:text-gray-100 transition-all">
//                 <p className="text-lg">{userName}</p>
//               </div>

//           {/* User Profile Dropdown */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center space-x-2"
//             >
//               <img
//                 src={userPhoto}
//                 alt="Profile"
//                 className="h-10 w-10 rounded-full object-cover cursor-pointer border-2 border-gray-200 hover:border-blue-400 transition-all"
//               />
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
//                 <div className="py-1">
//                   <button onClick={handleProfile} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</button>
//                   <button onClick={handleChangePassword} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Change Password</button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {isProfileModalOpen && (
//         <CardSettings 
//           isOpen={isProfileModalOpen} 
//           onClose={() => setIsProfileModalOpen(false)} 
//         />
//       )}
//       {isChangePasswordModalOpen && (
//         <ChangePasswordModal 
//           isOpen={isChangePasswordModalOpen} 
//           onClose={() => setIsChangePasswordModalOpen(false)} 
//         />
//       )}
//     </nav>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CardSettings from "../Cards/CardSettings";
import logoImage from "../../../assets/img/PGR_logo.jpeg";
import { fetchUserData } from "../../../redux/User/userprofileSlice";
import ChangePasswordModal from "../Cards/ChangePasswordModal";
import { useDispatch, useSelector } from "react-redux";
import { Trophy, X, ChevronDown, Menu } from 'lucide-react';
import { 
  clearActiveEvent, 
  selectActiveEvent,
  selectActiveEvents,
  setActiveEvent
} from "../../../redux/User/events/eventsSlice";
import { toast } from 'react-hot-toast';
import { Link } from "react-router-dom";

export default function UserNavbar({ sidebarExpanded, setSidebarExpanded }) {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user.profile); 
  const activeEvent = useSelector(selectActiveEvent);
  const events = useSelector(selectActiveEvents);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const eventDropdownRef = useRef(null);

  useEffect(() => {
    if (!userData) {
        dispatch(fetchUserData());
    }
  }, [dispatch, userData]);

  const userName = userData && userData.name ? userData.name : "User";
  const userPhoto = userData?.userPhoto || "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png";

  const handleProfile = () => {
    setIsProfileModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleClearActiveEvent = () => {
    dispatch(clearActiveEvent());
    toast.success('Event deactivated');
  };

  const handleEventSelect = (event) => {
    dispatch(setActiveEvent(event));
    setIsEventDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (eventDropdownRef.current && !eventDropdownRef.current.contains(event.target)) {
        setIsEventDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`sticky top-0 w-full h-auto min-h-[73px] z-35 bg-white shadow-lg transition-all duration-300 ease-in-out ${
      // This padding makes space FOR THE SIDEBAR ITSELF on large screens.
      // The navbar's content will start AFTER this padding.
      sidebarExpanded ? "" : "" 
    }`}>
      <div className="w-full mx-auto flex flex-wrap items-center justify-between px-3 py-3">
        {/* Left side: Toggle Button + Logo/Brand */}
        {/* The toggle button IS the first element in this div, so it will be at the start of the navbar's content area */}
        <div className="flex items-center "> 
          {/* Sidebar Toggle Button */}
          <button
            className="p-2 mr-3 rounded-lg hover:bg-gray-100 text-gray-700 focus:outline-none"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {/* Icon logic for toggle */}
            {sidebarExpanded && window.innerWidth < 1024 ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo and Brand Name */}
          <Link className="flex items-center" to="/">
            <img 
              src={logoImage} 
              alt="PGR Logo" 
              className="h-10 w-10 object-contain rounded-full"
            />
            <span className="hidden lg:block text-xl ml-3 font-bold">PGR - Virtual Trading App</span>
          </Link>
        </div>

        {/* Right side: Event Selection, User Name Pill, Profile Dropdown */}
        {/* ... (rest of the navbar content is fine) ... */}
        <div className="flex items-center space-x-4">
          {events && events.length > 0 && (
            <div className="relative hidden md:block" ref={eventDropdownRef}>
              <div className="flex items-center space-x-2">
                {activeEvent && (
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-800 shadow-sm">
                    <Trophy className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate max-w-[120px]">{activeEvent.title}</span>
                    <button 
                      onClick={handleClearActiveEvent}
                      className="ml-1 p-0.5 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                  className="flex items-center space-x-1 bg-white px-3 py-2 rounded-lg shadow border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <span>{activeEvent ? 'Change Event' : 'Select Event'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isEventDropdownOpen ? 'transform rotate-180' : ''}`}/>
                </button>
              </div>
              {isEventDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200 max-h-60 overflow-y-auto">
                  {events.map(event => (
                    <button
                      key={event._id}
                      onClick={() => handleEventSelect(event)}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
                        activeEvent?._id === event._id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      {event.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="bg-lightBlue-600 text-white px-4 py-1 rounded-lg hover:bg-lightBlue-400 hover:text-gray-100 transition-all">
            <p className="text-lg">{userName}</p>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2"
            >
              <img
                src={userPhoto}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover cursor-pointer border-2 border-gray-200 hover:border-blue-400 transition-all"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                <div className="py-1">
                  <button onClick={handleProfile} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</button>
                  <button onClick={handleChangePassword} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Change Password</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isProfileModalOpen && (
        <CardSettings 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
      )}
      {isChangePasswordModalOpen && (
        <ChangePasswordModal 
          isOpen={isChangePasswordModalOpen} 
          onClose={() => setIsChangePasswordModalOpen(false)} 
        />
      )}
    </nav>
  );
}