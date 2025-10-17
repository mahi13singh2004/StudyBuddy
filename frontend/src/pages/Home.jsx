import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';

const Home = () => {
  const navigate=useNavigate()
  const {user,logout}=useAuthStore()
  const handleLogout=async()=>{
    await logout();
    navigate("/login")
  }
  return (
    <div>
      <h1>DashBoard</h1>
      <p>Welcome,{user.name}</p>
      <p>Welcome,{user.email}</p>
      <Link to="/notes">Notes Page</Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home