import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // To navigate after successful registration
import { useAuth } from '../context/AuthContext';  // Import the custom hook for AuthContext
import api from '../utils/api';

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();  // Access login function from AuthContext

  // State for form fields
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
      // Send POST request to the backend to register the user
      const response = await api.post('/auth/register', {
        username: inputs.username,
        password: inputs.password,
      });

      if (response.status === 201) {
        // Now automatically log in the user after successful registration
        login(response.data.token);  // Store token and userId in global state

        // Redirect user to the dashboard after successful login
        navigate('/app/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Failed to register. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
          <span className="text-sm text-center">
            Already have an account?{' '}
            <Link to="/app/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
