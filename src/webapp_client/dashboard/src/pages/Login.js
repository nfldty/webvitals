import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DashboardHeader from '../components/DashboardHeader';
import '../style.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage('Username and Password are required!');
      return;
    }

    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.status === 200) {
        const token = response.data.token;
        login(token);
        navigate('/app/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Failed to log in. Please check your credentials and try again.');
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="form-container">
        <div className="form-wrapper">
          <h1 className="page-heading">Welcome Back</h1>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username" className="input-label">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <button type="submit" className="btn">Login</button>
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link to="/app/register" className="link-text">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
