import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    // While we are validating the token, show a loading screen
    return <div className="loading-spinner">Loading...</div>; 
  }

  if (!token) {
    // If we are done loading and there is still no token, redirect to login.
    return <Navigate to="/login" replace />;
  }

  // If we are done loading and we have a token, show the protected content.
  return children;
};

export default ProtectedRoute;