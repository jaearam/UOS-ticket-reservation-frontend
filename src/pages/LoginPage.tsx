import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // ✅ AuthContext 사용
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/login', { userId, password });
      const { accessToken, member } = response.data;

      // ✅ 토큰 저장 (context)
      login(accessToken);

      // ✅ userId도 localStorage에 저장
      localStorage.setItem('userId', member.userId);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      console.log('로그인 응답:', response.data);
      alert('로그인 성공');
      navigate('/mypage');
    } catch (err: any) {
      alert('로그인 실패: ' + (err?.response?.data?.message || '서버 오류'));
    }
  };


  return (
    <Wrapper>
      <Form onSubmit={handleLogin}>
        <Title>로그인</Title>
        <Input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">로그인</Button>

        <Links>
          <StyledLink to="/register">회원가입</StyledLink>
        </Links>
      </Form>
    </Wrapper>
  );
};

export default LoginPage;


const Wrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.primary};
`;

const Input = styled.input`
  padding: 0.8rem;
  background: #1c1c1c;
  border: 1px solid #444;
  border-radius: 6px;
  color: white;
`;

const Button = styled.button`
  padding: 0.9rem;
  background: ${({ theme }) => theme.primary};
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
`;

const Links = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.textMuted};
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;
