import React, { useState } from 'react';
import { Link } from 'react-router';
import { sendData } from '../utils/api.js';

export const Register = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendData('users', {
        username: inputs.username,
        password: inputs.password,
      });
      // Optionally, redirect or show a success message
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
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
