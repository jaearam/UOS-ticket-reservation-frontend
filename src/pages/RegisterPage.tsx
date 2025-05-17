import React, { useState } from 'react';
import styled from 'styled-components';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    agree: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) {
      alert('약관에 동의해주세요.');
      return;
    }
    alert(`회원가입 정보\n아이디: ${form.username}`);
    // 추후 API 연동
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Title>회원가입</Title>
        <Input name="username" placeholder="아이디" value={form.username} onChange={handleChange} required />
        <Input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
        <Input name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
        <Input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} required />
        <Input name="phone" placeholder="연락처 (010-0000-0000)" value={form.phone} onChange={handleChange} required />
        <Input name="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
        <Input name="address" placeholder="주소" value={form.address} onChange={handleChange} required />

        <AgreeRow>
          <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
          <label htmlFor="agree">서비스 이용 약관에 동의합니다.</label>
        </AgreeRow>

        <Button type="submit">회원가입</Button>
      </Form>
    </Wrapper>
  );
};

export default RegisterPage;

const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
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

const AgreeRow = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  align-items: center;
`;

const Button = styled.button`
  padding: 0.9rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;
