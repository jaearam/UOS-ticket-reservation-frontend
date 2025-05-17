import React from 'react';
import styled from 'styled-components';

type Props = {
  selectedDate: string;
  onChange: (date: string) => void;
};

const ReserveDate: React.FC<Props> = ({ selectedDate, onChange }) => {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split('T')[0]; // yyyy-mm-dd
  });

  return (
    <DateRow>
      {dates.map((date) => (
        <DateButton
          key={date}
          selected={date === selectedDate}
          onClick={() => onChange(date)}
        >
          {date}
        </DateButton>
      ))}
    </DateRow>
  );
};

export default ReserveDate;

const DateRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DateButton = styled.button<{ selected: boolean }>`
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background: ${({ theme, selected }) =>
    selected ? theme.primary : theme.surface};
  color: ${({ selected }) => (selected ? '#fff' : '#ccc')};

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: #fff;
  }
`;
