// src/components/DashboardHeader.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme hook
import { FiSun, FiMoon } from 'react-icons/fi'; // Import icons
// Removed direct style.css import, assuming it's imported globally (e.g., in App.js or index.js)

export const DashboardHeader = () => {
    // Get theme state and toggle function from context
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        // Use header element with dashboard-header class
        <header className="dashboard-header">
            {/* Title */}
            <h1>Webvitals</h1>
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme} // Call toggle function on click
                className="theme-toggle-button" // Apply specific styling class
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'} // Accessibility label
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'} // Tooltip
            >
                {/* Conditionally render Sun or Moon icon */}
                {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>
        </header>
    );
};

// Use default export if this is the primary export of the file
export default DashboardHeader;