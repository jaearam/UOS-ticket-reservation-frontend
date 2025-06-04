import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const formatDate = (dateStr: string) => {
  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
};

interface Props {
  movieId: number;
  selectedDate: string;
  onChange: (date: string) => void;
}

const ReserveDate: React.FC<Props> = ({ movieId, selectedDate, onChange }) => {
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/reservations/movies/${movieId}/dates`)
      .then((res) => setDates(res.data.dates))
      .catch((err) => console.error('상영 가능 날짜 조회 실패:', err));
  }, [movieId]);

  return (
    <ScrollRow>
      {dates.map((date) => (
        <DateButton
          key={date}
          selected={date === selectedDate}
          onClick={() => onChange(date)}
        >
          {formatDate(date)}
        </DateButton>
      ))}
    </ScrollRow>
  );
};

export default ReserveDate;


const DateRow = styled.div`
  display: flex;
  gap: 0.5rem;
  min-width: max-content; // ✅ 중요! 요소가 넘치게 만들어야 스크롤됨
`;


const DateButton = styled.button<{ selected: boolean }>`
  min-width: 90px;
  flex-shrink: 0;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background: ${({ theme, selected }) => (selected ? theme.primary : theme.surface)};
  color: ${({ selected }) => (selected ? '#fff' : '#ccc')};

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: #fff;
  }
`;

const ScrollRow = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem 2rem;

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
