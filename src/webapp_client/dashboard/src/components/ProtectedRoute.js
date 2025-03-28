import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('authToken');  // Get the token from localStorage

  if (!token) {
    // If there's no token, redirect to the login page
    return <Navigate to="/app/login" replace />;
  }

  // If there's a token, render the element (protected page)
  return element;
};

export default ProtectedRoute;
