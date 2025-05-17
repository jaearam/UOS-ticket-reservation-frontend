import React, { useState } from 'react';
import styled from 'styled-components';
import { movies, Movie } from '../data/movies';
import MovieCard from './MovieCard';

const MovieTabs: React.FC = () => {
  const [tab, setTab] = useState<'now' | 'soon'>('now');

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
        {filtered.map((movie: Movie) => (
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
