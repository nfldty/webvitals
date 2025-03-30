import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import SessionReplay from './pages/SessionReplay';
import Heatmap from './pages/Heatmap';
import ProtectedRoute from './components/ProtectedRoute';  // Import the ProtectedRoute
import { ThemeProvider } from './context/ThemeContext';

const router = createBrowserRouter([
  {
    path: 'app/dashboard',
    element: <ProtectedRoute element={<Dashboard />} />,  // Protect this route
    //element: <Dashboard />,
  },
  {
    path: 'app/register',
    element: <Register />,
  },
  {
    path: 'app/login',
    element: <Login />,
  },
  {
    path: 'app/heatmap',
    element: <ProtectedRoute element={<Heatmap />} />,  // Protect this route
  },
  {
    path: 'app/session-replay',
    element: <ProtectedRoute element={<SessionReplay />} />,  // Protect this route
    
  },
  {
    path: '/*',
    element: <Login />,  // Default route
  },
]);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div role="application">
          <div className="app" role="main">
            <div className="container" role="region" aria-label="content">
              <RouterProvider router={router} />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
