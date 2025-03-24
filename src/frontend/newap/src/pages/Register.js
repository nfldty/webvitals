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
    <div className='auth'>
        <h1>Register</h1>
        <form>
            <input required type="text" placeholder='username' name="username" onChange={handleChange} />
            <input required type="password" placeholder='password' name="password" onChange={handleChange} />
            <button onClick={handleSubmit}>Register</button>
            <span>Already have an account?<Link to="/login">Login</Link></span>
        </form>
    </div>
  );
};

export default Register