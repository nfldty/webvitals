// src/context/ThemeContext.js
import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize state: check localStorage -> check system pref -> default to light
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const storedPref = localStorage.getItem('theme');
      if (storedPref) {
        return storedPref === 'dark';
      }
      // Check system preference if no stored preference
      // Make sure window and matchMedia exist (for SSR or older environments)
      if (typeof window !== 'undefined' && window.matchMedia) {
          return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return false; // Default to light if cannot check preference
    } catch (e) {
      // Fallback if localStorage or matchMedia fails
      console.error("Error reading theme preference:", e);
      return false; // Default to light mode on error
    }
  });

  // Effect to apply class to body and update localStorage
  useEffect(() => {
    const root = document.body; // Apply class directly to body
    if (isDarkMode) {
      root.classList.add('dark-mode');
      try {
        localStorage.setItem('theme', 'dark');
      } catch (e) {
         console.error("Error saving dark theme to localStorage:", e);
      }
    } else {
      root.classList.remove('dark-mode');
       try {
         localStorage.setItem('theme', 'light');
      } catch (e) {
          console.error("Error saving light theme to localStorage:", e);
       }
    }
  }, [isDarkMode]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ isDarkMode, toggleTheme }), [isDarkMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context easily
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};