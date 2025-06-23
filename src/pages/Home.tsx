import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import HeroBanner from '../components/HeroBanner';
import MovieTabs from '../components/MovieTabs';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import { Movie } from '../types/Movie';
import MovieCard from '../components/MovieCard';

const Home: React.FC = () => {

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

useEffect(() => {
  if (query.trim() === '') {
    setSearchResults([]);
    console.log(searchResults);
  }
}, [query]);


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await axios.get('http://localhost:8080/api/movies/search', {
        params: {
          keyword: query,
          page: 0,
          size: 10,
        },
      });
      setSearchResults(res.data.content); // page response 기준
    } catch (err) {
      console.error('검색 실패:', err);
      alert('검색 중 오류가 발생했습니다.');
    }
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
      {searchResults.length > 0 && (
      <Section>
        <SectionTitle>🔍 검색 결과</SectionTitle>
        <MovieList>
          {searchResults.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                    />
          ))}
        </MovieList>
      </Section>
    )}

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

const MovieList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1.2rem;
`;
