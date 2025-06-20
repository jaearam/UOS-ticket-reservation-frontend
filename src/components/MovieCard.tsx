import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/Movie';

type Props = {
  movie: Movie;
};

const MovieCard: React.FC<Props> = ({ movie }) => {
  const navigate = useNavigate();
  const isDisabled = movie.screeningStatus === 'U' || movie.screeningStatus === 'E';
  return (
    <Card>
      <Poster src={movie.image} alt={movie.title} />
      <Overlay>
        <Title>{movie.title}</Title>
        <Genre>{movie.genre}</Genre>
        <Release>{movie.releaseDate}</Release>
        <ReserveBtn
          disabled={isDisabled}
          onClick={() => {
            if (!isDisabled) navigate(`/movie/${movie.id}`);
          }}
        >상세보기</ReserveBtn>
      </Overlay>
    </Card>
  );
};

export default MovieCard;

const Card = styled.div`
  width: 200px;
  flex-shrink: 0;  // 가로 스크롤 유지
  margin-right: 1rem;

  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: ${({ theme }) => theme.card};
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
  &:hover div {
    opacity: 1;
    transform: translateY(0);
  }
`;


const Poster = styled.img`
  width: 100%;
  height: 270px;
  object-fit: cover;
  display: block;
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  width: 100%;
  padding: 1rem;
  color: white;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(100%);
`;

const Title = styled.h4`
  margin: 0;
  font-size: 1rem;
`;

const Genre = styled.p`
  font-size: 0.8rem;
  color: #bbb;
  margin: 0.3rem 0 0;
`;

const Release = styled.p`
  font-size: 0.75rem;
  color: #999;
  margin: 0.2rem 0 0.6rem;
`;

const ReserveBtn = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.18s, color 0.18s, opacity 0.18s;
  &:hover:enabled {
    background: #c1130a;
  }
  &:disabled {
    background: #aaa;
    color: #eee;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
