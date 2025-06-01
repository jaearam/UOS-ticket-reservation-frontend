import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MemberDto {
  id: number;
  userId: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  grade: string;
  availablePoints: number;
  gradeText: string;
}

interface ReservationDto {
  id: string;
  movieTitle: string;
  scheduleDate: string;
  scheduleTime: string;
  theaterName: string;
  seatList: string[];
  totalPrice: number;
}

const Mypage: React.FC = () => {
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberDto | null>(null);
  const [reservations, setReservations] = useState<ReservationDto[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const res1 = await axios.get<MemberDto>('http://localhost:8080/api/members/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMember(res1.data);

        const res2 = await axios.get<ReservationDto[]>('http://localhost:8080/api/reservations/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(res2.data);
      } catch (err) {
        console.error('마이페이지 조회 실패:', err);
        alert('회원 정보를 불러올 수 없습니다.');
      }
    };

    fetchData();
  }, [isLoggedIn, token, navigate]);

  if (!member) return <Wrapper>로딩 중...</Wrapper>;

  return (
    <Wrapper>
      <Title>마이페이지</Title>

      <Section>
        <h3>👤 개인정보</h3>
        <p><strong>아이디:</strong> {member.userId}</p>
        <p><strong>이메일:</strong> {member.email}</p>
        <p><strong>전화번호:</strong> {member.phoneNumber}</p>
        <p><strong>생년월일:</strong> {member.birthDate}</p>
        <p><strong>포인트:</strong> {member.availablePoints.toLocaleString()} P</p>
        <ActionRow>
          <Btn onClick={() => navigate('/edit-profile')}>정보 수정</Btn>
          <Btn onClick={() => alert('회원 탈퇴는 준비 중입니다.')}>회원 탈퇴</Btn>
        </ActionRow>
      </Section>

      <Section>
        <h3>🧾 예매 내역</h3>
        {reservations.length === 0 ? (
          <p>예매 내역이 없습니다.</p>
        ) : (
          reservations.map((r) => (
            <Card key={r.id}>
              <p><strong>예매번호:</strong> {r.id}</p>
              <p><strong>영화:</strong> {r.movieTitle}</p>
              <p><strong>일시:</strong> {r.scheduleDate} {r.scheduleTime}</p>
              <p><strong>극장:</strong> {r.theaterName}</p>
              <p><strong>좌석:</strong> {r.seatList.join(', ')}</p>
              <p><strong>결제금액:</strong> {r.totalPrice.toLocaleString()}원</p>
            </Card>
          ))
        )}
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