import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DashboardHeader from '../components/DashboardHeader'; // Keep the specific header component import


export const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  // --- Keep the new handleSubmit logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username || !password) {
      setErrorMessage('Username and Password are required!');
      return;
    }
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.status === 200) {
        navigate('/app/dashboard');
      }
      // No explicit else needed if error status codes throw exceptions
    } catch (error) {
      console.error('Login error:', error);
      // Use a slightly improved error message handling
      const apiError = error.response?.data?.message || 'Failed to log in. Please check credentials.';
      setErrorMessage(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Use the CSS wrapper structure
    <div className="auth-page-wrapper">
      {/* Use the imported DashboardHeader */}
      {/* We need to decide if DashboardHeader should be styled by .auth-header */}
      {/* or if it already has styles. Assuming it's minimal or needs styling: */}
      <DashboardHeader className="auth-header" /> {/* Pass className for potential styling */}

      {/* Main content area for centering */}
      <main className="auth-content-area">
        {/* The actual card using the specific class name */}
        <div className="auth-card">
          {/* Title styled by CSS */}
          {/* Use className from new JS if CSS doesn't target h1 directly */}
          <h1 className="page-heading">Welcome Back</h1>

          {/* Error message styled by CSS */}
          {/* Use className from new JS for content, styled by .error-message if available */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Form: Keep layout classes, submit logic */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}> {/* Kept flex/gap */}
             {/* Input Group: Keep structure if CSS uses it, remove if targeting input directly */}
            <div className="input-group">
               {/* Use label from new JS, style with CSS */}
              <label htmlFor="username" className="input-label">Username</label>
              {/* Input: Rely on CSS, remove 'input-field' */}
              <input
                id="username"
                type="text"
                placeholder="Enter your username" // Use new placeholder
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
               <label htmlFor="password" className="input-label">Password</label>
               {/* Input: Rely on CSS, remove 'input-field' */}
              <input
                id="password"
                type="password"
                placeholder="Enter your password" // Use new placeholder
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Button: Rely on CSS, remove 'btn' class */}
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {/* Link text: Use CSS, remove 'link-text' class */}
            <p className="text-center text-sm text-gray-600"> {/* Keep tailwind layout/base text style */}
              Don't have an account?{' '}
              <Link to="/app/register">
                Register
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
