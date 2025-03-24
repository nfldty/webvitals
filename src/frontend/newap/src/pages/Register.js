import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router'
import { sendData } from '../utils/api.js'

export const Register = () => {
  const [inputs, setInputs] = useState({
    username:"",
    password:"",
  });

  const handleChange = (e) => {
    setInputs((prev)=>({...prev, [e.target.name]: e.target.value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      sendData("users", {"username": inputs.username, "password": inputs.password})
    } catch(err){
      console.log(err);
    }
  };

  return (
    <div className='auth' role="region" aria-label="Registration Form">
        <h1 id="register-heading">Register</h1>
        <form role="form" aria-labelledby="register-heading" onSubmit={handleSubmit}>
            <input
              required
              type="text"
              placeholder='username'
              name="username"
              onChange={handleChange}
              aria-label="Username"
              aria-required="true"
            />
            <input
              required
              type="password"
              placeholder='password'
              name="password"
              onChange={handleChange}
              aria-label="Password"
              aria-required="true"
            />
            <button type="submit" role="button" aria-label="Register account">Register</button>
            <span>Already have an account? <Link to="/login" role="link" aria-label="Go to login page">Login</Link></span>
        </form>
    </div>
  );
};

export default Register