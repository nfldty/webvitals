import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
import api from '../utils/api'

export const Login = () => {
  const navigate = useNavigate();


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

      const response = await api.post('/auth/login', {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('authToken', response.data.token);
        navigate('/app/dashboard');
      }
    } catch (error) {
      console.log('Login error:', error);
      setErrorMessage('Failed to log in. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
          <span className="text-sm text-center">
            Don&apos;t have an account?{' '}
            <Link to="/app/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
