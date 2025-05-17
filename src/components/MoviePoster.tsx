import React from 'react';
import styled from 'styled-components';

type Props = {
  poster: string;
  title: string;
};

const MoviePoster: React.FC<Props> = ({ poster, title }) => {
  return <Poster src={poster} alt={title} />;
};

export default MoviePoster;

const Poster = styled.img`
  width: 320px;
  height: 460px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 0 12px rgba(0,0,0,0.3);
`;
