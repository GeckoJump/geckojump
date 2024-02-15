import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeProjectDetail from './pages/EmployeeProjectDetail';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee/projects/:projectId" element={<EmployeeProjectDetail/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
