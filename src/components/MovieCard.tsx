import React from 'react';
import styled from 'styled-components';
import { Movie } from '../data/movies';
import { useNavigate } from 'react-router-dom';

type Props = {
  movie: Movie;
};

const MovieCard: React.FC<Props> = ({ movie }) => {
    const navigate = useNavigate();
  return (

    <Card onClick={() => navigate(`/movie/${movie.id}`)}>
      <Poster src={movie.poster} alt={movie.title} />
      <Overlay>
        <Title>{movie.title}</Title>
        <Genre>{movie.genre}</Genre>
        <Release>{movie.release}</Release>
        <ReserveBtn>예매하기</ReserveBtn>
      </Overlay>
    </Card>
  );
};

export default MovieCard;

const Card = styled.div`
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
  &:hover {
    background: #c1130a;
  }
`;
