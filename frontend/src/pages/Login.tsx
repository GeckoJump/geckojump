// Login.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../AuthProvider';

const Login: React.FC = () => {

  const handleLoginClick = () => {
    // redirect to /api/login route of Flask backend
    window.location.href = 'http://localhost:5000/api/login';
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
