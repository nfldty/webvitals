import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext

const ProtectedRoute = ({ element }) => {
  const { currentUserId } = useAuth(); // Get currentUserId from the AuthContext
  const [loading, setLoading] = useState(true); // State to track if user data is still loading

  useEffect(() => {
    // Set loading to false once currentUserId is available
    if (currentUserId !== null) {
      setLoading(false);
    }
  }, [currentUserId]); // Only trigger this effect when currentUserId changes

  if (loading) {
    // Return null or any placeholder while loading (optional)
    return null;
  }

  if (!currentUserId) {
    // If no currentUserId, redirect to the login page
    return <Navigate to="/app/login" replace />;
  }

  // If currentUserId exists, render the protected element
  return element;
};

export default ProtectedRoute;
