import React, { useState } from 'react';
import styled from 'styled-components';
import MovieSynopsis from './MovieSynopsis';
import MovieReviews from './MovieReviews';
import MovieStills from './MovieStills';

type Props = {
  description: string;
  movieId: number;
  stillImages?: string[];
};

const MovieDetailTabs: React.FC<Props> = ({ description, movieId, stillImages }) => {
  const [tab, setTab] = useState<'synopsis' | 'review' >('synopsis');

  return (
    <Wrapper>
      <TabMenu>
        <TabBtn active={tab === 'synopsis'} onClick={() => setTab('synopsis')}>줄거리</TabBtn>
        <TabBtn active={tab === 'review'} onClick={() => setTab('review')}>리뷰</TabBtn>
        {/* <TabBtn active={tab === 'stills'} onClick={() => setTab('stills')}>스틸컷</TabBtn> */}
      </TabMenu>

      <Content>
        {tab === 'synopsis' && <MovieSynopsis description={description} />}
        {tab === 'review' && <MovieReviews movieId={movieId} />}
        {/* {tab === 'stills' && <MovieStills images={stillImages ?? []} />} */}
      </Content>
    </Wrapper>
  );
};

export default MovieDetailTabs;


const Wrapper = styled.div`
  margin-top: 3rem;
  padding: 0 1rem;
`;

const TabMenu = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  border-bottom: 1px solid #333;
  margin-bottom: 2rem;
`;

const TabBtn = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  color: ${({ active, theme }) => (active ? theme.primary : theme.textMuted)};
  border-bottom: ${({ active, theme }) => active ? `2px solid ${theme.primary}` : 'none'};
  padding: 0.6rem 1rem;
  cursor: pointer;
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;
