import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Cinema {
  id: string;
  name: string;
  location: string;
  regionId: string;
  regionName: string;
  screenCount: number;
}

const TheaterListPage: React.FC = () => {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    axios.get('http://localhost:8080/api/cinemas', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    .then((res) => setCinemas(res.data))
    .catch((err) => {
      console.error('영화관 목록 불러오기 실패:', err);
      alert('영화관 목록을 불러오지 못했습니다.');
    });
  }, []);

  return (
    <Wrapper>
      <Title>영화관 목록</Title>
      <Grid>
        {cinemas.map((cinema) => (
          <Card key={cinema.id}>
            <h3>{cinema.name}</h3>
            <p>{cinema.location}</p>
            <p>지역: {cinema.regionName}</p>
            <p>상영관 수: {cinema.screenCount}개</p>
            <Link to={`/theaters/${cinema.id}`}>상세보기</Link>
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
