import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsOrgAuthenticated } from '../../redux/Organization/auth/organizationAuthSlice'; // Adjust path

const OrgProtectedRoute = ({ children }) => {
    const isOrgAuthenticated = useSelector(selectIsOrgAuthenticated);
    const location = useLocation();

    if (!isOrgAuthenticated) {
        // Redirect them to the login page (or home page where the modal is)
        // Since the org login is often via the modal, redirecting to '/' might be better
        // if your UnifiedLoginModal appears on the home page. Adjust as needed.
        return <Navigate to="/" state={{ from: location, showLogin: true, loginType: 'organization' }} replace />;
        // Or keep it simple:
        // return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // If authenticated as an organization, render the child component
    return children;
};

export default OrgProtectedRoute;