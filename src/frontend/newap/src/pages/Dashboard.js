import React, { useState } from 'react';
import FilterSelector from "../components/FilterSelector";
import './style.css';

export const Dashboard = () => {
  const [filters, setFilters] = useState({});
  // Convert the snippet into a string so it can be displayed in an input.
  const snippet = `<script type="module" data-webvitals-widget src="http://localhost/widget.js" data-user-id="1" defer></script>`;

  return (
    <div className="dashboard-container" role="application">
      <header className="dashboard-header" role="banner">
        <h1>Webvitals Dashboard</h1>
      </header>
      <div className="dashboard-content">
        <aside className="dashboard-sidebar" role="complementary">
          <nav role="navigation" aria-label="Main Navigation">
            <ul>
              <li role="menuitem">Overview</li>
              <li role="menuitem">Sessions</li>
              <li role="menuitem">Insights</li>
              <li role="menuitem">Settings</li>
            </ul>
          </nav>
        </aside>
        <main className="dashboard-main" role="main">
          <div className="widget-card" role="region" aria-label="Widget Embed Code">
            <p>Below is your webvitals widget; please insert into your web page.</p>
            <input type="text" readOnly value={snippet} aria-label="Widget embed code" />
          </div>
          <div className="filters-section" role="region" aria-label="Filters">
            <FilterSelector onApplyFilters={setFilters} />
          </div>
          <h1 className="dashboard-title">THIS IS THE DASHBOARD</h1>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
