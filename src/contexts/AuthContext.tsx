// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextProps {
  isLoggedIn: boolean;
  token: string | null;
  login: (accessToken: string) => void;
  logout: () => void;
  user: {userId: string} | null; // Assuming user object has userId
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ userId: string } | null>(null); // 예시

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);

      // ✅ 서버에 토큰으로 사용자 정보 요청
      axios.get('http://localhost:8080/api/members/my', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => {
          setUser(res.data); // 사용자 정보 저장
        })
        .catch((err) => {
          console.error('토큰 인증 실패, 강제 로그아웃 처리');
          logout(); // ❗ 강제 로그아웃
        });
    }
  }, []);


const login = async (accessToken: string) => {
  setToken(accessToken);
  localStorage.setItem('accessToken', accessToken);

  try {
    const res = await axios.get('http://localhost:8080/api/members/my', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setUser({ userId: res.data.userId }); // 필요한 필드만 추출
  } catch (err) {
    console.error('사용자 정보 불러오기 실패:', err);
    setUser(null);
  }
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
      setUser(null); // 사용자 정보도 초기화
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        login,
        logout,
        user, // 현재 사용자 정보
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
