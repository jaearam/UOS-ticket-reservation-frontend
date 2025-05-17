import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <Nav>
      <Logo to="/">MovieBox</Logo>
      <Menu>
        <StyledLink to="/theaters">영화관</StyledLink>
        <StyledLink to="/mypage">마이페이지</StyledLink>
        <StyledLink to="/guest-lookup">비회원 조회</StyledLink>
      </Menu>
      <Auth>
        <StyledLink to="/login">로그인</StyledLink>
        <StyledLink to="/register">회원가입</StyledLink>
      </Auth>
    </Nav>
  );
};

export default Header;

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #000;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #333;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
`;

const Menu = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const Auth = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 0.95rem;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;
