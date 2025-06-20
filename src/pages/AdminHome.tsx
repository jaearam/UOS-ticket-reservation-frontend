import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Title = styled.h2`
  color: #fff;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 1.2px;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.25);
`;

const AdminHome: React.FC = () => {
  return (
    <Wrapper>
      <Title>관리자 페이지</Title>
      <Grid>
        <AdminCard to="/admin/movies"><span>🎬</span>영화 정보 수정</AdminCard>
        <AdminCard to="/admin/members"><span>👥</span>전체 회원 조회</AdminCard>
        <AdminCard to="/admin/guests"><span>📱</span>비회원 목록</AdminCard>
      </Grid>
    </Wrapper>
  );
};

export default AdminHome;

const Wrapper = styled.div`
  min-height: 100vh;
  background: #181818;
  max-width: 1000px;
  margin: 0 auto;
  padding: 3.5rem 1.5rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.2rem;
  justify-items: center;
  width: 100%;
  margin-top: 2.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const AdminCard = styled(Link)`
  background: #232323;
  border: none;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.22);
  padding: 2.2rem 1.2rem;
  color: #fff;
  font-weight: 800;
  font-size: 1.25rem;
  text-decoration: none;
  text-align: center;
  width: 100%;
  max-width: 270px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.22s cubic-bezier(.4,2,.6,1);
  position: relative;
  letter-spacing: 0.5px;
  outline: none;
  cursor: pointer;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, #e50914 0%, #b0060f 100%);
    opacity: 0;
    transition: opacity 0.22s;
    z-index: 0;
  }

  &:hover, &:focus {
    color: #fff;
    box-shadow: 0 8px 32px 0 rgba(229,9,20,0.18);
    transform: translateY(-4px) scale(1.04);
    &::before {
      opacity: 0.13;
    }
  }

  span {
    font-size: 2.1rem;
    margin-bottom: 0.7rem;
    display: block;
  }
`;