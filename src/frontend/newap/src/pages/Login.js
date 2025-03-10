import React from 'react'
import { Link } from 'react-router'


export const Login = () => {
  return (
    <div className='auth'>
        <h1>Login</h1>
        <form>
            <input type="text" placeholder='username' />
            <input type="password" placeholder='password' />
            <button>Login</button>
            <span>Don't have an account: <Link to="/register">Register</Link></span>
        </form>
    </div>
  )
}

export default Login