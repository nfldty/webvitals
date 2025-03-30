import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DashboardHeader from '../components/DashboardHeader'; // Keep the specific header component import

// Assume style.css is imported globally or at a higher level

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  // --- Keep new handleChange logic ---
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- Keep new handleSubmit logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!inputs.username || !inputs.password) {
      setErrorMessage('Username and Password are required!');
      return;
    }
    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        username: inputs.username,
        password: inputs.password,
      });
      // Logic from new file assumes token is always present on 201
      if (response.status === 201 && response.data.token) {
        login(response.data.token);
        navigate('/app/dashboard');
      } else {
        // Added contingency if 201 received but no token (unlikely but safe)
         setErrorMessage(response.data?.message || 'Registration successful, but auto-login failed. Please log in manually.');
         // Optionally navigate to login: navigate('/app/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const apiError = error.response?.data?.message || 'Failed to register. Username might be taken or server error occurred.';
      setErrorMessage(apiError);
    } finally {
       setLoading(false);
    }
  };

  return (
     // Use the CSS wrapper structure
    <div className="auth-page-wrapper">
      {/* Use the imported DashboardHeader */}
       <DashboardHeader className="auth-header" /> {/* Pass className for potential styling */}

      {/* Main content area for centering */}
      <main className="auth-content-area">
        {/* The actual card using the specific class name */}
        <div className="auth-card">
           {/* Title styled by CSS */}
          <h1 className="page-heading">Create an Account</h1>
          {/* Error message styled by CSS */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
           {/* Form: Keep layout classes, submit logic */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6"> {/* Kept flex/gap */}
            {/* Input Group: Keep structure */}
            <div className="input-group">
                {/* Label from new JS */}
               <label htmlFor="username" className="input-label">Username</label>
               {/* Input: Rely on CSS, remove 'input-field' */}
              <input
                id="username"
                required
                type="text"
                name="username" // Keep name for handleChange
                placeholder="Enter your username" // Use new placeholder
                autoComplete="username"
                onChange={handleChange}
                value={inputs.username} // Controlled input
              />
            </div>
            {/* Input Group: Keep structure */}
            <div className="input-group">
               <label htmlFor="password" className="input-label">Password</label>
                {/* Input: Rely on CSS, remove 'input-field' */}
              <input
                id="password"
                required
                type="password"
                name="password" // Keep name for handleChange
                placeholder="Enter your password" // Use new placeholder
                autoComplete="new-password"
                onChange={handleChange}
                value={inputs.password} // Controlled input
              />
            </div>
            {/* Button: Rely on CSS, remove 'btn' */}
            <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </button>
            {/* Link text: Use CSS, remove 'link-text' */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/app/login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;