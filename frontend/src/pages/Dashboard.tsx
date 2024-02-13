import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import StickyNavbar from '../components/StickyNavbar';
import AdminDashboard from '../components/AdminDashboard';

const Dashboard: React.FC = () => {
  const { userEmail, userName, userRole, isAuthenticated, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');


    if (!isAuthenticated) { //check if user is authenticated
      if (!token) { //if they aren't, then do they have a token from being redirected from /api/auth? no?
        console.log('user not authenticated and no token found (Dashboard useEffect)')
        navigate('/') //go back to homepage
      } else {
        login(token) //a token was passed in, so try to log in with it
      }
    } else {
      navigate('/dashboard') //we do this to reload the page and get rid of the token from the url
    }
  }, [location.search, navigate, login]); //do the stuff above if any of these dependencies change


  return (
    <>
      <StickyNavbar />
      <div className="pt-16 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg">Welcome, {userName}</p>
        <p className="text-lg">Email: {userEmail}</p>
        <p className="text-lg">Role: {userRole}</p>
        {userRole === 'admin' && <AdminDashboard />}
      </div>
    </>
  );
};

export default Dashboard;
