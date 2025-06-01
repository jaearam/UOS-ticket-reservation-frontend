import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Seat } from '../types/Seats'

interface Props {
  seats: Seat[]
  scheduleId: string;
  selectedSeats: string[];
  onSelectSeat: (seatNumber: string) => void;
}

const ReserveSeat: React.FC<Props> = ({ scheduleId, selectedSeats, onSelectSeat }) => {
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/reservations/schedules/${scheduleId}/seats`)
      .then((res) => {
        const reservedIds: number[] = res.data.reservedSeatIds;
        const fetchedSeats: Seat[] = res.data.seats.map((s: any) => ({
          id: s.id,
          seatNumber: s.seatLabel, // UI에 표시될 이름
          row: s.row,
          column: s.column,
          price: s.price,
          seatGradeId: s.seatGradeId,
          seatGradeName: s.seatGradeName,
          available: !reservedIds.includes(s.id),
        }));
        setSeats(fetchedSeats);
      })
      .catch((err) => console.error('좌석 조회 실패:', err));
  }, [scheduleId]);

  return (
    <SeatGrid>
      {seats.map((seat) => (
        <SeatBox
          key={seat.seatNumber}
          selected={selectedSeats.includes(seat.seatNumber)}
          disabled={!seat.available}
          onClick={() => seat.available && onSelectSeat(seat.seatNumber)}
          title={`${seat.seatGradeName} - ${seat.price.toLocaleString()}원`}
        >
          {seat.seatNumber}
        </SeatBox>
      ))}
    </SeatGrid>
  );
};

export default ReserveSeat;

const SeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.6rem;
`;

const SeatBox = styled.div<{ selected: boolean; disabled: boolean }>`
  padding: 0.8rem;
  background: ${({ selected, disabled, theme }) =>
    disabled ? '#555' : selected ? theme.primary : theme.surface};
  color: ${({ selected, disabled }) =>
    disabled ? '#999' : selected ? '#fff' : '#aaa'};
  border-radius: 4px;
  text-align: center;
  font-size: 0.85rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  user-select: none;

  &:hover {
    background: ${({ theme, disabled }) => (!disabled ? theme.primary : undefined)};
    color: ${({ disabled }) => (!disabled ? '#fff' : undefined)};
  }
`;
