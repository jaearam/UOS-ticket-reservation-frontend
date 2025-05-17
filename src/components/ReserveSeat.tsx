import React from 'react';
import styled from 'styled-components';

type Props = {
  selectedSeats: string[];
  onSelectSeat: (seat: string) => void;
};

const ReserveSeat: React.FC<Props> = ({ selectedSeats, onSelectSeat }) => {
  const rows = 'ABCDEFGHIJ'.split('');
  const seats = rows.flatMap((row) =>
    Array.from({ length: 8 }, (_, i) => `${row}${i + 1}`)
  );

  return (
    <Grid>
      {seats.map((seat) => (
        <SeatBox
          key={seat}
          selected={selectedSeats.includes(seat)}
          onClick={() => onSelectSeat(seat)}
        >
          {seat}
        </SeatBox>
      ))}
    </Grid>
  );
};

export default ReserveSeat;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.6rem;
`;

const SeatBox = styled.div<{ selected: boolean }>`
  padding: 0.8rem;
  background: ${({ selected, theme }) =>
    selected ? theme.primary : theme.surface};
  color: ${({ selected }) => (selected ? '#fff' : '#aaa')};
  border-radius: 4px;
  text-align: center;
  font-size: 0.85rem;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;
