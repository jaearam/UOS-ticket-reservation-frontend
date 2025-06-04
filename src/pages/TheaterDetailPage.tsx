import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Movie } from '../types/Movie';
import { Schedule } from '../types/Schedule';

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getDateRange(days: number) {
  const base = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function formatDate(date: string) {
  const [y, m, d] = date.split('-');
  return `${Number(m)}월 ${Number(d)}일`;
}


const TheaterDetailPage: React.FC = () => {
  const { cinemaId } = useParams();
  console.log('cinemaId:', cinemaId);
  const navigate = useNavigate();

  const [cinema, setCinema] = useState<{ name: string; location: string; screenCount: number } | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getToday());
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    if (!cinemaId) return;

    // 1. 영화관 정보
    axios.get(`http://localhost:8080/api/cinemas/${cinemaId}`)
      .then((res) => setCinema(res.data))
      .catch(console.error);

    // 2. 현재 상영작
    axios.get(`http://localhost:8080/api/cinemas/${cinemaId}/movies/current`)
      .then((res) => setMovies(res.data))
      .catch(console.error);
  }, [cinemaId]);

  useEffect(() => {
    if (!selectedMovie || !selectedDate) return;

    axios.get(`http://localhost:8080/api/cinemas/${cinemaId}/movies/${selectedMovie.id}/schedules/dates/${selectedDate}`)
      .then((res) => setSchedules(res.data))
      .catch(console.error);
  }, [cinemaId, selectedMovie, selectedDate]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleScheduleClick = (scheduleId: string) => {
    navigate(`/reserve/${scheduleId}`);
  };

  return (
    <Wrapper>
      {cinema && (
        <>
          <h2>{cinema.name}</h2>
          <p>{cinema.location}</p>
          <p>상영관 수: {cinema.screenCount}개</p>
        </>
      )}

      <DateSelector>
        {getDateRange(7).map((d) => (
          <button
            key={d}
            onClick={() => handleDateClick(d)}
            className={selectedDate === d ? 'active' : ''}
          >
            {formatDate(d)}
          </button>
        ))}
      </DateSelector>

      <MovieSelector>
        {movies.map((movie) => (
          <button
            key={movie.id}
            onClick={() => setSelectedMovie(movie)}
            className={selectedMovie?.id === movie.id ? 'active' : ''}
          >
            {movie.title}
          </button>
        ))}
      </MovieSelector>

      <ScheduleList>
        {schedules.map((s) => (
          <ScheduleCard key={s.id} onClick={() => handleScheduleClick(s.id)}>
            <p><strong>{s.movieTitle}</strong></p>
            <p>{s.screeningStartTime.slice(11, 16)} ~ {s.screeningEndTime.slice(11, 16)}</p>
            <p>{s.screenName}</p>
          </ScheduleCard>
        ))}
        {schedules.length === 0 && selectedMovie && (
          <p style={{ color: '#888' }}>선택한 날짜에 해당 영화의 상영 스케줄이 없습니다.</p>
        )}
      </ScheduleList>
    </Wrapper>
  );
};

export default TheaterDetailPage;


const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const DateSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;

  button {
    padding: 0.5rem 0.8rem;
    border: none;
    background: #eee;
    border-radius: 6px;
    cursor: pointer;

    &.active {
      background: ${({ theme }) => theme.primary};
      color: white;
    }
  }
`;

const MovieSelector = styled(DateSelector)``;

const ScheduleList = styled.div`
  margin-top: 1.5rem;
`;

const ScheduleCard = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  background: ${({ theme }) => theme.surface};
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.primary}22;
  }

  p {
    margin: 0.3rem 0;
  }
`;
