import React from 'react';
import styled from 'styled-components';

const Mypage: React.FC = () => {
  // 목업 유저 & 예매 정보
  const user = {
    name: '홍길동',
    username: 'hong123',
    phone: '010-1234-5678',
    email: 'hong@example.com',
    points: 1200,
  };

  const reservations = [
    {
      id: 'R202405171001',
      movieTitle: '이너월드',
      date: '2024-05-20',
      time: '16:00',
      theater: 'CGV 강남',
      seatList: ['C3', 'C4'],
      totalPrice: 22000,
    },
    {
      id: 'R202405171002',
      movieTitle: '소울플레이',
      date: '2024-05-22',
      time: '18:30',
      theater: 'CGV 용산',
      seatList: ['B1'],
      totalPrice: 11000,
    },
  ];

  return (
    <Wrapper>
      <Title>마이페이지</Title>

      <Section>
        <h3>👤 개인정보</h3>
        <p><strong>이름:</strong> {user.name}</p>
        <p><strong>아이디:</strong> {user.username}</p>
        <p><strong>연락처:</strong> {user.phone}</p>
        <p><strong>이메일:</strong> {user.email}</p>
        <p><strong>포인트:</strong> {user.points.toLocaleString()} P</p>
        <ActionRow>
          <Btn onClick={() => alert('정보 수정은 준비 중입니다.')}>정보 수정</Btn>
          <Btn onClick={() => alert('회원 탈퇴는 준비 중입니다.')}>회원 탈퇴</Btn>
        </ActionRow>
      </Section>

      <Section>
        <h3>🧾 예매 내역</h3>
        {reservations.map((r) => (
          <Card key={r.id}>
            <p><strong>예매번호:</strong> {r.id}</p>
            <p><strong>영화:</strong> {r.movieTitle}</p>
            <p><strong>일시:</strong> {r.date} {r.time}</p>
            <p><strong>극장:</strong> {r.theater}</p>
            <p><strong>좌석:</strong> {r.seatList.join(', ')}</p>
            <p><strong>결제금액:</strong> {r.totalPrice.toLocaleString()}원</p>
          </Card>
        ))}
      </Section>
    </Wrapper>
  );
};

export default Mypage;

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.primary};
`;

const Section = styled.section`
  background: ${({ theme }) => theme.surface};
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;

  h3 {
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
  }

  p {
    margin: 0.4rem 0;
  }
`;

const Card = styled.div`
  border-top: 1px solid #333;
  margin-top: 1rem;
  padding-top: 1rem;
`;

const ActionRow = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
`;

const Btn = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background: #c1130a;
  }
`;
