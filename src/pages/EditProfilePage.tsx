import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// 전화번호 포맷팅 유틸리티 함수들
const formatPhoneNumber = (value: string): string => {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '');
  
  // 길이에 따라 하이픈 추가
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

const removeHyphens = (value: string): string => {
  return value.replace(/-/g, '');
};

// 생년월일 포맷팅 유틸리티 함수들
const formatBirthDate = (value: string): string => {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '');
  
  // YYYYMMDD 형식을 YYYY-MM-DD로 변환
  if (numbers.length >= 8) {
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
  }
  return numbers;
};

const formatBirthDateForServer = (value: string): string => {
  // YYYY-MM-DD 형식을 YYYYMMDD로 변환
  return value.replace(/-/g, '');
};

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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/members/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { email, phoneNumber, birthDate, userId } = res.data;
        // 서버에서 받은 전화번호와 생년월일에 포맷팅 적용하여 표시
        setForm({ 
          email, 
          phoneNumber: formatPhoneNumber(phoneNumber), 
          birthDate: formatBirthDate(birthDate), 
          userId, 
          password: '' 
        });
      } catch (err) {
        console.error('회원 정보 조회 실패:', err);
      }
    };
    fetchUserInfo();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      // 전화번호 입력 시 자동 포맷팅
      const formattedValue = formatPhoneNumber(value);
      setForm({ ...form, [name]: formattedValue });
    } else if (name === 'birthDate') {
      // 생년월일 입력 시 자동 포맷팅
      const formattedValue = formatBirthDate(value);
      setForm({ ...form, [name]: formattedValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 비밀번호 필드가 채워져 있을 때만 유효성 검사
    if (form.password && form.password !== confirmPassword) {
      setErrorMsg('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호를 변경하지 않는 경우, password 필드를 보내지 않음
    const { password, ...restOfForm } = form;
    const submissionData = form.password ? form : restOfForm;
    
    // 서버 전송 시 전화번호와 생년월일에서 하이픈 제거
    const dataToSubmit = {
      ...submissionData,
      phoneNumber: removeHyphens(submissionData.phoneNumber),
      birthDate: formatBirthDateForServer(submissionData.birthDate)
    };

    try {
      await axios.put('http://localhost:8080/api/members/my', dataToSubmit, {
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

        <label>생년월일 (YYYY-MM-DD 형식으로 자동 변환)</label>
        <Input name="birthDate" value={form.birthDate} onChange={handleChange} required />

        <label>새 비밀번호 (변경 시에만 입력)</label>
        <Input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        
        <label>새 비밀번호 확인</label>
        <Input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
