import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { movies } from '../data/movies';
import MoviePoster from '../components/MoviePoster';
import MovieInfoPanel from '../components/MovieInfoPanel';
import MovieDetailTabs from '../components/MovieDetailTabs';

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const movie = movies.find((m) => m.id.toString() === id);
    const navigate = useNavigate(); // ✅ 추가

  if (!movie) return <Container><h2>영화를 찾을 수 없습니다.</h2></Container>;

  return (
    <Container>
        <BackButton onClick={() => navigate(-1)}>← 뒤로가기</BackButton>
      <MoviePoster poster={movie.poster} title={movie.title} />
      <MovieInfoPanel
        id={movie.id}
        title={movie.title}
        genre={movie.genre}
        release={movie.release}
      />
      <MovieDetailTabs />
    </Container>
  );
};

export default MovieDetail;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  flex-direction: column;  // ✅ 세로 정렬
  display: flex;
  gap: 2rem;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const BackButton = styled.button`
  align-self: flex-start;  
  margin-bottom: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.95rem;
  cursor: pointer;
  align-self: flex-start;
  padding-left: 0.2rem;

  &:hover {
    color: ${({ theme }) => theme.primary};
    text-decoration: underline;
  }
`;
