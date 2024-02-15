import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import axios from 'axios';
import StickyNavbar from '../components/StickyNavbar';
import AdminDashboard from '../components/AdminDashboard';
import ClientDashboard from '../components/ClientDashboard';
import EmployeeDashboard from '../components/EmployeeDashboard';

interface User {
  email: string;
  full_name: string;
  role: string;
}



const Dashboard: React.FC = () => {
  const { userEmail, userName, userRole, isAuthenticated, login, logout } = useAuth();
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
      // const response = axios.get<User>('/api/users/' + userEmail).then(response => {
      //   const user = response.data;
      //   if (user.email) navigate('/dashboard');
      // }).catch(error => {
      //   logout();
      //   navigate('/')
      //   console.log(error);
      // });
      navigate('/dashboard');
    }
  }, [location.search, navigate, login]); //do the stuff above if any of these dependencies change


  return (
    <>
      <StickyNavbar />
      <div className="pt-20 pb-8 mx-auto max-w-4xl"> {/* Adjust padding and max-width */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8"> {/* Card styling for user info */}
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="space-y-2"> {/* Space between user info lines */}
            <p className="text-lg"><span className="font-medium">Welcome:</span> {userName}</p>
            <p className="text-lg"><span className="font-medium">Email:</span> {userEmail}</p>
            <p className="text-lg"><span className="font-medium">Role:</span> {userRole}</p>
          </div>
          {userRole === 'admin' && <AdminDashboard/>}
          {userRole != 'client' && <EmployeeDashboard email={userEmail}/>}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
