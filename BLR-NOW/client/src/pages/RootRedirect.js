import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RootRedirect = () => {
  const { token, loading } = useAuth();

  if (loading) {
    // Show loading while we check auth
    return <div className="loading-spinner">Loading...</div>;
  }

  // If done loading, redirect based on token
  if (token) {
    return <Navigate to="/events" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default RootRedirect;