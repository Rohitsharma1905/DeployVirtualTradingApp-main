import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import AdminNavbar from "../components/Admin/Navbars/AdminNavbar";
import Sidebar from "../components/Admin/Sidebar/Sidebar";
import FooterAdmin from "../components/Admin/Footers/FooterAdmin";

// Views
import Dashboard from "../views/admin/Dashboard";
import Settings from "../views/admin/Settings";
import OrgRegister from "../views/admin/OrganizationList";
import ETFTable from "../views/admin/EtfTable";
import NiftyTable from "../views/admin/NiftyTable";
import Nifty500Table from "../views/admin/nifty500table";
import RegisteredUsers from "../views/admin/UserList";
import Queries from "../views/admin/QueryList";
import FeedbackList from "../views/admin/FeedbackList";
import ComplaintList from "../views/admin/ComplaintList";
import OrgComplaintList from "../views/admin/OrgComplaintList";
import GalleryImages from "../views/admin/gallery/GalleryImages";
import GalleryCategories from "../views/admin/gallery/GalleryCategories";
import UserDemo from "../views/admin/bookDemo/UserDemo";
import OrgDemo from "../views/admin/bookDemo/OrgDemo";
import AdminEventsPage from "../views/admin/AdminEventsPage";
import Participants from "../views/admin/Participants";
import ProtectedRoute from "../components/Organization/ProtectedRoutes/ProtectedRoute";
export default function Admin() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen bg-blueGray-100">
      <Sidebar
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
      />
      <div
        className={`flex-1 flex flex-col ${
          sidebarExpanded ? "md:ml-64" : "md:ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        <AdminNavbar 
          sidebarExpanded={sidebarExpanded} 
          setSidebarExpanded={setSidebarExpanded} 
        />
        <div className="flex-1 relative">
          <div className="absolute inset-0 overflow-auto">
            <Routes>
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="participants" element={<Participants />} />
              <Route path="settings" element={<Settings />} />
              <Route path="niftytable" element={<NiftyTable />} />
              <Route path="nifty500table" element={<Nifty500Table />} />
              <Route path="etftable" element={<ETFTable />} />
              <Route path="queries" element={<Queries />} />
              <Route path="feedback" element={<FeedbackList />} />
              <Route path="complaint" element={<ComplaintList />} />
              <Route path="org-complaint" element={<OrgComplaintList />} />
              <Route path="RegisteredUsers" element={<RegisteredUsers />} />
              <Route path="OrgRegister" element={<OrgRegister />} />
              <Route path="gallery/images" element={<GalleryImages sidebarExpanded={sidebarExpanded}/>}/>
              <Route path="gallery/categories" element={<GalleryCategories sidebarExpanded={sidebarExpanded}/>}/>
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
              <Route path="demo/userDemo" element={<UserDemo sidebarExpanded={sidebarExpanded}/>}/>
              <Route path="demo/organizationDemo" element={<OrgDemo sidebarExpanded={sidebarExpanded}/>}/>
              </Route>
            </Routes>
          </div>
        </div>
        <FooterAdmin />
      </div>
    </div>
  );
}



// // src/layouts/Admin.js

// import React, { useState, useEffect } from "react"; // Added useEffect
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; // Added useNavigate
// // Removed Redux imports as they weren't used directly for auth here, but you might need them
// // import { useDispatch } from "react-redux";
// import toast from "react-hot-toast";

// // Components
// import AdminNavbar from "../components/Admin/Navbars/AdminNavbar";
// import Sidebar from "../components/Admin/Sidebar/Sidebar";
// import FooterAdmin from "../components/Admin/Footers/FooterAdmin";
// import ProtectedRoute from "../components/Organization/ProtectedRoutes/ProtectedRoute"; // <-- Import the modified component
// // Import SessionExpiredModal if admins also need it
// // import SessionExpiredModal from "../components/Organization/Session/SessionExpiredModal";

// Views
// import Dashboard from "../views/admin/Dashboard";
// import Settings from "../views/admin/Settings";
// import OrgRegister from "../views/Admin/OrganizationList";
// import ETFTable from "../views/admin/EtfTable";
// import NiftyTable from "../views/admin/NiftyTable";
// import Nifty500Table from "../views/admin/nifty500table";
// import RegisteredUsers from "../views/Admin/UserList";
// import Queries from "../views/Admin/QueryList";
// import FeedbackList from "../views/Admin/FeedbackList";
// import ComplaintList from "../views/admin/ComplaintList";
// import OrgComplaintList from "../views/admin/OrgComplaintList";
// import GalleryImages from "../views/admin/gallery/GalleryImages";
// import GalleryCategories from "../views/admin/gallery/GalleryCategories";
// import UserDemo from "../views/admin/bookDemo/UserDemo";
// import OrgDemo from "../views/admin/bookDemo/OrgDemo";
// import AdminEventsPage from "../views/admin/AdminEventsPage";
// import Participants from "../views/admin/Participants";
// // Import admin logout action if available
// // import { logoutAdmin } from "../redux/Admin/auth/adminAuthSlice";


// // --- Constants ---
// const ADMIN_TOKEN_KEY = localStorage.getItem("token"); // CHANGE if your admin token key is different
// const ADMIN_LOGIN_PATH = "/admin/dashboard"; // CHANGE if your admin login path is different

// export default function Admin() {
//   const [sidebarExpanded, setSidebarExpanded] = useState(false);
//   // Add state for session modal if needed
//   // const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
//   // const navigate = useNavigate();
//   // const dispatch = useDispatch();


//   // Add session expiry handling if needed for Admin
//   // useEffect(() => { ... });

//   // Add admin logout handler if needed
//   // const handleLogout = () => {
//   //   // dispatch(logoutAdmin());
//   //   localStorage.removeItem(ADMIN_TOKEN_KEY);
//   //   toast.success("Session expired. Please Login Again");
//   //   navigate(ADMIN_LOGIN_PATH);
//   //   // setShowSessionExpiredModal(false);
//   // };

//   // Check authentication status on component mount
//   const isAuthenticated = !!localStorage.getItem(ADMIN_TOKEN_KEY);
//   // useEffect(() => {
//   //   if (!isAuthenticated) {
//       // Optional immediate redirect
//   //     // navigate(ADMIN_LOGIN_PATH, { replace: true });
//   //   }
//   // }, [isAuthenticated, navigate]);

//   // if (!isAuthenticated) {
//   //    return <Navigate to={ADMIN_LOGIN_PATH} replace />;
//   // }


//   return (
//     <div className="flex min-h-screen bg-blueGray-100">
//       <Sidebar
//         sidebarExpanded={sidebarExpanded}
//         setSidebarExpanded={setSidebarExpanded}
//       />
//       <div
//         className={`flex-1 flex flex-col ${
//           sidebarExpanded ? "md:ml-64" : "md:ml-20"
//         } transition-all duration-300 ease-in-out`}
//       >
//         <AdminNavbar
//           sidebarExpanded={sidebarExpanded}
//           setSidebarExpanded={setSidebarExpanded}
//         />
//         <div className="flex-1 relative w-full"> {/* Added padding */}
//           {/* Use absolute positioning or normal flow */}
//           <Routes>
//              {/* --- Protected Admin Routes --- */}
//             <Route element={<ProtectedRoute tokenKey={ADMIN_TOKEN_KEY} loginPath={ADMIN_LOGIN_PATH} login="/" />}>
//                 <Route path="dashboard" element={<Dashboard />} />
//                 <Route path="participants" element={<Participants />} />
//                 <Route path="settings" element={<Settings />} />
//                 <Route path="niftytable" element={<NiftyTable />} />
//                 <Route path="nifty500table" element={<Nifty500Table />} />
//                 <Route path="etftable" element={<ETFTable />} />
//                 <Route path="queries" element={<Queries />} />
//                 <Route path="feedback" element={<FeedbackList />} />
//                 <Route path="complaint" element={<ComplaintList />} />
//                 <Route path="org-complaint" element={<OrgComplaintList />} />
//                 <Route path="RegisteredUsers" element={<RegisteredUsers />} />
//                 <Route path="OrgRegister" element={<OrgRegister />} />
//                 <Route path="gallery/images" element={<GalleryImages sidebarExpanded={sidebarExpanded}/>}/>
//                 <Route path="gallery/categories" element={<GalleryCategories sidebarExpanded={sidebarExpanded}/>}/>
//                 <Route path="events" element={<AdminEventsPage />} />
//                 <Route path="demo/userDemo" element={<UserDemo sidebarExpanded={sidebarExpanded}/>}/>
//                 <Route path="demo/organizationDemo" element={<OrgDemo sidebarExpanded={sidebarExpanded}/>}/>
//                 {/* Default route within protected area */}
//                 <Route path="/" element={<Navigate to="dashboard" replace />} />
//                 <Route path="*" element={<Navigate to="dashboard" replace />} />
//             </Route>

//             {/* --- Public Routes specific to Admin context (if any) --- */}
//              {/* Example: <Route path="forgot-password" element={<AdminForgotPassword />} /> */}

//             {/* Catch-all for any admin path not matched above */}
//             {/* This might conflict with the protected route catch-all, review needs */}
//             {/* <Route path="*" element={<Navigate to="dashboard" replace />} /> */}

//           </Routes>
//         </div>
//         <FooterAdmin />
//       </div>
//        {/* Add SessionExpiredModal if needed for Admin */}
//       {/* <SessionExpiredModal show={showSessionExpiredModal} onHide={handleLogout} /> */}
//     </div>
//   );
// }