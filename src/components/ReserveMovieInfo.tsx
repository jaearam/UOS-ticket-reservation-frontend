import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Props {
  movieId: number;
}

const formatDate = (dateStr: string) => {
  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
};

const ReserveMovieInfo: React.FC<Props> = ({ movieId }) => {
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/movies/${movieId}`)
      .then((res) => setMovie(res.data))
      .catch((err) => console.error('영화 상세 조회 실패:', err));
  }, [movieId]);

  if (!movie) return <div>로딩 중...</div>;

  return (
    <Wrapper>
      <Poster src={movie.image} alt={movie.title} />
      <Info>
        <h3>{movie.title}</h3>
        <p>장르: {movie.genre}</p>
        <p>개봉일: {formatDate(movie.releaseDate)}</p>
      </Info>
    </Wrapper>
  );
};

export default ReserveMovieInfo;

const Wrapper = styled.div`
  display: flex;
  gap: 2rem;
`;

const Poster = styled.img`
  width: 150px;
  height: 220px;
  object-fit: cover;
  border-radius: 6px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;