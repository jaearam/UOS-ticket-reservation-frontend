import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    userId: '',
    password: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [displayPhone, setDisplayPhone] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      // 숫자만 추출
      const onlyNumber = value.replace(/[^0-9]/g, '');
      // 010-1234-5678 형식으로 포맷팅
      let formatted = onlyNumber;
      if (onlyNumber.length > 3 && onlyNumber.length <= 7) {
        formatted = onlyNumber.slice(0, 3) + '-' + onlyNumber.slice(3);
      } else if (onlyNumber.length > 7) {
        formatted = onlyNumber.slice(0, 3) + '-' + onlyNumber.slice(3, 7) + '-' + onlyNumber.slice(7, 11);
      }
      setForm({ ...form, phoneNumber: onlyNumber });
      // 입력창에는 formatted를 보여주기 위해 별도 상태 사용
      setDisplayPhone(formatted);
      return;
    }
    setForm({ ...form, [name]: value });
    if (name === 'password' && value.length >= 8) {
      setErrorMsg('');
    }
    if (name === 'userId') {
      setIdCheckMessage('');
    }
  };

  const handleIdCheck = async () => {
    try {
      console.log('아이디 중복 확인 요청:', form.userId);
      const res = await axios.get(`http://localhost:8080/api/members/check-id`, {
        params: { userId: form.userId },
      });
      if (res.data.duplicate === false) {
        setIdCheckMessage('사용 가능한 아이디입니다.');
      } else {
        setIdCheckMessage('이미 사용 중인 아이디입니다.');
      }
    } catch (err) {
      console.error(err);
      setIdCheckMessage('아이디 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password.length < 8) {
      setErrorMsg('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/signup', form);
      alert('회원가입이 완료되었습니다!');
      setErrorMsg('');
      navigate('/login'); // 회원가입 후 로그인 페이지로 이동
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || '서버 오류로 회원가입에 실패했습니다.');
    }
  };

  return (
    <Wrapper>
      <h2>회원가입</h2>
      <Form onSubmit={handleSubmit}>
        <label>아이디 (4~20자)</label>
        <IdCheckRow>
          <Input name="userId" value={form.userId} onChange={handleChange} required />
          <CheckButton type="button" onClick={handleIdCheck}>중복 확인</CheckButton>
        </IdCheckRow>
        {idCheckMessage && <InfoText>{idCheckMessage}</InfoText>}

        <label>비밀번호</label>
        <Input type="password" name="password" value={form.password} onChange={handleChange} required />
        {form.password.length > 0 && form.password.length < 8 && (
          <ErrorText>비밀번호는 최소 8자 이상이어야 합니다.</ErrorText>
        )}

        <label>이메일</label>
        <Input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>전화번호 (숫자만, 11자리)</label>
        <Input name="phoneNumber" value={displayPhone} onChange={handleChange} required />

        <label>생년월일 (YYYYMMDD)</label>
        <Input name="birthDate" value={form.birthDate} onChange={handleChange} required />

        {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

        <SubmitButton type="submit">회원가입</SubmitButton>
      </Form>
    </Wrapper>
  );
};

export default RegisterPage;


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
  flex: 1;
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1c1c1c;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;

  &:-webkit-autofill {
    box-shadow: 0 0 0px 1000px #1c1c1c inset !important;
    -webkit-text-fill-color: ${({ theme }) => theme.text} !important;
    transition: background-color 9999s ease-out 0s;
  }
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

const ErrorText = styled.p`
  font-size: 0.85rem;
  color: #f44336;
  margin-top: -0.5rem;
  margin-bottom: -0.5rem;
`;

const IdCheckRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CheckButton = styled.button`
  white-space: nowrap;
  padding: 0.8rem;
  background: #666;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
`;

const InfoText = styled.p`
  font-size: 0.85rem;
  color: #03a9f4;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
`;
