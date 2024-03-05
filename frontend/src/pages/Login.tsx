// Login.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useAuth();

  useEffect(() => {
    console.log('useEffect for Login');
    const handleLoginRedirect = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token');

      if (token) {
        login(token); // Assuming your login function is now adapted to accept the token as an argument
        // Redirect to dashboard or another page as needed
      }else {
        console.log('token not found...');
      }
    };

    handleLoginRedirect();
  }, [login]); // Adding login to the dependency array ensures useEffect gets re-run if login changes

  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Redirect to the /api/login route of your Flask backend
    if (process.env.NODE_ENV === 'development')
      window.location.href = 'http://localhost:5000/api/login'
    else
      navigate('/api/login')
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleLoginClick}>
        Login with Google
      </button>
    </div>
  );
}

export default Login;
