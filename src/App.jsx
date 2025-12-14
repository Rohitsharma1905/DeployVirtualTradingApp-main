
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Admin from './layouts/Admin';
import Auth from './layouts/Auth';
import Org from './layouts/Org';
import User from './layouts/User';
import GuestUser from './layouts/GuestUser';

// Views without layouts
import Profile from './views/user/Profile';
import CompanyDetailsPage from "./views/admin/CompanyDetail";
import ForgotPasswordModal from "./views/auth/ForgetPasswordModal";
import ResetPasswordModal from "./views/auth/ResetPasswordModal"; // New Component
// import BackToTop from './components/GuestUser/BackToTop';
// import StartScreenPopupModal from './components/GuestUser/Home/StartScreenPopupModal';



// import SessionExpiredModal from './components/Organization/Session/SessionExpiredModal';
import { logoutOrganization } from './redux/Organization/auth/organizationAuthSlice';
import { logout } from './redux/User/authSlice';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";


const App = () => {
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
const isOrganization = location.pathname.includes("organization");

    const handleLogout = () => {
      dispatch(logoutOrganization()); // Dispatch logout action
      dispatch(logout());
      toast.success("Login Again");
      navigate("/"); // Redirect to home page
    };
  
    // useEffect(() => {
    //   const checkSession = () => {
    //     // Get the current path
    //     const currentPath = window.location.pathname;
    
    //     // Skip session check for reset password page
    //     if (currentPath.startsWith("/reset-password")) {
    //       return;
    //     }
    
    //     const orgToken = localStorage.getItem("token");
    //     const userToken = localStorage.getItem("userToken");
    
    //     if (!orgToken && !userToken) return; // Don't show modal if tokens are not found
    
    //     try {
    //       const decodeToken = (token) => JSON.parse(atob(token.split(".")[1]));
    //       const currentTime = Math.floor(Date.now() / 1000);
    
    //       if (orgToken) {
    //         const decodedOrgToken = decodeToken(orgToken);
    //         if (decodedOrgToken.exp < currentTime) {
    //           setShowSessionExpiredModal(true);
    //           return;
    //         }
    //       }
    
    //       if (userToken) {
    //         const decodedUserToken = decodeToken(userToken);
    //         if (decodedUserToken.exp < currentTime) {
    //           setShowSessionExpiredModal(true);
    //           return;
    //         }
    //       }
    //     } catch (error) {
    //       console.error("Error decoding token:", error);
    //       return; // Prevent showing modal due to decoding errors
    //     }
    //   };
    
    //   const sessionCheckTimeout = setTimeout(checkSession, 2000);
    //   const interval = setInterval(checkSession, 60000);
    
    //   return () => {
    //     clearTimeout(sessionCheckTimeout);
    //     clearInterval(interval);
    //   };
    // }, []);
    

  return (
    <div>
      <Toaster/>
      {/* <BackToTop /> */}
      {/* <SessionExpiredModal
        show={showSessionExpiredModal}
        onHide={() => {
          setShowSessionExpiredModal(false);
          handleLogout();
        }}
      /> */}
    <Routes>
      {/* Routes with layouts */}
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/organization/*" element={<Org />} />
      <Route path="/user/*" element={<User/>}/>
     
      <Route path="/*" element={<GuestUser/>}/>

      <Route path="/reset-password" element={<ResetPasswordModal />} />
      

      

      {/* Routes without layouts */}
      <Route path="/company/:symbol" element={<CompanyDetailsPage />} />
      <Route path="/profile" element={<Profile />} />
      
      {/* Redirect for unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
    </div>
  );
};

export default App;

