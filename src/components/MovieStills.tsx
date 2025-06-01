import React from 'react';
import styled from 'styled-components';

const MovieStills: React.FC<{ images: string[] }> = ({ images }) => {
  return (
    <Wrapper>
      {images.length === 0 ? (
        <p>스틸컷이 없습니다.</p>
      ) : (
        images.map((src, idx) => (
          <StillImage key={idx} src={src} alt={`스틸컷 ${idx + 1}`} />
        ))
      )}
    </Wrapper>
  );
};

export default MovieStills;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
`;

const StillImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
`;
