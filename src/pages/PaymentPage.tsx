import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Reservation } from '../types/Reservation';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationId } = location.state || {};

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [method, setMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [usedPoints, setUsedPoints] = useState(0);
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [maxPoints, setMaxPoints] = useState(0);
  
  
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = !!accessToken;
    if (!reservationId) return;
    axios
      .get(`http://localhost:8080/api/reservations/${reservationId}`, {
        headers: isLoggedIn ? { Authorization: `Bearer ${accessToken}` } : {},
      })
      .then((res) => setReservation(res.data))
      .catch((err) => {
        console.error('예매 정보 불러오기 실패:', err);
        alert('예매 정보를 불러오지 못했습니다.');
      });
  }, [reservationId]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = !!accessToken;
    axios
      .get(`http://localhost:8080/api/members/my`, {
          headers: isLoggedIn ? { Authorization: `Bearer ${accessToken}` } : {},
      })
      .then((res) => setMaxPoints(res.data.availablePoints))
      .catch((err) => {
        console.error('포인트 정보 조회 실패:', err);
      });
  },[]);
    

const handlePayment = async () => {
    if (!method) return alert('결제 수단을 선택해주세요.');
    if (!agree) return alert('약관에 동의해주세요.');
    if (!reservation) return;

    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = !!accessToken;

    try {
      setIsLoading(true);

      await axios.post(
        `http://localhost:8080/api/reservations/${reservation.id}/payment`,
        {
          paymentMethod: method,
          amount: reservation.finalPrice,
          cardOrAccountNumber: method === '카드' ? cardNumber : '110-1234-5678',
          deductedPoints: usedPoints,
        },
        {
        headers: isLoggedIn ? { Authorization: `Bearer ${accessToken}` } : {},
        }
      );

      setTimeout(() => {
        setIsLoading(false);
        alert('결제가 완료되었습니다!');
        navigate('/complete', {
          state: {
            reservationId,
          },
        });
      }, 3000);
    } catch (err: any) {
      console.error('결제 실패:', err);
      alert(`결제 실패: ${err.response?.data?.message ?? '서버 오류'}`);
      setIsLoading(false);
    }
  };

  if (!reservation) {
    return <Wrapper>예매 정보 불러오는 중...</Wrapper>;
  }

  const [date, time] = reservation.screeningStartTime.split('T');
  const isloggedin = localStorage.getItem('accessToken') !== null;
  
  return (
    <Wrapper>
      <Title>결제 정보 확인</Title>
      <Card>
        <p><strong>영화:</strong> {reservation.movieTitle}</p>
        <p><strong>일시:</strong> {date} {time.slice(0, 5)}</p>
        <p><strong>극장:</strong> {reservation.cinemaName} / {reservation.screenName}</p>
        <p><strong>좌석:</strong> {reservation.seatLabel} ({reservation.seatGradeName})</p>
        <p><strong>금액:</strong> {reservation.finalPrice.toLocaleString()}원</p>
      </Card>

      <Label>결제 수단 선택</Label>
      <RadioGroup>
        <label><input type="radio" value="카드" name="method" onChange={(e) => setMethod("카드")} /> 신용카드</label>
        <label><input type="radio" value="계좌이체" name="method" onChange={(e) => setMethod("계좌")} /> 계좌이체</label>
      </RadioGroup>

      {method === '카드' && (
        <InputGroup>
          <label>카드 번호</label>
          <input
            type="text"
            placeholder="1234-5678-9012-3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </InputGroup>
      )}

      {method === '계좌' && (
        <NoticeBox>
          <p><strong>입금 계좌번호:</strong> 110-1234-5678 (국민은행)</p>
          <p style={{ fontSize: '0.9rem', color: '#888' }}>
            ※ 해당 계좌로 <strong>24시간 내</strong> 입금되지 않으면 예매는 자동 취소됩니다.
          </p>
        </NoticeBox>
      )}
    {isloggedin && (
      <InputGroup>
        <label>사용할 포인트</label>
        <input
          type="number"
          value={usedPoints}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), maxPoints);
            setUsedPoints(val >= 0 ? val : 0);
          }}
          min={0}
          max={maxPoints}
        />
        <span style={{ fontSize: '0.85rem', color: '#888' }}>
          보유 포인트: {maxPoints.toLocaleString()}P
        </span>
      </InputGroup>
    )}

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

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  padding: 0 0.2rem; // ✅ 좌우 공간 확보

  label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
  }

  input {
    width: 100%;
    max-width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: none;
    background-color: #f3f4f6;
    font-size: 1rem;
    color: #111;
    outline: none;
    box-sizing: border-box; // ✅ padding 포함한 width로 계산
    background-color: #1f2937; // dark-gray
    color: #f9fafb;            // near-white

  }

  span {
    display: block;
    margin-top: 0.4rem;
    font-size: 0.85rem;
    color: #888;
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
const NoticeBox = styled.div`
  background: #f1f5f9;
  border-radius: 12px;
  padding: 1rem 1.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;

  p {
    margin: 0.3rem 0;
    font-size: 0.95rem;
    color: #334155;

    strong {
      font-weight: 600;
      color: #0f172a;
    }
  }
`;

