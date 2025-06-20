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
import EditProfilePage from './pages/EditProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import AdminHome from './pages/AdminHome';
import MovieListPage from './pages/admin/MovieListPage';
import MovieEditPage from './pages/admin/MovieEditPage';
import MovieAddPage from './pages/admin/MovieAddPage';
import MemberListPage from './pages/admin/MemberListPage';
import MemberDetailPage from './pages/admin/MemberDetailPage';
import GuestListPage from './pages/admin/GuestListPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
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
          <Route path="/theaters/:cinemaId" element={<TheaterDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />

          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/movies" element={<MovieListPage />} />
          <Route path="/admin/movies/edit/:id" element={<MovieEditPage />} />
          <Route path="/admin/movies/add" element={<MovieAddPage />} />
          <Route path="/admin/members" element={<MemberListPage />} />  
          <Route path="/admin/members/detail/:userId" element={<MemberDetailPage />} />
          <Route path="/admin/guests" element={<GuestListPage />} />
        </Routes>
      </AppWrapper>
    </Router>
    </AuthProvider>
  );
};

export default App;

const AppWrapper = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
`;
