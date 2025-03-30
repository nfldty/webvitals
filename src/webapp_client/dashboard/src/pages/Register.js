import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DashboardHeader from '../components/DashboardHeader';
import '../style.css';

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.username || !inputs.password) {
      setErrorMessage('Username and Password are required!');
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        username: inputs.username,
        password: inputs.password,
      });
      if (response.status === 201) {
        login(response.data.token);
        navigate('/app/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Failed to register. Please try again later.');
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="form-container">
        <div className="form-wrapper">
          <h1 className="page-heading">Create an Account</h1>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="input-group">
              <label htmlFor="username" className="input-label">Username</label>
              <input
                id="username"
                required
                type="text"
                name="username"
                placeholder="Enter your username"
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <input
                id="password"
                required
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <button type="submit" className="btn">Register</button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/app/login" className="link-text">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
