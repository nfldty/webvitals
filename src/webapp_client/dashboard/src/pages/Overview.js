// src/pages/Overview.js
import React, { useState } from 'react';
import FilterSelector from '../components/FilterSelector';
import api from '../utils/api';
import '../style.css';

const Overview = () => {
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState(null);

  // Convert the snippet into a string so it can be displayed in an input.
  const snippet = `<script type="module" data-webvitals-widget src="http://localhost/widget/widget.js" data-user-id="1" defer></script>`;

  // Function to fetch filtered statistics using the current filters.
  const fetchStats = () => {
    // Ensure userId is provided. Here, we're using '1' as the userId.
    const appliedFilters = { ...filters, userId: '1' };
    api.get('/filteredStatistics', { params: appliedFilters })
      .then(response => {
        setStats(response.data);
      })
      .catch(error => {
        console.error('Error fetching filtered statistics', error);
      });
  };

  return (
    <div className="overview-container">
      <h2>Overview</h2>
      <div className="widget-card">
        <p>Below is your webvitals widget; please insert into your web page.</p>
        <input type="text" readOnly value={snippet} />
      </div>
      <div className="filters-section">
        {/* Pass both the onApplyFilters and oncli callback */}
        <FilterSelector onApplyFilters={setFilters} oncli={fetchStats} />
      </div>
      {stats && (
        <div className="stats-display">
          <h2>Filtered Statistics</h2>
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Overview;
