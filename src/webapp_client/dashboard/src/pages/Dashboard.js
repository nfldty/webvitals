import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import FilterSelector from "../components/FilterSelector";
import '../style.css';
import SessionReplay from './SessionReplay';
import Settings from './Settings';
import Overview from './Overview';
import Heatmap from './Heatmap';
import DashboardHeader from '../components/DashboardHeader';


export const Dashboard = () => {
  const [page, setPage] = useState("overview");
  // Convert the snippet into a string so it can be displayed in an input.
  const snippet = `<script type="module" data-webvitals-widget src="http://localhost/widget/widget.js" data-user-id="1" defer></script>`;
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic here (e.g., clear tokens, redirect, etc.)
    console.log("User logged out");
    localStorage.setItem('authToken', '');
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
        <aside className="dashboard-sidebar">
          <nav>
            <ul>
              <li>
                <button onClick={() => setPage("overview")}>Overview</button>
              </li>
              <li>
                <button onClick={() => setPage("heatmap")}>Heatmap</button>
              </li>
              <li>
                <button onClick={() => setPage("sessionReplay")}>Session Replay</button>
              </li>
              <li>
                <button onClick={() => setPage("settings")}>Settings</button>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;