// src/pages/Overview.js
import React, { useState, useEffect } from 'react';
import {
  FiUsers, FiMousePointer, FiClock,
  FiTrendingUp, FiTrendingDown, FiList,
  FiAlertCircle, FiZap, FiChevronsRight,
} from 'react-icons/fi';
// Recharts Imports
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import FilterSelector from '../components/FilterSelector';
import ExportMetrics from "../components/ExportMetrics";
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
// Style.css assumed global

// --- Visual Helper Components ---
const InsightItem = ({ icon: Icon, value, label, subLabel }) => ( <div className="insight-item"> <div className="insight-icon-wrapper"> <Icon /> </div> <div className="insight-info"> <span className="insight-value">{value}</span> <span className="insight-label">{label} {subLabel && `(${subLabel})`}</span> </div> </div> );
const BarChartItem = ({ label, value, percentage, barColor = 'var(--primary-color)' }) => { const barWidth = percentage ?? 0; const displayPercentage = percentage != null ? percentage.toFixed(1) + '%' : ''; return ( <div className="bar-item" title={`${label}: ${value} ${displayPercentage ? `(${displayPercentage})` : ''}` }> <span className="bar-label">{label}</span> <div className="bar-fill-container"> <div className="bar-fill" style={{ width: `${barWidth}%`, backgroundColor: barColor }}></div> </div> <span className="bar-value">{value} {displayPercentage && <small>({displayPercentage})</small>}</span> </div> ); };
const StyledListItem = ({ dotColor, label, value, percentage }) => { const displayPercentage = percentage != null ? percentage.toFixed(1) + '%' : ''; return ( <div className="list-item"> <span className="list-dot" style={{ backgroundColor: dotColor }}></span> <span className="list-label" title={label}>{label}</span> <span className="list-value"> {value} {displayPercentage && <span className="percentage">({displayPercentage})</span>} </span> </div> ); };
const SimpleMetric = ({ title, value }) => ( <div className="metric-item"> <h4 className="metric-item-title">{title}</h4> <p className="metric-item-value">{value ?? '0'}</p> </div> );

// --- Color mapping ---
const VISUAL_COLORS = ['#0d6efd', '#6f42c1', '#d63384', '#fd7e14', '#198754', '#20c997', '#6c757d'];
const getVisualColor = (index) => VISUAL_COLORS[index % VISUAL_COLORS.length];

// --- URL Formatting ---
const formatPageUrl = (url, maxLength = 30) => { // Added maxLength
    if (!url) return 'Unknown Page';
    try {
        let formattedUrl;
        if (url.startsWith('file:///')) {
            const pathParts = url.split(/[\\/]/);
            formattedUrl = pathParts[pathParts.length - 1] || url;
        } else {
            const parsedUrl = new URL(url);
            formattedUrl = parsedUrl.pathname + parsedUrl.search + parsedUrl.hash || '/';
        }
        // Truncate if needed
        if (formattedUrl.length > maxLength) {
            return formattedUrl.substring(0, maxLength - 3) + '...';
        }
        return formattedUrl;
    } catch (e) {
        // Truncate original url if parsing fails
        if (url.length > maxLength) {
             return url.substring(0, maxLength - 3) + '...';
        }
        return url;
    }
};

// --- Recharts Tooltip ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="recharts-custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="value">{`Count : ${payload[0].value}`}</p>
          {/* You can access other data from payload[0].payload if needed */}
        </div>
      );
    }
    return null;
};

// --- Main Overview Component ---
const Overview = () => {
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();
  const effectiveUserId = userId || "1";
  const snippet = `<script type="module" data-webvitals-widget src="http://localhost/widget/widget.js" data-user-id="${effectiveUserId}" defer></script>`;

  // Formatting
  const formatPercent = (val) => (typeof val === 'number' ? val.toFixed(1) + '%' : (val || '0%'));
  const formatCount = (item) => item?.count ?? item?._count?.pageUrl ?? 0;
  const formatNumber = (value, fixed = null, suffix = '') => { const num = Number(value); if (typeof num === 'number' && !isNaN(num)) { return (fixed !== null ? num.toFixed(fixed) : num) + suffix; } return (fixed !== null ? '0.'.padEnd(2 + fixed, '0') : '0') + suffix; };

  // Data Fetching
  const fetchStats = async () => { setLoading(true); setError(null); try { const activeFilters = Object.entries(filters).filter(([, value]) => value && typeof value === 'string' && value.trim() !== '').reduce((acc, [key, value]) => { acc[key] = value.trim(); return acc; }, {}); const isFiltering = Object.keys(activeFilters).length > 0; const endpoint = isFiltering ? '/filteredStatistics' : '/statistics'; const params = { userId: effectiveUserId, ...activeFilters }; const response = await api.get(endpoint, { params }); setStats(response.data || null); } catch (err) { console.error('Error fetching statistics:', err); const errorMessage = err.response?.data?.message || err.message || 'Failed to load statistics.'; setError(errorMessage); setStats(null); } finally { setLoading(false); } };
  // Filter Handling
  const handleApplyFiltersFromSelector = (newFilters) => { setFilters(newFilters); };
  // Effect
  useEffect(() => { fetchStats(); }, [filters, effectiveUserId]);

  // === RENDER FUNCTIONS ===
  const renderClickInsights = (clickStats) => { if (!clickStats || Object.keys(clickStats).length === 0) return <p className="no-data">No click data</p>; const map = { 'Rage_Click': FiAlertCircle, 'Dead_Click': FiMousePointer, 'Quick_Back': FiChevronsRight }; return ( <div className="insight-list"> {Object.entries(clickStats).map(([k, v = {}]) => ( <InsightItem key={k} icon={map[k] || FiZap} value={formatPercent(v.percentage)} label={k.replace(/_/g, ' ')} subLabel={`${formatCount(v)} sess.`}/> ))} </div> ); };

  // -- User Demographics (Chart + List) --
  const renderUserDemographics = (extraData) => {
    if (!extraData || (!extraData.browserUsage?.length && !extraData.operatingSystemUsage?.length && !extraData.isMobileUsage?.length)) { return <p className="no-data">N/A</p>; }
    const browsers = extraData.browserUsage || [];
    const os = extraData.operatingSystemUsage || [];
    const mobile = extraData.isMobileUsage || [];
    const limit = 5; // Limit for lists below chart
    const totalBrowserCount = browsers.reduce((sum, item) => sum + formatCount(item), 0);
    const totalOsCount = os.reduce((sum, item) => sum + formatCount(item), 0);
    const totalMobileCount = mobile.reduce((sum, item) => sum + formatCount(item), 0);

    // Browser chart data (Top 5)
    const browserChartData = browsers
      .map(item => ({ name: item.browserName || '?', value: formatCount(item) }))
      .filter(item => item.value > 0).sort((a, b) => b.value - a.value).slice(0, limit);

    return (
      <div className="chart-plus-list-container"> {/* Wrapper for chart and lists */}
        {/* Browser Bar Chart */}
        {browserChartData.length > 0 && (
             <div className="recharts-chart-container demographic-chart">
                <ResponsiveContainer width="100%" height={180}> {/* Slightly smaller height */}
                    <BarChart data={browserChartData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}> {/* Adjust margins */}
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} interval={0} angle={-15} textAnchor="end" height={40} /* Tilt labels slightly */ />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-hover)' }} wrapperStyle={{ zIndex: 10 }}/>
                        <Bar dataKey="value" name="Count">
                            {browserChartData.map((entry, index) => ( <Cell key={`cell-browser-${index}`} fill={getVisualColor(index)} /> ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )}

        {/* Always render lists below */}
        <div className="lists-below-chart">
            {browsers.length > 0 && ( <> <h5 className="list-subsection-title">Browser Details</h5> <div className="styled-list"> {browsers.slice(0, limit).map((i, x) => ( <StyledListItem key={`browser-list-${x}`} dotColor={getVisualColor(x)} label={i.browserName || '?'} value={formatCount(i)} percentage={totalBrowserCount > 0 ? (formatCount(i) / totalBrowserCount) * 100 : 0} /> ))} {browsers.length > limit && <p className="more-link">...</p>} </div> </> )}
            {os.length > 0 && ( <> <h5 className="list-subsection-title">OS</h5> <div className="styled-list"> {os.slice(0, limit).map((i, x) => ( <StyledListItem key={`os-list-${x}`} dotColor={getVisualColor(x + browsers.length)} label={i.operatingSystem || '?'} value={formatCount(i)} percentage={totalOsCount > 0 ? (formatCount(i) / totalOsCount) * 100 : 0} /> ))} {os.length > limit && <p className="more-link">...</p>} </div> </> )}
            {mobile.length > 0 && ( <> <h5 className="list-subsection-title">Device Type</h5> <div className="styled-list"> {mobile.map((i, x) => ( <StyledListItem key={`mobile-list-${x}`} dotColor={i.isMobile ? getVisualColor(0) : getVisualColor(1)} label={i.isMobile ? 'Mobile' : 'Desktop'} value={formatCount(i)} percentage={totalMobileCount > 0 ? (formatCount(i) / totalMobileCount) * 100 : 0} /> ))} </div> </> )}
        </div>
      </div>
    );
  };

 // -- Traffic List Function (Modified to include chart AND list for "mostVisited") --
 const renderTrafficList = (trafficData = [], type = "default", limit = 7) => {
    if (!trafficData || trafficData.length === 0) return <p className="no-data">N/A</p>;

    // Process items first
    const items = trafficData.map(i => ({
        fullLabel: (i.pageUrl || i.referrer || 'Unknown'), // Store full URL for tooltip
        displayLabel: formatPageUrl(i.pageUrl || i.referrer || 'Unknown'), // Formatted/Truncated label
        count: formatCount(i)
    })).filter(item => item.displayLabel && item.count > 0);

    if (items.length === 0) return <p className="no-data">N/A</p>;
    const totalCount = items.reduce((sum, item) => sum + item.count, 0);

    // Prepare chart data (only needed for most visited)
    let chartData = null;
    if (type === "mostVisited") {
        items.sort((a, b) => b.count - a.count); // Sort items for list rendering too
        chartData = items.slice(0, limit).map(item => ({
            name: item.displayLabel,
            value: item.count,
            fullUrl: item.fullLabel // Pass full URL for tooltip if needed
        }));
    } else if (type === "referrers") {
         items.sort((a, b) => b.count - a.count); // Sort for bar list
    }

    return (
        <div className="chart-plus-list-container"> {/* Wrapper */}
            {/* Render Recharts Bar Chart ONLY for "mostVisited" */}
            {type === "mostVisited" && chartData && chartData.length > 0 && (
                <div className="recharts-chart-container page-chart">
                    <ResponsiveContainer width="100%" height={180}>
                         {/* Use Vertical Layout */}
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 15, left: 5, bottom: 5 }} barGap={4} barSize={12}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                             <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-secondary)', width: 70}} /* Allow space for labels */ interval={0} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-hover)' }} wrapperStyle={{ zIndex: 10 }}/>
                            <Bar dataKey="value" name="Visits" radius={[0, 4, 4, 0]}> {/* Slightly rounded bars */}
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-mv-${index}`} fill={getVisualColor(index+2)} /> // Different color offset
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

             {/* Render EITHER the custom BarList OR the StyledList below the chart (or standalone) */}
            <div className="lists-below-chart">
                {type === "referrers" ? (
                     // Referrers: Custom Bar List
                     <div className="bar-chart-list"> {items.slice(0, limit).map((item, x) => ( <BarChartItem key={`Referrers-bar-${x}`} label={item.displayLabel} value={item.count} percentage={totalCount > 0 ? (item.count / totalCount) * 100 : 0} barColor={getVisualColor(x+2)} /> ))} {items.length > limit && <p className="more-link">...</p>} </div>
                 ) : type === "mostVisited" ? (
                     // Most Visited: Now render StyledList below chart for details
                      <>
                        <h5 className="list-subsection-title">Page Details</h5>
                        <div className="styled-list"> {items.slice(0, limit).map((item, x) => ( <StyledListItem key={`mv-list-${x}`} dotColor={getVisualColor(x+2)} label={item.displayLabel} value={item.count} percentage={totalCount > 0 ? (item.count / totalCount) * 100 : 0} /> ))} {items.length > limit && <p className="more-link">...</p>} </div>
                     </>
                 ) : (
                     // Least Visited or Default: Styled List
                     <div className="styled-list"> {items.slice(0, limit).map((item, x) => ( <StyledListItem key={`${type}-list-${x}`} dotColor={getVisualColor(x+4)} label={item.displayLabel} value={item.count} percentage={totalCount > 0 ? (item.count / totalCount) * 100 : 0} /> ))} {items.length > limit && <p className="more-link">...</p>} </div>
                )}
             </div>
        </div>
    );
};

  // --- JSX ---
  return (
     <div className="overview-container">
        {/* Snippet section */}
        {!loading && !error && ( <div className="widget-card snippet-card"> <h3 className="bundle-title">Embed Widget</h3> <p>Insert this snippet into your web page's HTML:</p> <input type="text" readOnly value={snippet} onClick={(e) => e.target.select()} aria-label="Widget Snippet"/> </div> )}
 
         {/* Filter section */}
         <h2 className="section-label">Filter</h2>
         <div className="filters-bar"> <FilterSelector onApplyFilters={handleApplyFiltersFromSelector} /> </div>
         <h2 className="section-label">Overview</h2>
         <div className="stats-bundles-grid">
              {loading && <div className="loading-message" style={{gridColumn: '1 / -1'}}>Loading...</div>}
              {!loading && error && <div className="error-message" style={{gridColumn: '1 / -1'}}>{error}</div>}
              {!loading && !error && stats && (
                  <>
                      <div className="metric-bundle-card"> <h3 className="bundle-title">Core Metrics</h3> <div className="bundle-content grid-3"> <SimpleMetric title="Total Sessions" value={formatNumber(stats.totalSessions)} /> <SimpleMetric title="Avg Pages/Session" value={formatNumber(stats.avgPagesPerSession, 1)} /> <SimpleMetric title="Live Users" value={formatNumber(stats.liveUsers)} /> </div> </div>
                      <div className="metric-bundle-card"> <h3 className="bundle-title">Performance</h3> <div className="bundle-content grid-2"> <SimpleMetric title="Avg Session Duration" value={formatNumber(stats.avgTotalTime, 1, 's')} /> <SimpleMetric title="Avg Time / Page" value={formatNumber(stats.avgTimePerPage, 1, 's')} /> </div> </div>
                      <div className="metric-bundle-card"> <h3 className="bundle-title">Engagement Insights</h3> {renderClickInsights(stats.clickStatistics)} </div>
                      {/* Pass extraData correctly */}
                      <div className="metric-bundle-card large-card"> <h3 className="bundle-title">User Demographics</h3> <div className="bundle-content"> {renderUserDemographics(stats?.extraData)} </div> </div>
                      <div className="metric-bundle-card"> <h3 className="bundle-title">Top Referrers</h3> {renderTrafficList(stats?.extraData?.referrerUsage, "referrers", 5)} </div>
                      {/* Pass mostTraffic correctly */}
                      <div className="metric-bundle-card"> <h3 className="bundle-title">Most Visited Pages</h3> {renderTrafficList(stats?.mostTraffic, "mostVisited", 7)} </div>
                      {/* Pass leastTraffic correctly */}
                      <div className="metric-bundle-card"> <h3 className="bundle-title">Least Visited Pages</h3> {renderTrafficList(stats?.leastTraffic, "leastVisited", 5)} </div>
                  </>
              )}
              {!loading && !error && !stats && ( <div className="no-data" style={{gridColumn: '1 / -1'}}>No statistics data available.</div> )}
         </div>
          {/* Export section */}
           {!loading && !error && ( <div className="widget-card snippet-card"> <h3 className="bundle-title">Embed Widget</h3> <p>Insert this snippet into your web page's HTML:</p> <input type="text" readOnly value={snippet} onClick={(e) => e.target.select()} aria-label="Widget Snippet"/> </div> )}
          
           {!loading && !error && stats && ( <div className="export-metrics-container"> <h2 className="section-label">Export</h2> <ExportMetrics data={stats} /> </div> )}
     </div>
   );
};

export default Overview;