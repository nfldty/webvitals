// src/components/DashboardHeader.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme hook
import { FiSun, FiMoon } from 'react-icons/fi'; // Import icons
import logo from './favicon.svg';
import { useState } from 'react'; // Import useState for hover effect
// Removed direct style.css import, assuming it's imported globally (e.g., in App.js or index.js)

export const DashboardHeader = ( {setPage} ) => {
    // Get theme state and toggle function from context
    const { isDarkMode, toggleTheme } = useTheme();
    const [hover, setHover] = useState(false);
    return (
        // Use header element with dashboard-header class
        <header className="dashboard-header">
            {/* Title */}
            <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => setPage("overview")}
            onMouseEnter={() => setHover(true)}  // Set hover state to true
            onMouseLeave={() => setHover(false)} // Reset hover state
            >
            <img
                src={logo} // Use the imported logo
                alt="Logo"
                style={{
                width: '30px',  // Adjust size of the logo
                height: '30px',
                marginRight: '10px',  // Add some space between the image and text
                }}
            />
            <h1
                style={{
                color: hover ? 'blue' : 'black', // Change text color on hover
                }}
            >
                Webvitals
            </h1>
            </div>

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