import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const GuestLookupPage: React.FC = () => {
  const [reservationId, setReservationId] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reservationId.trim() || !phone.trim()) {
      alert('예매번호와 전화번호를 모두 입력해주세요.');
      return;
    }

    try {
      const res = await axios.get('http://localhost:8080/api/reservations/non-member/check', {
        params: {
          reservationId,
          phoneNumber: Number(phone)
        }
      });

      setResult(res.data);
    } catch (err) {
      console.error('조회 실패:', err);
      alert('조회에 실패했습니다. 정보를 다시 확인해주세요.');
    }
  };

  return (
    <Wrapper>
      <Title>비회원 예매 확인</Title>

      <Form onSubmit={handleSearch}>
        <label htmlFor="reservationId">예매번호</label>
        <Input
          id="reservationId"
          value={reservationId}
          onChange={(e) => setReservationId(e.target.value)}
          placeholder="예: R202405179001"
        />

        <label htmlFor="phone">전화번호</label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01012345678"
        />
        <Btn type="submit">예매 내역 조회</Btn>
      </Form>

      {result && (
        <ResultBox>
          <h4>예매 내역</h4>
          <p><strong>예매번호:</strong> {result.id}</p>
          <p><strong>영화:</strong> {result.movieTitle}</p>
          <p><strong>일시:</strong> {result.screeningDate} {result.screeningStartTime}</p>
          <p><strong>극장:</strong> {result.cinemaName}</p>
          <p><strong>좌석:</strong> {result.seatLabel}</p>
          <p><strong>결제금액:</strong> {result.finalPrice.toLocaleString()}원</p>
        </ResultBox>
      )}
    </Wrapper>
  );
};

export default GuestLookupPage;

// 스타일 컴포넌트 그대로 유지
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