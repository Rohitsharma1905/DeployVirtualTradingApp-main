import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

// Components
import DashboardFooter from "../components/User/Footers/DashboardFooter";
import UserNavbar from "../components/User/Navbars/UserNavbar";
import UserSidebar from "../components/User/Sidebar/UserSidebar";
// import SessionExpiredModal from "../components/Organization/Session/SessionExpiredModal";

// Views
import Dashboard from "../views/user/userDashboard";
import Profile from "../views/user/Profile";
import EtfTable from "../views/user/etfTable";
import NiftyTable from "../views/user/niftyTable";
import Nifty500Table from "../views/user/nifty500table";
import FeedbackTable from "../views/user/feedbacktable";
import ComplaintTable from "../views/user/complainttable";
import TradingNifty from "../views/user/tradingnifty";
import EventsPage from "../views/user/eventsPage";
import MyEventsPage from "../views/user/MyEventsPage";
// import MyCertifications from "views/user/MyCertifications";
import MyCertifications from "../views/user/MyCertifications";

// Redux Actions
import { logout } from "../redux/User/authSlice";
import ProtectedRoute from "../components/Organization/ProtectedRoutes/ProtectedRoute";

export default function User() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const userData = useSelector((state) => state.user.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Close sidebar when screen size changes to mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarExpanded(false);
      } //else {
      //   setSidebarExpanded(true);
      // }
    };

    // Set initial state based on screen size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   const handleSessionExpired = () => {
  //     setShowSessionExpiredModal(true);
  //   };

  //   window.addEventListener("show-session-expired-modal", handleSessionExpired);
  //   return () => {
  //     window.removeEventListener("show-session-expired-modal", handleSessionExpired);
  //   };
  // }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Login Again");
    navigate("/");
  };

  return (
    <>
      <UserSidebar
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
      />

      
      <div className="relative flex flex-col min-h-screen">
        <UserNavbar 
          sidebarExpanded={sidebarExpanded} 
          setSidebarExpanded={setSidebarExpanded} 
        />
        
        <div
          className={`flex-grow transition-all duration-300 ease-in-out ${
            sidebarExpanded ? "lg:ml-64" : "lg:ml-20"
          }`}
        >
          <div className="mx-auto w-full pb-16">
            <Routes>
              <Route element={<ProtectedRoute  allowedRoles={['user']}/>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="niftytable" element={<NiftyTable />} />
              <Route path="nifty500table" element={<Nifty500Table />} />
              <Route path="etftable" element={<EtfTable />} />
              <Route path="profile" element={<Profile />} />
              <Route path="my-certificates" element={<MyCertifications />} />
              <Route path="feedback" element={<FeedbackTable />} />
              <Route path="complaint" element={<ComplaintTable />} />
              <Route path="tradingnifty" element={<TradingNifty />} />
              <Route path="eventspage" element={<EventsPage />} />
              <Route path="my-events" element={<MyEventsPage />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Route>
            </Routes>

          </div>
        </div>
        
        <DashboardFooter />
      </div>

      {/* <SessionExpiredModal
        show={showSessionExpiredModal}
        onHide={() => {
          setShowSessionExpiredModal(false);
          handleLogout();
        }}
      /> */}
    </>
  );
}


// src/layouts/User.js
// import React, { useEffect, useState } from "react";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import toast from "react-hot-toast";

// // Components
// import DashboardFooter from "../components/User/Footers/DashboardFooter";
// import UserNavbar from "../components/User/Navbars/UserNavbar";
// import UserSidebar from "../components/User/Sidebar/UserSidebar";
// import SessionExpiredModal from "../components/Organization/Session/SessionExpiredModal"; // Reusable modal
// import ProtectedRoute from "../components/Organization/ProtectedRoutes/ProtectedRoute"; // <-- Import the modified component

// // Views
// import Dashboard from "../views/user/userDashboard";
// import Profile from "../views/user/Profile";
// import EtfTable from "../views/user/etfTable";
// import NiftyTable from "../views/user/niftyTable";
// import Nifty500Table from "../views/user/nifty500table";
// import FeedbackTable from "../views/user/feedbacktable";
// import ComplaintTable from "../views/user/complainttable";
// import TradingNifty from "../views/user/tradingnifty";
// import EventsPage from "../views/user/eventsPage";
// import MyEventsPage from "../views/user/MyEventsPage";
// import MyCertifications from "../views/user/MyCertifications";

// // Redux Actions
// import { logout } from "../redux/User/authSlice";

// // --- Constants ---
// const USER_TOKEN_KEY = localStorage.getItem("token"); // CHANGE if your user token key is different
// const USER_LOGIN_PATH = "/user/dashboard";   // CHANGE if your user login path is different

// export default function User() {
//   const [sidebarExpanded, setSidebarExpanded] = useState(false);
//   const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
//   // Removed userData selector as it wasn't directly used for auth check here
//   // const userData = useSelector((state) => state.user.auth.user);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Close sidebar when screen size changes to mobile
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 1024) {
//         setSidebarExpanded(false);
//       }
//     };
//     handleResize(); // Initial check
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Session Expiry Handling
//   useEffect(() => {
//     const handleSessionExpired = (event) => {
//        // Optional: Check if the event is meant for this specific user type
//        // if (event.detail?.userType === 'user') {
//         setShowSessionExpiredModal(true);
//        // }
//     };
//      // Consider making the event name more specific if needed, e.g., 'show-user-session-expired-modal'
//     window.addEventListener("show-session-expired-modal", handleSessionExpired);
//     return () => {
//       window.removeEventListener("show-session-expired-modal", handleSessionExpired);
//     };
//   }, []);

//   // Logout Handler
//   const handleLogout = () => {
//     dispatch(logout()); // This should also clear the userToken from localStorage via the slice/reducer
//     localStorage.removeItem(USER_TOKEN_KEY); // Explicitly remove token on logout
//     toast.success("Session expired. Please Login Again");
//     // navigate(USER_LOGIN_PATH);
//     setShowSessionExpiredModal(false); // Close modal
//   };

//    // Check authentication status on component mount
//   const isAuthenticated = !!localStorage.getItem(USER_TOKEN_KEY);
//   // useEffect(() => {
//   //   if (!isAuthenticated) {
//       // Optional immediate redirect
//   //     // navigate(USER_LOGIN_PATH, { replace: true });
//   //   }
//   // }, [isAuthenticated, navigate]);

//   // if (!isAuthenticated) {
//   //    return <Navigate to={USER_LOGIN_PATH} replace />;
//   // }

//   return (
//     <>
//       {/* Render sidebar only if authenticated? Or always show it but disable links? */}
//       {/* Consider conditional rendering based on isAuthenticated if needed */}
//       <UserSidebar
//         sidebarExpanded={sidebarExpanded}
//         setSidebarExpanded={setSidebarExpanded}
//       />

//       <div className="relative flex flex-col min-h-screen bg-blueGray-100"> {/* Added bg color */}
//         <UserNavbar
//           sidebarExpanded={sidebarExpanded}
//           setSidebarExpanded={setSidebarExpanded}
//         />

//         <div
//           className={`flex-grow transition-all duration-300 ease-in-out ${
//             sidebarExpanded ? "lg:ml-64" : "lg:ml-20"
//           }`}
//         >
//           <div className="w-full pb-16"> {/* Added padding */}
//             <Routes>
//               {/* --- Protected User Routes --- */}
//                <Route element={<ProtectedRoute tokenKey={USER_TOKEN_KEY} loginPath={USER_LOGIN_PATH} login="/" />}>
//                   <Route path="dashboard" element={<Dashboard />} />
//                   <Route path="niftytable" element={<NiftyTable />} />
//                   <Route path="nifty500table" element={<Nifty500Table />} />
//                   <Route path="etftable" element={<EtfTable />} />
//                   <Route path="profile" element={<Profile />} />
//                   <Route path="my-certificates" element={<MyCertifications />} />
//                   <Route path="feedback" element={<FeedbackTable />} />
//                   <Route path="complaint" element={<ComplaintTable />} />
//                   <Route path="tradingnifty" element={<TradingNifty />} />
//                   <Route path="eventspage" element={<EventsPage />} />
//                   <Route path="my-events" element={<MyEventsPage />} />
//                   {/* Default route within protected area */}
//                   <Route path="/" element={<Navigate to="dashboard" replace />} />
//                   <Route path="*" element={<Navigate to="dashboard" replace />} />
//                </Route>

//                {/* --- Public Routes specific to User context (if any) --- */}
//                {/* Example: <Route path="verify-email" element={<UserVerifyEmail />} /> */}

//                {/* Catch-all for any user path not matched above */}
//                {/* This might conflict with the protected route catch-all, review needs */}
//                {/* <Route path="*" element={<Navigate to="dashboard" replace />} /> */}
//             </Routes>
//           </div>
//         </div>

//         <DashboardFooter />
//       </div>

//       <SessionExpiredModal
//         show={showSessionExpiredModal}
//         onHide={handleLogout} // Use handleLogout
//       />
//     </>
//   );
// }