import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiMap, FiPlayCircle, FiSettings, FiLogOut } from 'react-icons/fi';
import '../style.css';
import SessionReplay from './SessionReplay';
import Settings from './Settings';
import Overview from './Overview';
import Heatmap from './Heatmap';
import DashboardHeader from '../components/DashboardHeader';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import SimpleBarChart from './barChart.js';
import api from '../utils/api';

export const Dashboard = () => {
  const { getCurrentUserId, isLoading, logout } = useAuth();
  const navigate = useNavigate();

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
  const [page, setPage] = useState("overview");

  // Ensure userId is fetched and metrics are loaded
  useEffect(() => {
    const fetchData = async () => {
      const userId = getCurrentUserId();
      if (userId) {
        try {
          const response = await api.get('/statistics', { params: { userId } });
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
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      }
    };

    if (!isLoading) {
      fetchData();
    }
  }, [isLoading, getCurrentUserId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!getCurrentUserId()) {
    return <p>Error: userId not available</p>;
  }

  const mostTrafficData = metrics.mostTraffic.map(item => ({
    name: item.pageUrl,
    visitors: item._count.pageUrl
  }));

  const leastTrafficData = metrics.leastTraffic.map(item => ({
    name: item.pageUrl,
    visitors: item._count.pageUrl
  }));

  const handleLogout = () => {
    logout();
    navigate('/app/login');
  };

  const renderContent = () => {
    switch (page) {
      case "overview":
        return <ProtectedRoute element={<Overview />} />;
      case "heatmap":
        return <ProtectedRoute element={<Heatmap />} />;
      case "sessionReplay":
        return <ProtectedRoute element={<SessionReplay />} />;
      case "settings":
        return <ProtectedRoute element={<Settings />} />;
      default:
        return <ProtectedRoute element={<Overview />} />;
    }
  };

  const NavItem = ({ icon: Icon, label, pageName, currentPage, setPage }) => (
    <li className={currentPage === pageName ? 'active' : ''}>
      <button onClick={() => setPage(pageName)} aria-label={`Go to ${label}`}>
        <Icon className="sidebar-icon" aria-hidden="true" />
        <span className="sidebar-text">{label}</span>
      </button>
    </li>
  );

  return (
    <div className="dashboard-container">
      <DashboardHeader className="dashboard-header" />
      <div className="dashboard-content">
        <aside className="dashboard-sidebar" role="complementary" aria-label="Sidebar Navigation">
          <div className="sidebar-brand">W.V</div>
          <nav role="navigation" aria-label="Main Navigation">
            <ul>
              <NavItem icon={FiGrid} label="Overview" pageName="overview" currentPage={page} setPage={setPage} />
              <NavItem icon={FiMap} label="Heatmap" pageName="heatmap" currentPage={page} setPage={setPage} />
              <NavItem icon={FiPlayCircle} label="Session Replay" pageName="sessionReplay" currentPage={page} setPage={setPage} />
              <NavItem icon={FiSettings} label="Settings" pageName="settings" currentPage={page} setPage={setPage} />
            </ul>
          </nav>
          <div className="sidebar-logout">
            <button onClick={handleLogout} className="logout-button" aria-label="Logout">
              <FiLogOut className="sidebar-icon" aria-hidden="true" />
              <span className="sidebar-text">Logout</span>
            </button>
          </div>
        </aside>
        <main className="dashboard-main" role="main" id="main-content">
          {renderContent()} {/* Call the updated renderContent */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
