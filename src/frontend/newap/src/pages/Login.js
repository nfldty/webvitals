import React from 'react'
import { Link } from 'react-router'


export const Login = () => {
  return (
    <div className='auth' role="main">
        <h1 id="login-heading">Login</h1>
        <form role="form" aria-labelledby="login-heading">
            <input type="text" placeholder='username' aria-label="username" />
            <input type="password" placeholder='password' aria-label="password" />
            <button role="button" type="submit">Login</button>
            <span>Don't have an account: <Link to="/register" role="link">Register</Link></span>
        </form>
    </div>
  )
}

export default Login