import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie to manage cookies

const ProtectedRoute = ({ element }) => {
  const token = Cookies.get('authToken'); // Get the token from cookies

  if (!token) {
    // If there's no token, redirect to the login page
    return <Navigate to="/app/login" replace />;
  }

  // If there's a token, render the element (protected page)
  return element;
};

export default ProtectedRoute;
