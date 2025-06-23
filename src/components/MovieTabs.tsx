import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import MovieCard from './MovieCard';

export interface Movie {
  id: number;
  title: string;
  genre: string;
  releaseDate: string;
  screeningStatus: string;
  runtime: number;
  actorName: string;
  directorName: string;
  distributorName: string;
  viewingGrade: string;
  description: string;
  image: string;
  rating: number;
  screeningStatusText: string;
  viewingGradeText: string;
}


const MovieTabs: React.FC = () => {
  const [tab, setTab] = useState<'Y' | 'N' | 'D'>('Y');
  const [movies, setMovies] = useState<Movie[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/movies', {
          params: { status: tab, page: 0, size: 20 },
        });
        setMovies(res.data.content);
        console.log(res.data.content);
      } catch (err) {
        console.error('영화 목록 불러오기 실패:', err);
      }
    };
    fetchMovies();
  }, [tab]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = dir === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Wrapper>
      <TabHeader>
        <TabButton active={tab === 'Y'} onClick={() => setTab('Y')}>현재 상영작</TabButton>
        <TabButton active={tab === 'N'} onClick={() => setTab('N')}>상영 예정작</TabButton>
        <TabButton active={tab === 'D'} onClick={() => setTab('D')}>상영 종료작</TabButton>
      </TabHeader>

      <ScrollContainer>
      <ArrowBtn direction="left" onClick={() => scroll('left')}>
        <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
      </ArrowBtn>
        <ScrollWrapper ref={scrollRef}>
          {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />

          ))}
        </ScrollWrapper>
        <ArrowBtn direction="right" onClick={() => scroll('right')}>
          <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
        </ArrowBtn>
      </ScrollContainer>
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

const ScrollContainer = styled.div`
  position: relative;
`;

const ScrollWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 0.5rem;
  padding: 1rem 2rem;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #1c1c1c;
  }

  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 3px;
  }
`;


const ArrowBtn = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 40%;
  ${({ direction }) => direction}: -10px;
  background: transparent; // ← 배경 제거
  border: none;
  padding: 0.5rem;
  z-index: 10;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
    fill: white;
  }

  &:hover svg {
    fill: ${({ theme }) => theme.primary};
  }
`;
