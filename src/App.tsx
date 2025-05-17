import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import ReservePage from './pages/ReservePage';
import CompletePage from './pages/CompletePage';
import PaymentPage from './pages/PaymentPage';
import Mypage from './pages/Mypage';
import GuestLookupPage from './pages/GuestLookupPage';
import TheaterListPage from './pages/TheaterListPage';
import TheaterDetailPage from './pages/TheaterDetailPage';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  return (
    <Router>
      <AppWrapper>
              <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/reserve/:id" element={<ReservePage />} />
          <Route path="/complete" element={<CompletePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/guest-lookup" element={<GuestLookupPage />} />
          <Route path="/theaters" element={<TheaterListPage />} />
          <Route path="/theaters/:id" element={<TheaterDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* 앞으로 여기에 추가: /movie/:id, /reserve 등 */}
        </Routes>
      </AppWrapper>
    </Router>
  );
};

export default App;

const AppWrapper = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
`;
