import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CompletePage: React.FC = () => {
  const navigate = useNavigate();

  // 더미 예매 정보 (실제로는 location.state 또는 global state에서 전달받음)
  const reservation = {
    reservationId: 'R202405170123',
    movieTitle: '이너월드',
    date: '2024-05-20',
    time: '16:00',
    theater: 'CGV 강남',
    seatList: ['C3', 'C4'],
    totalPrice: 22000,
    paymentMethod: '카드 결제',
  };

  return (
    <Wrapper>
      <Title>예매가 완료되었습니다 🎉</Title>
      <Card>
        <Row><strong>예매 번호</strong> {reservation.reservationId}</Row>
        <Row><strong>영화</strong> {reservation.movieTitle}</Row>
        <Row><strong>일시</strong> {reservation.date} {reservation.time}</Row>
        <Row><strong>극장</strong> {reservation.theater}</Row>
        <Row><strong>좌석</strong> {reservation.seatList.join(', ')}</Row>
        <Row><strong>결제</strong> {reservation.paymentMethod} / {reservation.totalPrice.toLocaleString()}원</Row>
      </Card>

      <BtnRow>
        <ActionBtn onClick={() => alert('PDF 저장 기능은 준비 중입니다.')}>PDF 저장</ActionBtn>
        <ActionBtn onClick={() => alert('인쇄 기능은 준비 중입니다.')}>인쇄</ActionBtn>
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
