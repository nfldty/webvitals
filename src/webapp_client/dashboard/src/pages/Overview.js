// src/pages/Overview.js
import React, { useState, useEffect } from 'react';
import FilterSelector from '../components/FilterSelector';
import { useAuth } from '../context/AuthContext';  // <-- Get userId from AuthContext
import api from '../utils/api';
import '../style.css';

const Overview = () => {
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState(null);

  // Pull userId from AuthContext; if not available, default to "1"
  const { userId } = useAuth();
  const effectiveUserId = userId || "1"; // TODO: adjust as needed

  // Example snippet
  const snippet = `<script type="module" data-webvitals-widget src="http://localhost/widget/widget.js" data-user-id="${effectiveUserId}" defer></script>`;

  // Helper to display a value or 0 if the metric is missing
  const displayNumber = (value) => (value != null ? value : 0);

  // Render click statistics in a human-friendly format
  const renderClickStatistics = (clickStats) => {
    if (!clickStats) return <p>0</p>;
    return (
      <div className="json-data" role="region" aria-label="Click statistics">
        {Object.entries(clickStats).map(([key, value]) => (
          <p key={key}>
            {key.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}: {value.count} ({value.percentage})
          </p>
        ))}
      </div>
    );
  };

  // Render extra data metrics in a formatted way
  const renderExtraData = (extraData) => {
    if (!extraData) return <p>0</p>;
    return (
      <div className="json-data" role="region" aria-label="Extra data metrics">
        {extraData.browserUsage && (
          <p>
            <strong>Browser Usage:</strong> {extraData.browserUsage.map(item => `${item.browserName}: ${item.count} (${item.percentage})`).join(', ')}
          </p>
        )}
        {extraData.operatingSystemUsage && (
          <p>
            <strong>Operating System:</strong> {extraData.operatingSystemUsage.map(item => `${item.operatingSystem}: ${item.count} (${item.percentage})`).join(', ')}
          </p>
        )}
        {extraData.isMobileUsage && (
          <p>
            <strong>Mobile Usage:</strong> {extraData.isMobileUsage.map(item => `${item.isMobile ? 'Mobile' : 'Desktop'}: ${item.count} (${item.percentage})`).join(', ')}
          </p>
        )}
        {extraData.referrerUsage && (
          <p>
            <strong>Referrers:</strong> {extraData.referrerUsage.map(item => `${item.referrer || 'Direct'}: ${item.count} (${item.percentage})`).join(', ')}
          </p>
        )}
      </div>
    );
  };

  // Render traffic data (mostTraffic / leastTraffic)
  const renderTraffic = (trafficArray) => {
    if (!trafficArray || trafficArray.length === 0) return <p>0</p>;
    return (
      <div className="json-data" role="list">
        {trafficArray.map((item, index) => (
          <p key={index} role="listitem">
            {item.pageUrl} — {item._count && item._count.pageUrl ? item._count.pageUrl : 0} visits
          </p>
        ))}
      </div>
    );
  };

  // Define fetchStats in the component scope so it can be used elsewhere
  const fetchStats = async () => {
    try {
      const endpoint = '/statistics';
      const usedFilters = Object.fromEntries(Object.entries(filters).filter(([key, value]) => value))
      const params = { ...usedFilters, userId: effectiveUserId };
      const response = await api.get(endpoint, { params });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setStats(null);
    }
  };

  // Fetch statistics when filters or effectiveUserId changes
  useEffect(() => {
    fetchStats();
  }, [filters, effectiveUserId]);

  return (
    <main className="overview-container" role="main">
      <h2>Overview</h2>

      {/* Webvitals snippet */}
      <section className="widget-card" role="region" aria-labelledby="widget-section">
        <h3 id="widget-section">Website Widget</h3>
        <p>Below is your webvitals widget; please insert it into your web page:</p>
        <input type="text" readOnly value={snippet} aria-label="Webvitals widget code" />
      </section>

      {/* Filter tools */}
      <section className="filters-section" role="search" aria-label="Filter statistics">
        {/* Pass both the onApplyFilters and oncli callback */}
        <FilterSelector onApplyFilters={setFilters} oncli={fetchStats} />
      </section>

      {/* Display metrics only if stats is available */}
      {stats && (
        <section className="stats-display" role="region" aria-labelledby="statistics-heading">
          <h2 id="statistics-heading">Statistics</h2>
          <div className="metrics-grid" role="group" aria-label="Metrics dashboard">
            {/* Total Sessions */}
            <div className="metric-card" role="article" aria-labelledby="total-sessions">
              <h3 id="total-sessions">Total Sessions</h3>
              <p className="metric-value">{displayNumber(stats.totalSessions)}</p>
            </div>

            {/* Avg Pages per Session */}
            <div className="metric-card" role="article" aria-labelledby="avg-pages">
              <h3 id="avg-pages">Avg Pages per Session</h3>
              <p className="metric-value">{displayNumber(stats.avgPagesPerSession)}</p>
            </div>

            {/* Live Users */}
            <div className="metric-card" role="article" aria-labelledby="live-users">
              <h3 id="live-users">Live Users</h3>
              <p className="metric-value">{displayNumber(stats.liveUsers)}</p>
            </div>

            {/* Average Total Time */}
            <div className="metric-card" role="article" aria-labelledby="avg-total-time">
              <h3 id="avg-total-time">Average Total Time</h3>
              <p className="metric-value">{displayNumber(stats.avgTotalTime)}</p>
            </div>

            {/* Average Time per Page */}
            <div className="metric-card" role="article" aria-labelledby="avg-time-per-page">
              <h3 id="avg-time-per-page">Average Time per Page</h3>
              <p className="metric-value">{displayNumber(stats.avgTimePerPage)}</p>
            </div>

            {/* Click Statistics */}
            <div className="metric-card" role="article" aria-labelledby="click-stats">
              <h3 id="click-stats">Click Statistics</h3>
              <div className="metric-value">
                {renderClickStatistics(stats.clickStatistics)}
              </div>
            </div>

            {/* Extra Data */}
            <div className="metric-card" role="article" aria-labelledby="extra-data">
              <h3 id="extra-data">Extra Data</h3>
              <div className="metric-value">
                {renderExtraData(stats.extraData)}
              </div>
            </div>

            {/* Most Traffic */}
            <div className="metric-card" role="article" aria-labelledby="most-traffic">
              <h3 id="most-traffic">Most Traffic</h3>
              <div className="metric-value">
                {renderTraffic(stats.mostTraffic)}
              </div>
            </div>

            {/* Least Traffic */}
            <div className="metric-card" role="article" aria-labelledby="least-traffic">
              <h3 id="least-traffic">Least Traffic</h3>
              <div className="metric-value">
                {renderTraffic(stats.leastTraffic)}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Overview;
