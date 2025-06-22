import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AdminHome: React.FC = () => {
  return (
    <Wrapper>
      <Header>
        <Title>관리자 대시보드</Title>
        <Subtitle>시스템의 다양한 측면을 관리하고 모니터링하세요.</Subtitle>
      </Header>
      <Grid>
        <AdminCard to="/admin/movies">
          <Icon>🎬</Icon>
          <span>영화 관리</span>
        </AdminCard>
        <AdminCard to="/admin/members">
          <Icon>👥</Icon>
          <span>회원 관리</span>
        </AdminCard>
        <AdminCard to="/admin/guests">
          <Icon>📱</Icon>
          <span>비회원 관리</span>
        </AdminCard>
        <AdminCard to="/admin/cinemas">
          <Icon>🏢</Icon>
          <span>영화관 관리</span>
        </AdminCard>
        <AdminCard to="/admin/seats">
          <Icon>💺</Icon>
          <span>좌석 관리</span>
        </AdminCard>
        <AdminCard to="/admin/schedules">
          <Icon>📅</Icon>
          <span>상영일정 관리</span>
        </AdminCard>
        <AdminCard to="/admin/reservations">
          <Icon>🎫</Icon>
          <span>예매 내역 관리</span>
        </AdminCard>
      </Grid>
    </Wrapper>
  );
};

export default AdminHome;

const Wrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textMuted};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const AdminCard = styled(Link)`
  background: ${({ theme }) => theme.surface};
  border-radius: 12px;
  padding: 2rem;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease;
  border: 1px solid ${({ theme }) => theme.surface};

  span {
    font-size: 1.1rem;
    font-weight: 600;
  }

  &:hover {
    transform: translateY(-5px);
    background-color: ${({ theme }) => theme.card};
  }
`;

const Icon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1;
`;