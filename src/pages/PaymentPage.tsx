import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

interface ReservationDetail {
  movieTitle: string;
  screenName: string;
  cinemaName: string;
  seatLabel: string;
  seatGradeName: string;
  basePrice: number;
  discountAmount: number;
  finalPrice: number;
  screeningDate: string;
  screeningStartTime: string;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationId } = location.state || {};

  const [reservation, setReservation] = useState<ReservationDetail | null>(null);
  const [method, setMethod] = useState('');
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    if (!reservationId) return;
    const token = localStorage.getItem('accessToken');

    axios
      .get(`http://localhost:8080/api/reservations/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setReservation(res.data))
      .catch((err) => {
        console.error('예매 정보 불러오기 실패:', err);
        alert('예매 정보를 불러오지 못했습니다.');
      });
  }, [reservationId]);

const [isLoading, setIsLoading] = useState(false);

const handlePayment = () => {
  if (!method) return alert('결제 수단을 선택해주세요.');
  if (!agree) return alert('약관에 동의해주세요.');

  if (method === 'point') {
    // 포인트 결제는 아직 미구현
    alert('포인트 결제는 아직 준비 중입니다.');
    return;
  }

  setIsLoading(true); // 로딩 시작

  // 가상 결제 승인 요청
  setTimeout(() => {
    setIsLoading(false);
    alert('결제가 완료되었습니다!');
    navigate('/complete', {
      state: {
        reservationId,
      },
    });
  }, 3000);
};


  if (!reservation) {
    return <Wrapper>예매 정보 불러오는 중...</Wrapper>;
  }

  return (
    <Wrapper>
      <Title>결제 정보 확인</Title>
      <Card>
        <p><strong>영화:</strong> {reservation.movieTitle}</p>
        <p><strong>일시:</strong> {reservation.screeningStartTime.replace('T', ' ')}</p>
        <p><strong>극장:</strong> {reservation.cinemaName} / {reservation.screenName}</p>
        <p><strong>좌석:</strong> {reservation.seatLabel} ({reservation.seatGradeName})</p>
        <p><strong>금액:</strong> {reservation.finalPrice.toLocaleString()}원</p>
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

      <PaymentBtn onClick={handlePayment} disabled={isLoading}>
        {isLoading ? '결제 처리 중...' : '결제하기'}
      </PaymentBtn>
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
