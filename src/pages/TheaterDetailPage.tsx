// pages/TheaterDetailPage.tsx
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
  const navigate = useNavigate();

  const [cinema, setCinema] = useState<{ name: string; location: string; screenCount: number } | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getToday());
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    if (!cinemaId) return;
    const accessToken = localStorage.getItem('accessToken');

    axios.get(`http://localhost:8080/api/cinemas/${cinemaId}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })
      .then((res) => setCinema(res.data))
      .catch(console.error);

    axios.get(`http://localhost:8080/api/cinemas/${cinemaId}/movies/current`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })
      .then((res) => setMovies(res.data.movies))
      .catch(console.error);
  }, [cinemaId]);

  useEffect(() => {
    if (!selectedMovie || !selectedDate) return;
    const accessToken = localStorage.getItem('accessToken');
    const date = selectedDate.replaceAll(/-/g, '');

    axios.get(`http://localhost:8080/api/cinemas/${cinemaId}/movies/${selectedMovie.id}/schedules/dates/${date}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })
      .then((res) => {
        // API 응답에 cinemaName이 없으면 현재 페이지의 영화관 정보를 추가
        const schedulesWithCinema = res.data.schedules.map((schedule: Schedule) => ({
          ...schedule,
          cinemaName: schedule.cinemaName || cinema?.name || ''
        }));
        setSchedules(schedulesWithCinema);
      })
      .catch(console.error);
  }, [cinemaId, selectedMovie, selectedDate, cinema]);

  const handleDateClick = (date: string) => setSelectedDate(date);

  const handleScheduleClick = (schedule: Schedule) => {
    console.log('TheaterDetailPage - schedule clicked:', schedule);
    navigate(`/reserve/${selectedMovie?.id}`, {
      state: { selectedSchedule: schedule, selectedDate },
    });
  };

  return (
    <Wrapper>
      {cinema && (
        <CinemaInfo>
          <h2>{cinema.name}</h2>
          <p>{cinema.location}</p>
          <p>상영관 수: {cinema.screenCount}개</p>
        </CinemaInfo>
      )}

      <Section>
        <ScrollRow>
          {getDateRange(7).map((d) => (
            <SelectButton
              key={d}
              selected={selectedDate === d}
              onClick={() => handleDateClick(d)}
            >
              {formatDate(d)}
            </SelectButton>
          ))}
        </ScrollRow>

        <ScrollRow>
          {movies.map((movie) => (
            <SelectButton
              key={movie.id}
              selected={selectedMovie?.id === movie.id}
              onClick={() => setSelectedMovie(movie)}
            >
              {movie.title}
            </SelectButton>
          ))}
        </ScrollRow>
      </Section>

      <ScheduleList>
        {schedules.map((s) => (
          <ScheduleCard key={s.id} onClick={() => handleScheduleClick(s)}>
            <Title>{s.movieTitle}</Title>
            <Time>{s.screeningStartTime.slice(11, 16)} ~ {s.screeningEndTime.slice(11, 16)}</Time>
            <Meta>{s.screenName}</Meta>
          </ScheduleCard>
        ))}
        {schedules.length === 0 && selectedMovie && (
          <EmptyText>선택한 날짜에 해당 영화의 상영 스케줄이 없습니다.</EmptyText>
        )}
      </ScheduleList>
    </Wrapper>
  );
};

export default TheaterDetailPage;

// 스타일 정의
const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const CinemaInfo = styled.div`
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.primary};
  }

  p {
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.95rem;
    margin-top: 0.3rem;
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const ScrollRow = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  margin-bottom: 0.8rem;
`;

const SelectButton = styled.button<{ selected: boolean }>`
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  background: ${({ theme, selected }) => selected ? theme.primary : theme.surface};
  color: ${({ selected }) => selected ? '#fff' : '#ccc'};

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const ScheduleList = styled.div`
  margin-top: 2rem;
`;

const ScheduleCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border-radius: 10px;
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  cursor: pointer;
  box-shadow: 0 0 4px rgba(0,0,0,0.2);
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.primary}22;
  }
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.3rem;
`;

const Time = styled.p`
  font-size: 0.95rem;
  margin-bottom: 0.2rem;
`;

const Meta = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textMuted};
`;

const EmptyText = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: #888;
`;
