import React from 'react';
// Removed Outlet import as we're not using the nested layout approach now
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Keep existing
import { ThemeProvider } from './context/ThemeContext'; // Keep existing & use globally
// Import Page components
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import SessionReplay from './pages/SessionReplay';
import Heatmap from './pages/Heatmap';
// Import ProtectedRoute
import ProtectedRoute from './components/ProtectedRoute';  // Keep existing

// --- Define Routes (No per-route ThemeProvider needed anymore) ---
const router = createBrowserRouter([
  {
    // Protected Dashboard Route
    path: '/app/dashboard',
    element: <ProtectedRoute element={<Dashboard />} />, // Element is just the page now
  },
  {
    // Protected Session Replay
    path: '/app/session-replay',
    element: <ProtectedRoute element={<SessionReplay />} />, // Element is just the page now
  },
  {
    // Protected Heatmap
    path: '/app/heatmap',
    element: <ProtectedRoute element={<Heatmap />} />, // Element is just the page now
  },
  {
    // --- Authentication routes ---
    path: '/app/register',
    element: <Register />, // Render Register page directly
  },
  {
    path: '/app/login',
    element: <Login />,   // Render Login page directly
  },
  {
    // Fallback route - Send to Login
    path: '*', // Catch-all must be last
    element: <Login />, // Or <Navigate to="/app/login" replace />
  },
]);

// --- App Component (Wrap RouterProvider with ThemeProvider) ---
function App() {
  return (
    <AuthProvider>
      <ThemeProvider> {/* <--- Global ThemeProvider wraps RouterProvider */}
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;