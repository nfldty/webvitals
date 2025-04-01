import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api'; // Your api setup for making requests

// Create a context
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(null);

  // Function to fetch the current user ID from the backend
  const fetchCurrentUserId = async () => {
    try {
      const response = await api.get('/get-user');
      console.log("Response",response.data)
      if (response.status === 200) {
        setCurrentUserId(response.data.user.id); // Set the user ID from the response
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
      setCurrentUserId(null);
    }
  };

  // Use useEffect to call fetchCurrentUserId when the component mounts
  useEffect(() => {
    fetchCurrentUserId(); // Fetch the current user ID when the provider mounts
  }, []);

  return (
    <AuthContext.Provider value={{ currentUserId, setCurrentUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
