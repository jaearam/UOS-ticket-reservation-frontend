import React, { useState } from 'react';
import styled from 'styled-components';

const GuestLookupPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [found, setFound] = useState(false);

  // 더미 데이터 (실제로는 phone 기반 검색 결과)
  const reservation = {
    id: 'R202405179001',
    movieTitle: '이너월드',
    date: '2024-05-21',
    time: '18:00',
    theater: 'CGV 홍대',
    seatList: ['A5'],
    totalPrice: 11000,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim() === '') return alert('전화번호를 입력해주세요.');
    // 실제 구현 시 → API 요청 후 성공 시 setFound(true)
    setFound(true);
  };

  return (
    <Wrapper>
      <Title>비회원 예매 확인</Title>

      <Form onSubmit={handleSearch}>
        <label htmlFor="phone">전화번호 입력</label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-0000-0000"
        />
        <Btn type="submit">예매 내역 조회</Btn>
      </Form>

      {found && (
        <ResultBox>
          <h4>예매 내역</h4>
          <p><strong>예매번호:</strong> {reservation.id}</p>
          <p><strong>영화:</strong> {reservation.movieTitle}</p>
          <p><strong>일시:</strong> {reservation.date} {reservation.time}</p>
          <p><strong>극장:</strong> {reservation.theater}</p>
          <p><strong>좌석:</strong> {reservation.seatList.join(', ')}</p>
          <p><strong>결제금액:</strong> {reservation.totalPrice.toLocaleString()}원</p>
        </ResultBox>
      )}
    </Wrapper>
  );
};

export default GuestLookupPage;

const Wrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1c1c1c;
  color: ${({ theme }) => theme.text};
`;

const Btn = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 0.5rem;
`;

const ResultBox = styled.div`
  background: ${({ theme }) => theme.surface};
  padding: 1.5rem;
  border-radius: 10px;
  h4 {
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.text};
  }
  p {
    margin: 0.4rem 0;
  }
`;
