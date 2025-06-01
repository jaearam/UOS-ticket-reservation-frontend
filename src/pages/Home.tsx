import React, { useState } from 'react';
import styled from 'styled-components';
import HeroBanner from '../components/HeroBanner';
import MovieTabs from '../components/MovieTabs';
import SearchBar from '../components/SearchBar';


const Home: React.FC = () => {

  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('검색어:', query);
    // 나중에 전역 상태 or 필터링 적용 가능
  };


  return (
    <PageWrapper>
      <HeroBanner />
        <SearchWrapper>
        <SearchBar
          query={query}
          onChange={(e) => setQuery(e.target.value)}
          onSubmit={handleSearch}
        />
      </SearchWrapper>
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

const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5rem 1rem 0;
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
