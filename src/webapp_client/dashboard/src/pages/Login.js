import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DashboardHeader from '../components/DashboardHeader';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

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
        // Delay navigation to allow cookies to be set properly
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 1000); // 1 second delay (adjust as needed)
      }
    } catch (error) {
      console.error('Login error:', error);
      const apiError =
        error.response?.data?.message || 'Failed to log in. Please check credentials.';
      setErrorMessage(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <DashboardHeader className="auth-header" />

      <main className="auth-content-area">
        <div className="auth-card">
          <h1 className="page-heading">Welcome Back</h1>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username" className="input-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-center text-sm text-gray-600">
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
