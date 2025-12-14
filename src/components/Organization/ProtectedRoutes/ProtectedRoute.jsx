// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = () => {
//   // Check if the organization is logged in (e.g., by checking for a token in localStorage)
//   const isAuthenticated = !!localStorage.getItem("token");

//   // If authenticated, render the child routes (Outlet)
//   // Otherwise, redirect to the login page
//   return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
// };

// export default ProtectedRoute;



import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated as selectIsUserAuthenticated } from '../../../redux/User/authSlice';
import { selectIsOrgAuthenticated } from '../../../redux/Organization/auth/organizationAuthSlice';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const location = useLocation();
  
  // Get authentication status for all roles
  const isUser = useSelector(selectIsUserAuthenticated);
  const isOrg = useSelector(selectIsOrgAuthenticated);
  
  // Check if user has any role
  const isAuthenticated = isUser || isOrg;
  
  // Get user role from localStorage (you should set this during login)
  const userRole = localStorage.getItem('role');
  
  // If not authenticated at all, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // If authenticated but role not allowed, redirect to their dashboard
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'organization':
        return <Navigate to="/organization/dashboard" replace />;
      case 'user':
        return <Navigate to="/user/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  // If authorized, render the children or outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;