import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import StickyNavbar from '../components/StickyNavbar';

const useUserInfo = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        if (response.ok) {
          setUserEmail(data.email);
        } else {
          console.error('Failed to fetch user info:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get('token');
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      window.location.href = '/dashboard';
    }
  }, [location.search]);

  return { userEmail };
};

const Dashboard: React.FC = () => {
  const { userEmail } = useUserInfo();

  return (
    <>
      <StickyNavbar />
      <div className="container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg">Welcome, {userEmail}</p>
      </div>
    </>
  );
};

export default Dashboard;
