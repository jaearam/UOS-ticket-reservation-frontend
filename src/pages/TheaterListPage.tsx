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
    axios
      .get('http://localhost:8080/api/cinemas', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => setCinemas(res.data))
      .catch((err) => {
        console.error('영화관 목록 불러오기 실패:', err);
        alert('영화관 목록을 불러오지 못했습니다.');
      });
  }, []);

  const grouped = cinemas.reduce<Record<string, Cinema[]>>((acc, cinema) => {
    if (!acc[cinema.regionName]) acc[cinema.regionName] = [];
    acc[cinema.regionName].push(cinema);
    return acc;
  }, {});

  return (
    <Wrapper>
      <Title>극장 목록</Title>
      {Object.entries(grouped).map(([region, theaters]) => (
        <RegionSection key={region}>
          <RegionTitle>{region}</RegionTitle>
          <TheaterGrid>
            {theaters.map((theater) => (
              <Card key={theater.id}>
                <h3>{theater.name}</h3>
                <p>{theater.location}</p>
                <p>상영관 수: {theater.screenCount}개</p>
                <StyledLink to={`/theaters/${theater.id}`}>상세보기</StyledLink>
              </Card>
            ))}
          </TheaterGrid>
        </RegionSection>
      ))}
    </Wrapper>
  );
};

export default TheaterListPage;


const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 2rem;
`;

const RegionSection = styled.section`
  margin-bottom: 3rem;
`;

const RegionTitle = styled.h3`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.2rem;
  border-left: 4px solid ${({ theme }) => theme.primary};
  padding-left: 0.6rem;
`;

const TheaterGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
`;

const Card = styled.div`
  flex: 1 1 300px;
  background: ${({ theme }) => theme.surface};
  border-radius: 10px;
  padding: 1.2rem 1.4rem;
  box-shadow: 0 0 6px rgba(0,0,0,0.3);

  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0.2rem 0;
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.9rem;
  }
`;

const StyledLink = styled(Link)`
  margin-top: 0.8rem;
  display: inline-block;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.primary};
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
