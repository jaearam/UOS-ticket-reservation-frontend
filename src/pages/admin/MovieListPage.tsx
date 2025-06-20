import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../types/Movie';

const MovieListPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);
  useEffect(() => {
    fetchMovies();
  }, []);

    const fetchMovies = async () => {
    try {
        const res = await axios.get('http://localhost:8080/api/movies', {
          params: { page: 0, size: 20 },
          headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        });
        setMovies(res.data.content);
    } catch (err) {
        console.error('영화 목록 조회 실패:', err);
    }
    };

  const handleEdit = (id: number) => {
    navigate(`/admin/movies/edit/${id}`);
  };

  const handleSchedule = (id: number) => {
    navigate(`/admin/movies/schedule/${id}`);
  };

const handleDelete = async (id: number) => {
  if (!window.confirm('정말로 이 영화를 삭제하시겠습니까?')) return;
  try {
    await axios.delete(`http://localhost:8080/api/movies/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setMovies((prev) => prev.filter((movie) => movie.id !== id));
  } catch (err) {
    console.error('영화 삭제 실패:', err);
  }
};


  const handleAddMovie = () => {
    navigate('/admin/movies/add');
  };

  return (
    <Wrapper>
      <h2>전체 영화 목록</h2>
      <Grid>
        {movies.map((movie) => (
          <MovieCard key={movie.id}>
            <Image src={movie.image} alt={movie.title} />
            <Title>{movie.title}</Title>
            <ButtonRow>
              <EditButton onClick={() => handleEdit(movie.id)}>정보 수정</EditButton>
              <ScheduleButton onClick={() => handleSchedule(movie.id)}>상영일정조정</ScheduleButton>
              <DeleteButton onClick={() => handleDelete(movie.id)}>삭제</DeleteButton>
            </ButtonRow>
          </MovieCard>
        ))}
        <AddCard onClick={handleAddMovie}>+</AddCard>
      </Grid>
    </Wrapper>
  );
};

export default MovieListPage;

// 스타일
const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Grid = styled.div`
  display: grid;
  gap: 1.2rem;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  margin-top: 2rem;
`;

const MovieCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid #444;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.9rem;
  flex-wrap: wrap;
`;

const EditButton = styled.button`
  flex: 1;
  min-width: 90px;
  max-width: 100%;
  padding: 0.5rem 0.7rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  white-space: nowrap;

  &:hover {
    background: '#5b5be0';
  }
`;

const ScheduleButton = styled.button`
  flex: 1;
  min-width: 110px;
  max-width: 100%;
  padding: 0.5rem 0.7rem;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  white-space: nowrap;
  transition: background 0.18s;

  &:hover {
    background: #b0060f;
  }
`;

const DeleteButton = styled.button`
  flex: 1;
  min-width: 70px;
  max-width: 100%;
  padding: 0.5rem 0.7rem;
  background: #b91c1c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  white-space: nowrap;

  &:hover {
    background: #991b1b;
  }
`;

const AddCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  border: 2px dashed #666;
  border-radius: 10px;
  cursor: pointer;
  background: ${({ theme }) => theme.surface};
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.primary}22;
  }
`;
