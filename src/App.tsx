import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import ReservePage from './pages/ReservePage';

const App: React.FC = () => {
  return (
    <Router>
      <AppWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/reserve/:id" element={<ReservePage />} />
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
