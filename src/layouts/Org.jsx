import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import OrganizationNavbar from "../components/Organization/Navbars/OrganizationNavbar";
import OrganizationSidebar from "../components/Organization/Sidebars/OrganizationSidebar";
import OrganizationFooter from "../components/Organization/Footers/OrganizationFooter";
import OrganizationUsers from "../views/Organization/OrganizationUserDetails/OrganizationUsers";
import OrganizationDashboard from "../views/Organization/OrganizationDetails/OrganizationDashboard";
import Register from "../views/auth/Register";
import OrganizationUsersFeedback from "../views/Organization/OrganizationUserDetails/OrganizationUsersFeedback";
import OrganizationFeedback from "../views/Organization/OrganizationDetails/OrganizationFeedback";
import OrganizationComplaint from "../views/Organization/OrganizationDetails/OrganizationComplaint";
import ProtectedRoute from "../components/Organization/ProtectedRoutes/ProtectedRoute";
import ResetPasswordModal from "../views/auth/ResetPasswordModal";
// import SessionExpiredModal from "../components/Organization/Session/SessionExpiredModal";
import { logoutOrganization } from "../redux/Organization/auth/organizationAuthSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export default function Org() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const handleSessionExpired = () => {
  //     setShowSessionExpiredModal(true);
  //   };

  //   window.addEventListener('show-session-expired-modal', handleSessionExpired);
  //   return () => {
  //     window.removeEventListener('show-session-expired-modal', handleSessionExpired);
  //   };
  // }, []);

  const handleLogout = () => {
    dispatch(logoutOrganization());
    toast.success("Login Again");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-blueGray-100">
      <OrganizationSidebar 
        sidebarExpanded={sidebarExpanded} 
        setSidebarExpanded={setSidebarExpanded} 
      />
      
      <div className={`flex-1 flex flex-col ${
        sidebarExpanded ? "lg:ml-64" : "lg:ml-20"
      } transition-all duration-300 ease-in-out`}>
        <OrganizationNavbar 
          sidebarExpanded={sidebarExpanded} 
          setSidebarExpanded={setSidebarExpanded} 
        />
        
        <div className="flex-1 relative">
          <div className="absolute inset-0 overflow-auto">
            <Routes>
              <Route element={<ProtectedRoute allowedRoles={['organization']} />}>
                <Route path="dashboard" element={<OrganizationDashboard />} />
                <Route path="userlist" element={<OrganizationUsers />} />
                <Route path="users/feedbacks" element={<OrganizationUsersFeedback />} />
                <Route path="org-feedabacks" element={<OrganizationFeedback />} />
                <Route path="org-complaints" element={<OrganizationComplaint />} />
              </Route>
              <Route path="*" element={<Navigate to="dashboard" replace />} />
              <Route path="register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPasswordModal />} />
            </Routes>
          </div>
        </div>
        
        <OrganizationFooter />
      </div>

      {/* <SessionExpiredModal
        show={showSessionExpiredModal}
        onHide={() => {
          setShowSessionExpiredModal(false);
          handleLogout();
        }}
      /> */}
    </div>
  );
}



// // src/layouts/Org.js
// import React, { useEffect, useState } from "react";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import toast from "react-hot-toast";

// // Components
// import OrganizationNavbar from "../components/Organization/Navbars/OrganizationNavbar";
// import OrganizationSidebar from "../components/Organization/Sidebars/OrganizationSidebar";
// import OrganizationFooter from "../components/Organization/Footers/OrganizationFooter";
// import ProtectedRoute from "../components/Organization/ProtectedRoutes/ProtectedRoute"; // <-- Import the modified component
// import SessionExpiredModal from "../components/Organization/Session/SessionExpiredModal";

// // Views
// import OrganizationUsers from "../views/Organization/OrganizationUserDetails/OrganizationUsers";
// import OrganizationDashboard from "../views/Organization/OrganizationDetails/OrganizationDashboard";
// // Removed Register import as it's likely not a protected route within the org layout
// // import Register from "../views/auth/Register";
// import OrganizationUsersFeedback from "../views/Organization/OrganizationUserDetails/OrganizationUsersFeedback";
// import OrganizationFeedback from "../views/Organization/OrganizationDetails/OrganizationFeedback";
// import OrganizationComplaint from "../views/Organization/OrganizationDetails/OrganizationComplaint";
// // Removed ResetPasswordModal import as it's likely not a protected route within the org layout
// // import ResetPasswordModal from "../views/auth/ResetPasswordModal";

// // Redux
// import { logoutOrganization } from "../redux/Organization/auth/organizationAuthSlice";

// // --- Constants ---
// const ORG_TOKEN_KEY = localStorage.getItem("token"); // Use a constant for the token key
// const ORG_LOGIN_PATH = "/organization/dashboard";       // Use a constant for the login path

// export default function Org() {
//   const [sidebarExpanded, setSidebarExpanded] = useState(false);
//   const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const handleSessionExpired = (event) => {
//       // Optional: Check if the event is meant for this specific user type
//       // if (event.detail?.userType === 'organization') {
//       setShowSessionExpiredModal(true);
//       // }
//     };

//     // Consider making the event name more specific if needed, e.g., 'show-org-session-expired-modal'
//     window.addEventListener('show-session-expired-modal', handleSessionExpired);
//     return () => {
//       window.removeEventListener('show-session-expired-modal', handleSessionExpired);
//     };
//   }, []);

//   const handleLogout = () => {
//     dispatch(logoutOrganization()); // This should also clear the orgToken from localStorage
//     localStorage.removeItem(ORG_TOKEN_KEY); // Explicitly remove token on logout
//     toast.success("Session expired. Please Login Again");
//     // navigate(ORG_LOGIN_PATH);
//     setShowSessionExpiredModal(false); // Close modal after handling
//   };

//   // Check authentication status on component mount or relevant changes
//   // This prevents rendering layout parts if not authenticated initially
//   const isAuthenticated = !!localStorage.getItem(ORG_TOKEN_KEY);
//   // useEffect(() => {
//   //   if (!isAuthenticated) {
//   //     // Optional: Immediately redirect if not authenticated when layout loads
//   //     // navigate(ORG_LOGIN_PATH, { replace: true });
//   //   }
//   // }, [isAuthenticated, navigate]);


//   // If not authenticated, you might want to render nothing or redirect immediately
//   // This depends on how your App.js routes are set up. If App.js already handles
//   // top-level routing based on auth, this check might be redundant here.
//   // if (!isAuthenticated) {
//   //    return <Navigate to={ORG_LOGIN_PATH} replace />;
//   // }


//   return (
//     <div className="flex min-h-screen bg-blueGray-100">
//       <OrganizationSidebar
//         sidebarExpanded={sidebarExpanded}
//         setSidebarExpanded={setSidebarExpanded}
//       />

//       <div className={`flex-1 flex flex-col ${
//         sidebarExpanded ? "lg:ml-64" : "lg:ml-20"
//       } transition-all duration-300 ease-in-out`}>
//         <OrganizationNavbar
//           sidebarExpanded={sidebarExpanded}
//           setSidebarExpanded={setSidebarExpanded}
//         />

//         <div className="flex-1 relative w-full"> {/* Added padding */}
//           {/* Use absolute positioning for the content area if you want the footer fixed at the bottom */}
//           {/* Or let it flow naturally */}
//           <Routes>
//             {/* --- Protected Routes --- */}
//             <Route element={<ProtectedRoute tokenKey={ORG_TOKEN_KEY} loginPath={ORG_LOGIN_PATH} login="/" />}>
//               <Route path="dashboard" element={<OrganizationDashboard />} />
//               <Route path="userlist" element={<OrganizationUsers />} />
//               <Route path="users/feedbacks" element={<OrganizationUsersFeedback />} />
//               <Route path="org-feedabacks" element={<OrganizationFeedback />} />
//               <Route path="org-complaints" element={<OrganizationComplaint />} />
//               {/* Default route within protected area */}
//               <Route path="/" element={<Navigate to="dashboard" replace />} />
//               <Route path="*" element={<Navigate to="dashboard" replace />} />
//             </Route>

//             {/* --- Public Routes specific to Org context (if any) --- */}
//             {/* Example: Maybe a specific registration link */}
//             {/* <Route path="register" element={<Register />} /> */}

//             {/* Catch-all for any org path not matched above - redirect to dashboard */}
//             {/* This might conflict with the protected route catch-all, review your needs */}
//             {/* <Route path="*" element={<Navigate to="dashboard" replace />} /> */}

//           </Routes>
//         </div>

//         <OrganizationFooter />
//       </div>

//       <SessionExpiredModal
//         show={showSessionExpiredModal}
//         onHide={handleLogout} // Use handleLogout directly
//       />
//     </div>
//   );
// }