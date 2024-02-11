// AuthProvider.tsx
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  accessToken: null,
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

  const login = (token: string) => {
    console.log('logging in...');
    setIsAuthenticated(true);
    setAccessToken(token);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('accessToken', token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccessToken(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);