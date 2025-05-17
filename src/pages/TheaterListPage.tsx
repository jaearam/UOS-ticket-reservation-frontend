import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const theaters = [
  {
    id: 1,
    name: 'CGV 강남',
    location: '서울시 강남구 테헤란로 123',
    screenCount: 6,
  },
  {
    id: 2,
    name: 'CGV 용산아이파크몰',
    location: '서울시 용산구 한강대로 23길',
    screenCount: 10,
  },
  {
    id: 3,
    name: 'CGV 홍대입구',
    location: '서울시 마포구 양화로 23',
    screenCount: 5,
  },
];

const TheaterListPage: React.FC = () => {
  return (
    <Wrapper>
      <Title>영화관 목록</Title>
      <Grid>
        {theaters.map((theater) => (
          <Card key={theater.id}>
            <h3>{theater.name}</h3>
            <p>{theater.location}</p>
            <p>상영관 수: {theater.screenCount}개</p>

            <Link to={`/theaters/${theater.id}`}>상세보기</Link>

          </Card>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default TheaterListPage;

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.primary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.surface};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.3rem 0;
    color: ${({ theme }) => theme.textMuted};
  }
`;
