import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import StickyNavbar from '../components/StickyNavbar';
import AdminDashboard from '../components/AdminDashboard';

const useUserInfo = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Fetch user info only if authenticated
        if (isAuthenticated) {
          const response = await fetch('/api/user');
          const data = await response.json();
          if (response.ok) {
            setUserEmail(data.email);
          } else {
            console.error('Failed to fetch user info:', data.error);
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    // Redirect if not authenticated or token present in URL
    if (!isAuthenticated) {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token');
      if (token) {
        login(token);
        navigate('/dashboard');
      } else {
        console.log('User not authenticated (token not found) at /dashboard');
        navigate('/');
      }
    }

    // Check if accessToken is present in URL and store it in localStorage
    const accessToken = new URLSearchParams(location.search).get('token');
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      navigate('/dashboard');
    }

    fetchUserInfo();
  }, [isAuthenticated, login, location.search, navigate]);

  return userEmail;
};

const Dashboard: React.FC = () => {
  const userEmail = useUserInfo();

  return (
    <>
      <StickyNavbar />
      <div className="pt-16 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg">Welcome, {userEmail}</p>
      </div>
      <AdminDashboard/>
    </>
  );
};

export default Dashboard;
