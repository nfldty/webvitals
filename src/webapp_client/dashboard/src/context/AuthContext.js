import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api'; // Your API setup

// Create a context
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);  // Track the loading state

  // Function to fetch the current user ID from the backend
  const fetchCurrentUserId = async () => {
    try {
      const response = await api.get('/get-user');
      if (response.status === 200) {
        setCurrentUserId(response.data.user.id); // Set user ID from the response
      } else {
        setCurrentUserId(null);  // If response isn't valid, set null
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
      setCurrentUserId(null); // Set to null in case of error
    } finally {
      setLoading(false);  // Set loading to false when done
    }
  };

  // Use useEffect to call fetchCurrentUserId when the component mounts
  useEffect(() => {
    fetchCurrentUserId(); // Fetch user ID when provider mounts
  }, []);

  return (
    <AuthContext.Provider value={{ currentUserId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
