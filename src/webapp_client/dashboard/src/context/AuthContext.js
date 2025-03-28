import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [userId, setUserId] = useState(null);

  // This effect will run when the token is updated
  useEffect(() => {
    if (authToken) {
      const userId = getUserIdFromToken(authToken);
      setUserId(userId);
    } else {
      setUserId(null);
    }
  }, [authToken]);

  // Function to extract userId from JWT token
  const getUserIdFromToken = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const decodedPayload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(decodedPayload);
      return payload.id;
    } catch (error) {
      return null;
    }
  };

  // Login function to store the token and userId
  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem('authToken', token);  // Save the token in localStorage
  };

  // Logout function to clear the token and userId
  const logout = () => {
    setAuthToken(null);
    setUserId(null);
    localStorage.removeItem('authToken');  // Remove the token from localStorage
  };

  // Function to get the current user ID
  const getCurrentUserId = () => {
    return userId;
  };

  return (
    <AuthContext.Provider value={{ authToken, userId, login, logout, getCurrentUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
