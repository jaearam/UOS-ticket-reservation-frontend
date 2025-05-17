import React from 'react';
import styled from 'styled-components';

type Props = {
  title: string;
  genre: string;
  release: string;
  poster: string;
};

const ReserveMovieInfo: React.FC<Props> = ({ title, genre, release, poster }) => {
  return (
    <Box>
      <Poster src={poster} alt={title} />
      <Info>
        <h3>{title}</h3>
        <p>장르: {genre}</p>
        <p>개봉일: {release}</p>
      </Info>
    </Box>
  );
};

export default ReserveMovieInfo;

const Box = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Poster = styled.img`
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.primary};
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.textMuted};
  }
`;
