import React from 'react';
import styled from 'styled-components';

const MovieSynopsis: React.FC<{ description: string }> = ({ description }) => {
  return (
    <Wrapper>
      <p>{description}</p>
    </Wrapper>
  );
};

export default MovieSynopsis;

const Wrapper = styled.div`
  line-height: 1.6;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
`;
