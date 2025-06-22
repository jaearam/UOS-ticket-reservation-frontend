import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Reservation } from '../types/Reservation';

const CompletePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    // PaymentPage에서 state로 넘겨준 reservation 배열을 사용
    if (location.state?.reservations) {
      setReservations(location.state.reservations);
    } else {
      // state에 데이터가 없으면 홈으로 보냄 (잘못된 접근 방지)
      alert('잘못된 접근입니다.');
      navigate('/');
    }
  }, [location.state, navigate]);

  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [tickets, setTickets] = useState<Reservation[]>([]);
  const [currentTicket, setCurrentTicket] = useState(0);
  const [isIssuing, setIsIssuing] = useState(false);

  const handleIssueTickets = async () => {
    if (reservations.length === 0) return;
    setIsIssuing(true);
    const reservationIds = reservations.map(r => r.id);
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = !!accessToken;

    try {
      await Promise.all(
        reservationIds.map((id: string) =>
          axios.post(
            `http://localhost:8080/api/reservations/${id}/issue`,
            {},
            {
              headers: isLoggedIn ? { Authorization: `Bearer ${accessToken}` } : {},
            }
          )
        )
      );

      // API 응답 대신 기존 예매 정보를 티켓으로 설정
      setTickets(reservations);
      setCurrentTicket(0);
      setTicketModalOpen(true);
    } catch (err) {
      alert('티켓 발급에 실패했습니다.');
    } finally {
      setIsIssuing(false);
    }
  };
  
  if (reservations.length === 0) {
    return <Wrapper>예매 정보를 불러오는 중입니다...</Wrapper>;
  }

  // 대표 정보 (첫 번째 예매 기준)
  const mainReservation = reservations[0];
  const time = new Date(mainReservation.screeningStartTime).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // 전체 정보 취합
  const allReservationIds = reservations.map(r => r.id).join(', ');
  const allSeatLabels = reservations.map(r => r.seatLabel).join(', ');
  const totalPrice = reservations.reduce((sum, r) => sum + r.finalPrice, 0);

  return (
    <Wrapper>
      <Title>예매가 완료되었습니다 🎉</Title>
      <Card>
        <Row>
          <strong>예매 번호</strong> {allReservationIds}
        </Row>
        <Row>
          <strong>영화</strong> {mainReservation.movieTitle}
        </Row>
        <Row>
          <strong>일시</strong> {mainReservation.screeningDate} {time}
        </Row>
        <Row>
          <strong>극장</strong> {mainReservation.cinemaName} / {mainReservation.screenName}
        </Row>
        <Row>
          <strong>좌석</strong> {allSeatLabels}
        </Row>
        <Row>
          <strong>결제</strong> {totalPrice.toLocaleString()}원
        </Row>
      </Card>
      <BtnRow>
        <ActionBtn onClick={handleIssueTickets} disabled={isIssuing}>
          {isIssuing ? '발급 중...' : '티켓 발급'}
        </ActionBtn>
      </BtnRow>
      <BackBtn onClick={() => navigate('/')}>메인으로</BackBtn>

      {ticketModalOpen && tickets.length > 0 && (
        <ModalOverlay onClick={() => setTicketModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <span>티켓 {currentTicket + 1} / {tickets.length}</span>
              <CloseBtn onClick={() => setTicketModalOpen(false)}>×</CloseBtn>
            </ModalHeader>
            <TicketBody>
              <p><strong>예매번호:</strong> {tickets[currentTicket].id}</p>
              <p><strong>영화:</strong> {tickets[currentTicket].movieTitle}</p>
              <p><strong>일시:</strong> {tickets[currentTicket].screeningDate} {new Date(tickets[currentTicket].screeningStartTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
              <p><strong>극장:</strong> {tickets[currentTicket].cinemaName} / {tickets[currentTicket].screenName}</p>
              <p><strong>좌석:</strong> {tickets[currentTicket].seatLabel}</p>
              <p><strong>결제:</strong> {tickets[currentTicket].finalPrice.toLocaleString()}원</p>
            </TicketBody>
            {tickets.length > 1 && (
              <ModalNav>
                <NavBtn onClick={() => setCurrentTicket((currentTicket - 1 + tickets.length) % tickets.length)}>&lt;</NavBtn>
                <NavBtn onClick={() => setCurrentTicket((currentTicket + 1) % tickets.length)}>&gt;</NavBtn>
              </ModalNav>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 2rem 2.5rem;
  min-width: 320px;
  min-height: 180px;
  position: relative;
  color: #222;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;
const TicketBody = styled.div`
  margin-bottom: 1.5rem;
  color: #222;
  p {
    margin: 0.5rem 0;
    word-break: break-all;
  }
`;
const ModalNav = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
`;
const NavBtn = styled.button`
  background: #eee;
  border: none;
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1.3rem;
  cursor: pointer;
  &:hover {
    background: #ddd;
  }
`;
