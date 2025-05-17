import React from 'react';
import styled from 'styled-components';

const stillImages = [
  '/images/still1.jpg',
  '/images/still2.jpg',
  '/images/still3.jpg',
  '/images/still4.jpg',
];

const MovieStills: React.FC = () => {
  return (
    <Wrapper>
      <Grid>
        {stillImages.map((src, idx) => (
          <ImageBox key={idx}>
            <img src={src} alt={`스틸컷 ${idx + 1}`} />
          </ImageBox>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default MovieStills;

const Wrapper = styled.div`
  padding: 1rem 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

const ImageBox = styled.div`
  border-radius: 8px;
  overflow: hidden;
  background: #000;
  img {
    width: 100%;
    height: 320px;
    object-fit: cover;
    display: block;
    transition: transform 0.3s;
  }
  &:hover img {
    transform: scale(1.05);
  }
`;
