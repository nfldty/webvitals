import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Icons for styled sidebar (keep from styled version)
import { FiGrid, FiMap, FiPlayCircle, FiSettings, FiLogOut } from 'react-icons/fi';
import '../style.css'; // Ensure CSS is imported
import SessionReplay from './SessionReplay';
import Settings from './Settings';
import Overview from './Overview';
import Heatmap from './Heatmap';
// Header component import (keep from new version)
import DashboardHeader from '../components/DashboardHeader';
// Auth context import (common)
// ProtectedRoute import (keep from new version)
import api from '../utils/api'; // API utility for making requests
import ProtectedRoute from '../components/ProtectedRoute';

export const Dashboard = () => {
  const [page, setPage] = useState("overview");
  const navigate = useNavigate();

  // Logout Handler (common logic)
  const handleLogout = () => {
    api.post('/auth/logout'); // Call the logout API
    localStorage.removeItem("currentUserId");
    navigate('/app/login'); // Redirect to login
  };

  // **UPDATED** Render Content: Uses ProtectedRoute from new logic
  const renderContent = () => {
    switch (page) {
      case "overview":
        // Pass the component directly to element prop
        return <ProtectedRoute element={<Overview />} />;
      case "heatmap":
        return <ProtectedRoute element={<Heatmap />} />;
      case "sessionReplay":
        return <ProtectedRoute element={<SessionReplay />} />;
      case "settings":
        return <ProtectedRoute element={<Settings />} />;
      default:
        // Default to Overview with protection
        return <ProtectedRoute element={<Overview />} />;
    }
  };

  // **USE STYLED SIDEBAR:** Helper for styled sidebar items (from styled version)
  const NavItem = ({ icon: Icon, label, pageName, currentPage, setPage }) => (
    <li className={currentPage === pageName ? 'active' : ''}>
      <button onClick={() => setPage(pageName)} aria-label={`Go to ${label}`}>
        <Icon className="sidebar-icon" aria-hidden="true" />
        <span className="sidebar-text">{label}</span>
      </button>
    </li>
  );

  return (
    // Use overall structure from styled version
    <div className="dashboard-container">
      {/* Use DashboardHeader component from new logic */}
      {/* Apply dashboard-header class for styling from style.css */}
      <DashboardHeader className="dashboard-header"/>

      <div className="dashboard-content">
         {/* Use styled sidebar structure */}
        <aside className="dashboard-sidebar" role="complementary" aria-label="Sidebar Navigation">
          <div className="sidebar-brand">W.V</div>
          <nav role="navigation" aria-label="Main Navigation">
            <ul>
              {/* Use NavItem helper for styled list items */}
              <NavItem icon={FiGrid} label="Overview" pageName="overview" currentPage={page} setPage={setPage} />
              <NavItem icon={FiMap} label="Heatmap" pageName="heatmap" currentPage={page} setPage={setPage} />
              <NavItem icon={FiPlayCircle} label="Session Replay" pageName="sessionReplay" currentPage={page} setPage={setPage} />
              <NavItem icon={FiSettings} label="Settings" pageName="settings" currentPage={page} setPage={setPage} />
            </ul>
          </nav>
          {/* Styled logout button structure */}
          <div className="sidebar-logout">
            <button onClick={handleLogout} className="logout-button" aria-label="Logout">
              <FiLogOut className="sidebar-icon" aria-hidden="true"/>
              <span className="sidebar-text">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main content area remains the same */}
        <main className="dashboard-main" role="main" id="main-content">
          {renderContent()} {/* Call the updated renderContent */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
