import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import FilterSelector from "../components/FilterSelector";
import '../style.css';
import SessionReplay from './SessionReplay';
import Settings from './Settings';
import Overview from './Overview';
import Heatmap from './Heatmap';
import DashboardHeader from '../components/DashboardHeader';
import { useAuth } from '../context/AuthContext';


export const Dashboard = () => {
  const [page, setPage] = useState("overview");
  // Convert the snippet into a string so it can be displayed in an input.
  const snippet = `<script type="module" data-webvitals-widget src="http://localhost/widget/widget.js" data-user-id="1" defer></script>`;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // Implement logout logic here (e.g., clear tokens, redirect, etc.)
    console.log("User logged out");
    logout();
    navigate('/app/login');
  };

  // Render page content based on the selected nav item
  const renderContent = () => {
    switch (page) {
      case "overview":
        return <Overview />;
      case "heatmap":
        return <Heatmap />;
      case "sessionReplay":
        return <SessionReplay />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <div className="dashboard-content">
        <aside className="dashboard-sidebar" role="complementary" aria-label="Sidebar Navigation">
          <nav role="navigation" aria-label="Main Navigation">
            <ul>
              <li>
                <button onClick={() => setPage("overview")} aria-label="Go to Overview">Overview</button>
              </li>
              <li>
                <button onClick={() => setPage("heatmap")} aria-label="Go to Heatmap">Heatmap</button>
              </li>
              <li>
                <button onClick={() => setPage("sessionReplay")} aria-label="Go to Session Replay">Session Replay</button>
              </li>
              <li>
                <button onClick={() => setPage("settings")} aria-label="Go to Settings">Settings</button>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-button" aria-label="Logout">Logout</button>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="dashboard-main" role="main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;