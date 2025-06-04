import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Reservation } from '../types/Reservation'; 


const CompletePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationId } = location.state || {};
  console.log('예매 ID:', reservationId);

  const [reservation, setReservation] = useState<Reservation | null>(null);

  const handleIssueTicket = async () => {
    if (!reservation) return;

    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = !!accessToken;
  
    try {
      await axios.post(
        `http://localhost:8080/api/reservations/${reservation.id}/issue`,
        {},
        {
        headers: isLoggedIn ? { Authorization: `Bearer ${accessToken}` } : {},
        }
      );

      alert('티켓이 발급되었습니다! (PDF 저장/인쇄 기능은 추후 제공 예정)');
      // 필요 시 여기에 window.print(), 또는 PDF 다운로드 기능 추가
    } catch (err:any) {
      console.error('티켓 발급 실패:', err.response?.data || err);
      alert('티켓 발급에 실패했습니다.');
    }
  };

  
  useEffect(() => {
    if (!reservationId) return;
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = !!accessToken;

    axios
      .get(`http://localhost:8080/api/reservations/${reservationId}`, {
headers: isLoggedIn ? { Authorization: `Bearer ${accessToken}` } : {},
      })
      .then((res) => setReservation(res.data))
      .catch((err) => {
        console.error('예매 정보 조회 실패:', err);
        alert('예매 정보를 불러올 수 없습니다.');
        navigate('/');
      });
  }, [reservationId, navigate]);

  if (!reservation) {
    return <Wrapper>예매 정보를 불러오는 중입니다...</Wrapper>;
  }

  // 날짜 + 시간 분리
  const [date, time] = reservation.screeningStartTime.split('T');

  return (
    <Wrapper>
      <Title>예매가 완료되었습니다 🎉</Title>
      <Card>
        <Row><strong>예매 번호</strong> {reservation.id}</Row>
        <Row><strong>영화</strong> {reservation.movieTitle}</Row>
        <Row><strong>일시</strong> {date} {time.slice(0, 5)}</Row>
        <Row><strong>극장</strong> {reservation.cinemaName} / {reservation.screenName}</Row>
        <Row><strong>좌석</strong> {reservation.seatLabel}</Row>
        <Row><strong>결제</strong> {reservation.finalPrice.toLocaleString()}원</Row>
      </Card>

      <BtnRow>
        <ActionBtn onClick={() => alert('PDF 저장 기능은 준비 중입니다.')}>PDF 저장</ActionBtn>
        <ActionBtn onClick={handleIssueTicket}>티켓 발급</ActionBtn>
      </BtnRow>

      <BackBtn onClick={() => navigate('/')}>메인으로</BackBtn>
    </Wrapper>
  );
};

export default CompletePage;


const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 3rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.surface};
  border-radius: 10px;
  padding: 2rem;
  text-align: left;
  font-size: 1rem;
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

const BtnRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionBtn = styled.button`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: #fff;
  }
`;

const BackBtn = styled.button`
  background: ${({ theme }) => theme.primary};
  border: none;
  padding: 0.9rem 1.6rem;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
`;
