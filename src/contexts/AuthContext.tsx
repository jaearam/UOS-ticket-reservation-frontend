// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextProps {
  isLoggedIn: boolean;
  token: string | null;
  login: (accessToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (accessToken: string) => {
    setToken(accessToken);
    localStorage.setItem('accessToken', accessToken);
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8080/api/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('서버 로그아웃 실패:', err);
    } finally {
      setToken(null);
      localStorage.removeItem('accessToken');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
