
import React, { useState, useEffect } from 'react';
import {
  FiUsers, FiMousePointer, FiClock, FiSmartphone, FiMonitor,
  FiTrendingUp, FiTrendingDown, FiList, FiActivity, FiBarChart2,
  FiPieChart, FiAlertCircle, FiZap, FiChevronsRight, FiServer, FiChrome, FiCode
} from 'react-icons/fi';
import FilterSelector from '../components/FilterSelector';
import ExportMetrics from "../components/ExportMetrics";
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// --- Visual Helper Components ---
const InsightItem = ({ icon: Icon, value, label, subLabel }) => ( <div className="insight-item"> <div className="insight-icon-wrapper"> <Icon /> </div> <div className="insight-info"> <span className="insight-value">{value}</span> <span className="insight-label">{label} {subLabel && `(${subLabel})`}</span> </div> </div> );
const BarChartItem = ({ label, value, percentage, maxValue, barColor = 'var(--primary-color)' }) => { const barWidth = maxValue > 0 ? (value / maxValue * 100) : 0; return ( <div className="bar-item" title={`${label}: ${value} ${percentage ? `(${percentage})` : ''}` }> <span className="bar-label">{label}</span> <div className="bar-fill-container"> <div className="bar-fill" style={{ width: `${barWidth}%`, backgroundColor: barColor }}></div> </div> <span className="bar-value">{value} {percentage && <small>({percentage})</small>}</span> </div> ); };
const StyledListItem = ({ dotColor, label, value, percentage }) => ( <div className="list-item"> <span className="list-dot" style={{ backgroundColor: dotColor }}></span> <span className="list-label" title={label}>{label}</span> <span className="list-value"> {value} {percentage != null && <span className="percentage">({percentage})</span>} </span> </div> );
const SimpleMetric = ({ title, value }) => ( <div className="metric-item"> <h4 className="metric-item-title">{title}</h4> <p className="metric-item-value">{value ?? '0'}</p> </div> );

// Color mapping
const VISUAL_COLORS = ['#0d6efd', '#6f42c1', '#d63384', '#fd7e14', '#198754', '#20c997', '#6c757d'];
const getVisualColor = (index) => VISUAL_COLORS[index % VISUAL_COLORS.length];

// URL Formatting Function
const formatPageUrl = (url) => { if (!url) return 'Unknown Page'; try { if (url.startsWith('file:///')) { const pathParts = url.split(/[\\/]/); return pathParts[pathParts.length - 1] || url; } const parsedUrl = new URL(url); return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash || '/'; } catch (e) { return url; } };


// Main Overview Component
const Overview = () => {
  // State Variables
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth Context
  const { userId } = useAuth();
  const effectiveUserId = userId || "1";

  // Snippet definition
  const snippet = `<script type="module" data-webvitals-widget src="http://localhost/widget/widget.js" data-user-id="${effectiveUserId}" defer></script>`;

  // Formatting Helpers
  const formatPercent = (str) => str || '0%';
  const formatCount = (val) => val?.count ?? 0;
  // Helper specifically for numbers that might need toFixed or be 0
  const formatNumber = (value, fixed = null, suffix = '') => {
    const num = Number(value); // Attempt conversion
    if (typeof num === 'number' && !isNaN(num)) {
        return (fixed !== null ? num.toFixed(fixed) : num) + suffix;
    }
    return '0' + suffix; // Default to 0 if not a valid number
  };


  // === Data Fetching Logic ===
  const fetchStats = async () => { setLoading(true); setError(null); try { const isFiltering = Object.values(filters).some(v => v && v.trim() !== ''); const endpoint = isFiltering ? '/filteredStatistics' : '/statistics'; const params = { userId: effectiveUserId }; if (isFiltering) { const usedFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value && value.trim())); for (const [key, value] of Object.entries(usedFilters)) { const paramKey = key === 'startTime' ? 'startDate' : key === 'endTime' ? 'endDate' : key; params[paramKey] = value; } } /*console.log(`Fetching stats from ${endpoint} with params:`, params);*/ const response = await api.get(endpoint, { params }); setStats(response.data || null); } catch (err) { console.error('Error fetching statistics:', err); const errorMessage = err.response?.data?.message || err.message || 'Failed to load statistics.'; setError(errorMessage); setStats(null); } finally { setLoading(false); } };
  // === Filter Form Handling ===
  const handleFilterChange = (e) => { const { id, value } = e.target; setFilters(prevFilters => ({ ...prevFilters, [id]: value })); };
  const applyFilters = (e) => { e.preventDefault(); fetchStats(filters); };
  // === Initial Data Fetch ===
  useEffect(() => { fetchStats({}); }, [filters, effectiveUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  // === RENDER FUNCTIONS ===
  const renderClickInsights = (clickStats) => { if (!clickStats || Object.keys(clickStats).length === 0) return <p className="no-data">No click data</p>; const map = { 'Rage_Click': FiAlertCircle, 'Dead_Click': FiMousePointer, 'Quick_Back': FiChevronsRight }; return <div className="insight-list">{Object.entries(clickStats).map(([k,v]) => <InsightItem key={k} icon={map[k] || FiZap} value={formatPercent(v.percentage)} label={k.replace(/_/g,' ')} subLabel={`${formatCount(v)} sess.`}/>)}</div>; };
  const renderUserDemographics = (extraData) => { if (!extraData) return <p className="no-data">N/A</p>; const b=extraData.browserUsage||[]; const o=extraData.operatingSystemUsage||[]; const m=extraData.isMobileUsage||[]; const l=5; return (<>{b.length>0&&(<> <h5 className="list-subsection-title">Browser</h5> <div className="styled-list">{b.slice(0,l).map((i,x)=><StyledListItem key={x} dotColor={getVisualColor(x)} label={i.browserName||'?'} value={formatCount(i)} percentage={formatPercent(i.percentage)}/>)} {b.length>l&&<p className="more-link">...</p>} </div> </>)} {o.length>0&&(<> <h5 className="list-subsection-title">OS</h5> <div className="styled-list">{o.slice(0,l).map((i,x)=><StyledListItem key={x} dotColor={getVisualColor(x+b.length)} label={i.operatingSystem||'?'} value={formatCount(i)} percentage={formatPercent(i.percentage)}/>)} {o.length>l&&<p className="more-link">...</p>} </div> </>)} {m.length>0&&(<> <h5 className="list-subsection-title">Device</h5> <div className="styled-list">{m.map((i,x)=><StyledListItem key={x} dotColor={i.isMobile?getVisualColor(0):getVisualColor(1)} label={i.isMobile?'Mobile':'Desktop'} value={formatCount(i)} percentage={formatPercent(i.percentage)}/>)} </div> </>)} </>); };
  const renderTrafficList = (trafficData=[], isBar=false) => { if (!trafficData||trafficData.length===0) return <p className="no-data">N/A</p>; const items = trafficData.map(i=>({l:formatPageUrl(i.pageUrl||i.referrer),c:i.count??i._count?.pageUrl??0,p:i.percentage})); if(isBar) items.sort((a,b)=>b.c-a.c); const max=isBar?Math.max(...items.map(i=>i.c),0):0; const lim=7; return isBar?(<div className="bar-chart-list">{items.slice(0,lim).map((i,x)=><BarChartItem key={x} label={i.l} value={i.c} percentage={formatPercent(i.p)} maxValue={max} barColor={getVisualColor(x)}/>)} {items.length>lim&&<p className="more-link">...</p>} </div>) :(<div className="styled-list">{items.slice(0,lim).map((i,x)=><StyledListItem key={x} dotColor={getVisualColor(x)} label={i.l} value={i.c} percentage={null}/>)} {items.length>lim&&<p className="more-link">...</p>}</div>); };


  // --- JSX Rendering ---
  return (
    <div className="overview-container">
      <h2 className="section-label">Filter</h2>
      <div className="filters-bar">
        <FilterSelector onApplyFilters={setFilters} oncli={fetchStats} />
      </div>

      <h2 className="section-label">Overview</h2>
      <div className="stats-bundles-grid">
         {loading && <div className="loading-message" style={{gridColumn: '1 / -1'}}>Loading...</div>}
         {!loading && error && <div className="error-message" style={{gridColumn: '1 / -1'}}>{error}</div>}
         {!loading && !error && stats && (
           <>
             {/* Bundle: Core Metrics - ** APPLYING formatNumber ** */}
             <div className="metric-bundle-card">
               <h3 className="bundle-title">Core Metrics</h3>
               <div className="bundle-content grid-3">
                 {/* Use formatNumber without fixed points for whole numbers */}
                 <SimpleMetric title="Total Sessions" value={formatNumber(stats.totalSessions)} />
                 {/* Use formatNumber WITH fixed point for averages */}
                 <SimpleMetric title="Avg Pages/Session" value={formatNumber(stats.avgPagesPerSession, 1)} />
                 <SimpleMetric title="Live Users" value={formatNumber(stats.liveUsers)} />
               </div>
             </div>
              {/* Bundle: Performance - ** APPLYING formatNumber ** */}
              <div className="metric-bundle-card">
                <h3 className="bundle-title">Performance</h3>
                <div className="bundle-content grid-2">
                  {/* Use formatNumber with fixed point and suffix */}
                  <SimpleMetric title="Avg Session Duration" value={formatNumber(stats.avgTotalTime, 1, 's')} />
                  <SimpleMetric title="Avg Time / Page" value={formatNumber(stats.avgTimePerPage, 1, 's')} />
                </div>
              </div>
              {/* Other Bundles (unchanged rendering call) */}
               <div className="metric-bundle-card"> <h3 className="bundle-title">Engagement Insights</h3> {renderClickInsights(stats.clickStatistics)} </div>
               <div className="metric-bundle-card large-card"> <h3 className="bundle-title">User Demographics</h3> {renderUserDemographics(stats.extraData)} </div>
               <div className="metric-bundle-card"> <h3 className="bundle-title">Top Referrers</h3> {renderTrafficList(stats.extraData?.referrerUsage, true)} </div>
               <div className="metric-bundle-card"> <h3 className="bundle-title">Most Visited Pages</h3> {renderTrafficList(stats.mostTraffic, true)} </div>
               <div className="metric-bundle-card"> <h3 className="bundle-title">Least Visited Pages</h3> {renderTrafficList(stats.leastTraffic, false)} </div>
           </>
         )}
          {!loading && !error && !stats && ( <div className="no-data" style={{gridColumn: '1 / -1'}}>No statistics data available.</div> )}
      </div>

      {/* Snippet Card */}
      {!loading && !error && (
            <div className="widget-card snippet-card">
                <h3 className="bundle-title">Embed Widget</h3>
                <p>Insert this snippet into your web page's HTML:</p>
                <input type="text" readOnly value={snippet} onClick={(e) => e.target.select()} aria-label="Widget Snippet"/>
            </div>
        )}

       {/* Export tools section */}
       {!loading && !error && stats && ( <div className="export-metrics-container"> <h2 className="section-label">Export</h2> <ExportMetrics data={stats} /> </div> )}
     </div>
  );
};

export default Overview;
