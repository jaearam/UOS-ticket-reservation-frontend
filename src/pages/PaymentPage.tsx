import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 반드시 컴포넌트 최상단

  const reservation = location.state as {
    movieTitle: string;
    date: string;
    time: string;
    theater: string;
    seats: string[];
    totalPrice: number;
  };

  const [method, setMethod] = useState('');
  const [agree, setAgree] = useState(false);

  const handlePayment = () => {
    if (!method) return alert('결제 수단을 선택해주세요.');
    if (!agree) return alert('약관에 동의해주세요.');
    alert('결제가 완료되었습니다!');
    navigate('/complete');
  };

  if (!reservation) {
    return <Wrapper>예매 정보가 없습니다.</Wrapper>;
  }

  return (
    <Wrapper>
      <Title>결제 정보 확인</Title>
      <Card>
        <p><strong>영화:</strong> {reservation.movieTitle}</p>
        <p><strong>일시:</strong> {reservation.date} {reservation.time}</p>
        <p><strong>극장:</strong> {reservation.theater}</p>
        <p><strong>좌석:</strong> {reservation.seats.join(', ')}</p>
        <p><strong>금액:</strong> {reservation.totalPrice.toLocaleString()}원</p>
      </Card>

      <Label>결제 수단 선택</Label>
      <RadioGroup>
        <label><input type="radio" value="card" name="method" onChange={(e) => setMethod(e.target.value)} /> 신용카드</label>
        <label><input type="radio" value="bank" name="method" onChange={(e) => setMethod(e.target.value)} /> 계좌이체</label>
        <label><input type="radio" value="point" name="method" onChange={(e) => setMethod(e.target.value)} /> 포인트</label>
      </RadioGroup>

      <CheckboxRow>
        <input type="checkbox" id="agree" checked={agree} onChange={() => setAgree(!agree)} />
        <label htmlFor="agree">약관에 동의합니다.</label>
      </CheckboxRow>

      <PaymentBtn onClick={handlePayment}>결제하기</PaymentBtn>
    </Wrapper>
  );
};

export default PaymentPage;

const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.primary};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.surface};
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const Row = styled.div`
  margin-bottom: 1rem;
  strong {
    display: inline-block;
    width: 90px;
    color: ${({ theme }) => theme.textMuted};
  }
`;

const Label = styled.h4`
  margin-bottom: 0.5rem;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 2rem;
  input {
    margin-right: 0.5rem;
  }
`;

const CheckboxRow = styled.div`
  margin-bottom: 2rem;
  font-size: 0.95rem;
  input {
    margin-right: 0.5rem;
  }
`;

const PaymentBtn = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;
