import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

// Create a context
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(Cookies.get('authToken') || null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (authToken) {
      const userId = getUserIdFromToken(authToken);
      setUserId(userId);
    } else {
      setUserId(null);
    }
  }, [authToken]);

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

  // Login function to store the token in cookies
  const login = (token) => {
    setAuthToken(token);
    console.log('Auth token',token);
    Cookies.set('authToken', token, { expires: 7, secure: false, sameSite: 'Strict' });
    console.log('Cookies',Cookies.get('authToken'));
  };

  // get function to clear the token and userId
  const logout = () => {
    setAuthToken(null);
    setUserId(null);
    Cookies.remove('authToken');
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
