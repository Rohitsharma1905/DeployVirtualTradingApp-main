import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectIsAdmin } from '../../redux/User/authSlice'; // Adjust path

const AdminProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isAdmin = useSelector(selectIsAdmin);
    const location = useLocation();

    if (!isAuthenticated) {
        // Not logged in, redirect to login
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        // Logged in, but not an admin, redirect to user dashboard (or home)
        return <Navigate to="/user/dashboard" replace />; // Or '/'
    }

    // If authenticated and is an admin, render the child component
    return children;
};

export default AdminProtectedRoute;