import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AdminHome: React.FC = () => {
  return (
    <Wrapper>
      <h2>관리자 페이지</h2>
      <Grid>
        <AdminCard to="/admin/movies">🎬 영화 정보 수정</AdminCard>
        <AdminCard to="/admin/members">👥 전체 회원 조회</AdminCard>
        <AdminCard to="/admin/guests">📱 비회원 목록</AdminCard>
      </Grid>
    </Wrapper>
  );
};

export default AdminHome;


const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); // 3개 고정
  gap: 1.5rem;
  justify-items: center;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); // 반응형 대응
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;


const AdminCard = styled(Link)`
  background: ${({ theme }) => theme.surface};
  border: 1px solid #555;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  color: ${({ theme }) => theme.text};
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  text-align: center;
  width: 100%;
  max-width: 250px;
  height: 100px; // ✅ 높이 고정
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.primary}22;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;