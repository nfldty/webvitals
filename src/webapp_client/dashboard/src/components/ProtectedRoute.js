import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext

const ProtectedRoute = ({ element }) => {
  const { currentUserId} = useAuth();

  if (!currentUserId) return <Navigate to="/app/login" replace />;

  return element;
};

export default ProtectedRoute;
