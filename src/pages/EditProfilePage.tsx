import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const EditProfilePage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userId: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/members/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { email, phoneNumber, birthDate, userId } = res.data;
        setForm({ email, phoneNumber, birthDate, userId, password: '' });
      } catch (err) {
        console.error('회원 정보 조회 실패:', err);
      }
    };
    fetchUserInfo();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:8080/api/members/my', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('회원 정보가 수정되었습니다.');
      navigate('/mypage');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || '정보 수정 실패');
    }
  };

  return (
    <Wrapper>
      <h2>회원 정보 수정</h2>
      <Form onSubmit={handleSubmit}>
        <label>이메일</label>
        <Input name="email" value={form.email} onChange={handleChange} required />

        <label>전화번호 (숫자만, 11자리)</label>
        <Input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />

        <label>생년월일 (YYYYMMDD)</label>
        <Input name="birthDate" value={form.birthDate} onChange={handleChange} required />

        <label>새 비밀번호</label>
        <Input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}

        <SubmitButton type="submit">정보 수정</SubmitButton>
      </Form>
    </Wrapper>
  );
};

export default EditProfilePage;

const Wrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1c1c1c;
  color: ${({ theme }) => theme.text};
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
`;

const ErrorMsg = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: -0.5rem;
`;
