import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const theaterData = [
  {
    id: 1,
    name: 'CGV 강남',
    location: '서울시 강남구 테헤란로 123',
    screenCount: 6,
    schedule: [
      { movie: '이너월드', time: '12:00 / 15:00 / 18:00' },
      { movie: '몬스터즈', time: '13:30 / 16:30 / 20:00' },
    ],
  },
  {
    id: 2,
    name: 'CGV 용산아이파크몰',
    location: '서울시 용산구 한강대로 23길',
    screenCount: 10,
    schedule: [
      { movie: '소울플레이', time: '11:00 / 14:00 / 17:00' },
    ],
  },
];

const TheaterDetailPage: React.FC = () => {
  const { id } = useParams();
  const theater = theaterData.find((t) => t.id.toString() === id);

  if (!theater) return <Wrapper>해당 영화관을 찾을 수 없습니다.</Wrapper>;

  return (
    <Wrapper>
      <Title>{theater.name}</Title>
      <Info>
        <p><strong>주소:</strong> {theater.location}</p>
        <p><strong>상영관 수:</strong> {theater.screenCount}개</p>
      </Info>

      <Section>
        <h3>상영 중인 영화</h3>
        {theater.schedule.map((s, idx) => (
          <MovieRow key={idx}>
            🎬 <strong>{s.movie}</strong> - {s.time}
          </MovieRow>
        ))}
      </Section>
    </Wrapper>
  );
};

export default TheaterDetailPage;

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.primary};
`;

const Info = styled.div`
  margin-bottom: 2rem;
  p {
    margin: 0.4rem 0;
  }
`;

const Section = styled.section`
  background: ${({ theme }) => theme.surface};
  padding: 1.5rem;
  border-radius: 8px;
`;

const MovieRow = styled.div`
  margin: 0.6rem 0;
`;
