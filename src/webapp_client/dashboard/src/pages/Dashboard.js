import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import FilterSelector from "../components/FilterSelector";
import '../style.css';

export const Dashboard = () => {
  const [filters, setFilters] = useState({});
  // Convert the snippet into a string so it can be displayed in an input.
  const snippet = `<script type="module" data-webvitals-widget src="http://localhost/widget.js" data-user-id="1" defer></script>`;
  const navigate = useNavigate();
  const handleLogout = () => {
    // Implement logout logic here (e.g., clear tokens, redirect, etc.)
    console.log("User logged out");
    localStorage.setItem('authToken', '');
    navigate('/app/login');

    // For example: window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Webvitals Dashboard</h1>
      </header>
      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <nav>
            <ul>
              <li>Overview</li>
              <li>Sessions</li>
              <li>Insights</li>
              <li>Settings</li>
              <li>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="dashboard-main">
          <div className="widget-card">
            <p>Below is your webvitals widget; please insert into your web page.</p>
            <input type="text" readOnly value={snippet} />
          </div>
          <div className="filters-section">
            <FilterSelector onApplyFilters={setFilters} />
          </div>
          <h1 className="dashboard-title">THIS IS THE DASHBOARD</h1>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
