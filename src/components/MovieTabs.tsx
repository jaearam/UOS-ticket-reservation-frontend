// ✅ MovieTabs.tsx - MovieDto → Movie 변환 포함

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import MovieCard from './MovieCard';

interface MovieDto {
  id: number;
  title: string;
  genre: string;
  releaseDate: string;
  screeningStatus: string;
  image: string;
}

interface Movie {
  id: number;
  title: string;
  genre: string;
  release: string;
  status: 'now' | 'soon';
  poster: string;
}

const mapMovieDtoToMovie = (dto: MovieDto): Movie => ({
  id: dto.id,
  title: dto.title,
  genre: dto.genre,
  release: dto.releaseDate,
  poster: dto.image,
  status: dto.screeningStatus === 'D' ? 'now' : 'soon',
});

const MovieTabs: React.FC = () => {
  const [tab, setTab] = useState<'now' | 'soon'>('now');
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    axios.get('/api/movies')
      .then(res => {
        const mapped = res.data.map((dto: MovieDto) => mapMovieDtoToMovie(dto));
        setMovies(mapped);
      })
      .catch(err => console.error('영화 목록 불러오기 실패:', err));
  }, []);

  const filtered = movies.filter((m) => m.status === tab);

  return (
    <Wrapper>
      <TabHeader>
        <TabButton active={tab === 'now'} onClick={() => setTab('now')}>
          현재 상영작
        </TabButton>
        <TabButton active={tab === 'soon'} onClick={() => setTab('soon')}>
          상영 예정작
        </TabButton>
      </TabHeader>

      <CardGrid>
        {filtered.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </CardGrid>
    </Wrapper>
  );
};

export default MovieTabs;

const Wrapper = styled.div`
  padding: 2rem;
`;

const TabHeader = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: bold;
  color: ${({ theme, active }) => (active ? theme.primary : theme.textMuted)};
  border-bottom: ${({ active, theme }) =>
    active ? `2px solid ${theme.primary}` : 'none'};
  padding-bottom: 4px;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
`;
