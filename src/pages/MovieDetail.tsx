import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import MoviePoster from '../components/MoviePoster';
import MovieInfoPanel from '../components/MovieInfoPanel';
import MovieDetailTabs from '../components/MovieDetailTabs';

interface MovieDetailDto {
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

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  if (dateStr.length === 8) {
    return `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`;
  }
  if (dateStr.length === 10 && dateStr.includes('-')) return dateStr;
  return dateStr;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieDetailDto | null>(null);

  useEffect(() => {
    if (!id) return;
    axios
      .get<MovieDetailDto>(`http://localhost:8080/api/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch((err) => console.error('영화 상세 정보 로드 실패:', err));
  }, [id]);

  if (!movie) return <Container>로딩 중...</Container>;

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>← 뒤로가기</BackButton>

      <MoviePoster poster={movie.image} title={movie.title} />
      <MovieInfoPanel
        id={movie.id}
        title={movie.title}
        genre={movie.genre}
        releaseDate={formatDate(movie.releaseDate)}
        description={movie.description}
        viewingGrade={movie.viewingGradeText}
        rating={movie.rating}
        distributorName={movie.distributorName}
        directorName={movie.directorName}
        runtime={movie.runtime}
      />
      {movie && (
        <MovieDetailTabs
          description={movie.description}
          movieId={movie.id}
          stillImages={movie.image ? [movie.image] : []}
        />
      )}


    </Container>
  );
};

export default MovieDetail;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  flex-direction: column;
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

  &:hover {
    color: ${({ theme }) => theme.primary};
    text-decoration: underline;
  }
`;

const Section = styled.section`
  background: ${({ theme }) => theme.surface};
  padding: 1.5rem;
  border-radius: 10px;
`;
