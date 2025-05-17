import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { movies } from '../data/movies';
import MoviePoster from '../components/MoviePoster';
import MovieInfoPanel from '../components/MovieInfoPanel';
import MovieDetailTabs from '../components/MovieDetailTabs';

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const movie = movies.find((m) => m.id.toString() === id);

  if (!movie) return <Container><h2>영화를 찾을 수 없습니다.</h2></Container>;

  return (
    <Container>
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
  display: flex;
  gap: 2rem;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.text};
`;
