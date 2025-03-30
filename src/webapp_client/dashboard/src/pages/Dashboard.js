import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import FilterSelector from "../components/FilterSelector";
import SimpleBarChart from './barChart.js'; 
import '../style.css';
import api from '../utils/api';
import axios from 'axios';
// import { useAuth } from ../ conetxt

export const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    mostTraffic: [],
    leastTraffic: [],
    totalSessions: 0,
    avgPagesPerSession: 0,
    liveUsers: 0,
    avgTotalTime: 0,
    clickStatistics: { rage_click: { count: 0, percentage: '0.00%' }, dead_click: { count: 0, percentage: '0.00%' }, quick_back: { count: 0, percentage: '0.00%' } },
    avgTimePerPage: 0,
    extraData: { browserUsage: [], operatingSystemUsage: [], isMobileUsage: [] }
  });  
  // const {getUserId} = useAuth()
  


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  const prepareChartData = (trafficData) => {
    return trafficData.map((item) => ({
      name: item.pageUrl,
      visitors: item._count.pageUrl
    }));
  };

  
  useEffect(() => {
    const fetchData = async() => {
      try {
        console.log(metrics)
        console.log(metrics.avgPagesPerSession)
        const userId = 'id3';
        const response = await api.get('/statistics', {
          params: {
            userId
          }
        });
        console.log(response)
        
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          mostTraffic: response.data.mostTraffic,
          leastTraffic: response.data.leastTraffic,
          totalSessions: response.data.totalSessions,
          avgPagesPerSession: response.data.avgPagesPerSession,
          liveUsers: response.data.liveUsers,
          avgTotalTime: response.data.avgTotalTime,
          clickStatistics: response.data.clickStatistics,
          avgTimePerPage: response.data.avgTimePerPage,
          extraData: response.data.extraData
        }));
        console.log(metrics)
        console.log(metrics.avgPagesPerSession)

        setLoading(false);
      } catch (err){
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, []); 
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

  if (loading){
    return <p>Loading...</p>;
  }
  if (error){
    return <p>Error: {error}</p>;
  }

  const mostTrafficData = prepareChartData(metrics.mostTraffic);
  const leastTrafficData = prepareChartData(metrics.leastTraffic);
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
          <div className="cards-container">

          {/* <div>
              <p>Page Load Time</p>
              <div className="collection-card">
              <p className='average'>11</p>
                <p className='average'>average</p>
              </div>
            </div> */}
          

            <div>
              <p>Click Statistics</p>
              <div className="click-statistics-container">
                <div className="click-statistics-item">
                  <p className="stat-name">Rage Clicks</p>
                  <p className="stat-count">{metrics.clickStatistics.rage_click.count}</p>
                  <p className="stat-percentage">{metrics.clickStatistics.rage_click.percentage}</p>
                </div>
                <div className="click-statistics-item">
                  <p className="stat-name">Dead Clicks</p>
                  <p className="stat-count">{metrics.clickStatistics.dead_click.count}</p>
                  <p className="stat-percentage">{metrics.clickStatistics.dead_click.percentage}</p>
                </div>
                <div className="click-statistics-item">
                  <p className="stat-name">Quick Back</p>
                  <p className="stat-count">{metrics.clickStatistics.quick_back.count}</p>
                  <p className="stat-percentage">{metrics.clickStatistics.quick_back.percentage}</p>
                </div>
              </div>
            </div>

            <div>
              <p>Pages Per Session</p>
              <div className="collection-card">
              <p className='average'>{metrics.avgPagesPerSession}</p>
                <p className='average'>average</p>
              </div>
            </div>

            <div>
              <p>Total Time Spent</p>
              <div className="collection-card">
              <p className='average'>{metrics.avgTotalTime}</p>
                <p className= "average">average</p>
              </div>
            </div>

            <div>
              <p>Time Spent Per Page</p>
              <div className="collection-card">
              <p className='average'>{metrics.avgTimePerPage}</p>
                <p className='average'>average</p>
              </div>
            </div>
            
            <div>
              <p>Live Users</p>
              <div className="collection-card">
                <p className='average'>{metrics.liveUsers}</p>
              </div>
            </div>

            <div>
              <p>Total Sessions</p>
              <div className="collection-card">
                <p className='average'>{metrics.totalSessions}</p>
              </div>
            </div>


            <div>

            </div>
          </div>
          <div className="cards-container">
              <div className="collection-card" id="collectionBar">
              <p> Most Traffic Pages</p>
              <div id="bar">
              <SimpleBarChart data={mostTrafficData} />
              </div>
              </div>


              <div className="collection-card" id="collectionBar">
              <p>Least Traffic Pages</p>
              <div id="bar">
              <SimpleBarChart data={leastTrafficData} />
              </div>
              </div>
              

              
            </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;