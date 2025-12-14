import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectIsAdmin } from '../../redux/User/authSlice'; // Adjust path

const UserProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isAdmin = useSelector(selectIsAdmin);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect them to the login page, but save the current location they were
        // trying to go to. This allows us to send them back after login.
        // NOTE: You might want to redirect to '/' if your login is a modal on the home page.
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // If the user is authenticated but is an admin, redirect them away from user routes
    // (Optional: depends on your desired flow. Maybe admins can also view user pages?)
    // If you want admins *blocked* from user routes, uncomment the below:

    if (isAdmin) {
        // Redirect admin to their dashboard
        return <Navigate to="/admin/dashboard" replace />;
    }
    

    // If authenticated and not an admin (or admins are allowed), render the child component
    return children;
};

export default UserProtectedRoute;