import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import StickyNavbar from '../components/StickyNavbar';

const useUserInfo = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();

  useEffect(() => {

    //check authenticated status, redirect them to login if they aren't
    if (!isAuthenticated) {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token');

      if (token) {
        login(token); // Assuming your login function is now adapted to accept the token as an argument
        // Redirect to dashboard or another page as needed
      }else {
        console.log('user not authenticated (token not found) at /dashboard');
      }

    }
    

    console.log('auth: ' + isAuthenticated);

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
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg">Welcome, {userEmail}</p>
    </>
  );
};

export default Dashboard;
