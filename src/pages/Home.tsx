import React from 'react';
import styled from 'styled-components';
import HeroBanner from '../components/HeroBanner';
import MovieTabs from '../components/MovieTabs';

const Home: React.FC = () => {
  return (
    <PageWrapper>
      <HeroBanner />
      <Section>
        <SectionTitle>무비차트</SectionTitle>
        <MovieTabs />
      </Section>
    </PageWrapper>
  );
};

export default Home;

const PageWrapper = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;
