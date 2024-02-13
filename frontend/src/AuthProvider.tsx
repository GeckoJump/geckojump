import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  userEmail: string | null;
  userName: string | null;
  userRole: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  accessToken: null,
  userEmail: null,
  userName: null,
  userRole: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('accessToken')
  );
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem('userEmail')
  );
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem('userName')
  );
  const [userRole, setUserRole] = useState<string | null>(
    localStorage.getItem('userRole')
  );

  const login = (token: string) => {
    setIsAuthenticated(true);
    setAccessToken(token);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('accessToken', token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccessToken(null);
    setUserEmail(null);
    setUserName(null);
    setUserRole(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (isAuthenticated) {
          const response = await fetch('/api/user');
          const data = await response.json();
          if (response.ok) {
            setUserEmail(data.email);
            setUserName(data.name);
            setUserRole(data.role);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userRole', data.role);
          } else {
            console.error('Failed to fetch user info:', data.error);
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, userEmail, userName, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
