// ReserveTime.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Schedule } from '../types/Schedule';

type Props = {
  movieId: number;
  selectedDate: string;
  selectedSchedule: Schedule | null;
  onSelectSchedule: (schedule: Schedule) => void;
};

const ReserveTime: React.FC<Props> = ({ movieId, selectedDate, selectedSchedule, onSelectSchedule }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedCinema, setSelectedCinema] = useState('');
  const [selectedScreen, setSelectedScreen] = useState('');
  const [cinemaList, setCinemaList] = useState<string[]>([]);
  const [screenList, setScreenList] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedDate) return;
    const fetchSchedules = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/reservations/movies/${movieId}/dates/${selectedDate}`);
        setSchedules(res.data.schedules);
        const uniqueCinemas = Array.from(
          new Set<string>(res.data.schedules.map((s: Schedule) => s.cinemaName))
        ).sort();
        setCinemaList(uniqueCinemas);
        setSelectedCinema(uniqueCinemas[0]);
      } catch (err) {
        console.error('스케줄 조회 실패:', err);
      }
    };
    fetchSchedules();
  }, [movieId, selectedDate]);

  useEffect(() => {
    const filteredScreens = schedules
      .filter((s) => s.cinemaName === selectedCinema)
      .map((s) => s.screenName);
    const uniqueScreens = Array.from(new Set(filteredScreens)).sort();
    setScreenList(uniqueScreens);
    setSelectedScreen(uniqueScreens[0]);
  }, [selectedCinema, schedules]);

  const handleSelect = (schedule: Schedule) => {
    onSelectSchedule(schedule);
  };

  const filteredSchedules = schedules.filter(
    (s) => s.cinemaName === selectedCinema && s.screenName === selectedScreen
  );

  return (
    <Wrapper>
      <Label>극장 선택</Label>
      <ScrollRow>
        {cinemaList.map((name) => (
          <SelectButton
            key={name}
            selected={name === selectedCinema}
            onClick={() => setSelectedCinema(name)}
          >
            {name}
          </SelectButton>
        ))}
      </ScrollRow>

      <Label>상영관 선택</Label>
      <ScrollRow>
        {screenList.map((screen) => (
          <SelectButton
            key={screen}
            selected={screen === selectedScreen}
            onClick={() => setSelectedScreen(screen)}
          >
            {screen}
          </SelectButton>
        ))}
      </ScrollRow>

      <Label>시간 선택</Label>
      <ScrollRow>
        {filteredSchedules.map((s) => (
          <TimeButton
            key={s.id}
            selected={selectedSchedule?.id === s.id}
            onClick={() => handleSelect(s)}
          >
            {new Date(s.screeningStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </TimeButton>
        ))}
      </ScrollRow>
    </Wrapper>
  );
};

export default ReserveTime;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Label = styled.h4`
  font-size: 1rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.5rem;
`;

const SelectButton = styled.button<{ selected: boolean }>`
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background: ${({ theme, selected }) => (selected ? theme.primary : theme.surface)};
  color: ${({ selected }) => (selected ? '#fff' : '#ccc')};

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const TimeButton = styled.button<{ selected: boolean }>`
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  background: ${({ theme, selected }) => (selected ? theme.primary : theme.surface)};
  color: ${({ selected }) => (selected ? '#fff' : '#ccc')};
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: #fff;
  }
`;

const ScrollRow = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #1c1c1c;
  }

  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 3px;
  }
`;