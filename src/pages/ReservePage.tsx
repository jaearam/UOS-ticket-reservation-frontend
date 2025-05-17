import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { movies } from '../data/movies';
import ReserveMovieInfo from '../components/ReserveMovieInfo';
import ReserveDate from '../components/ReserveDate';
import ReserveTime from '../components/ReserveTime';
import ReserveSeat from '../components/ReserveSeat';

const ReservePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = movies.find((m) => m.id.toString() === id);

  // ✅ Hook은 항상 최상단에서 호출해야 함
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  if (!movie) {
    return <Wrapper><h2>영화를 찾을 수 없습니다.</h2></Wrapper>;
  }

  const handleSeatToggle = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleReserve = () => {
    if (!selectedDate || !selectedTheater || !selectedTime || selectedSeats.length === 0) {
      alert('날짜, 극장, 시간, 좌석을 모두 선택해주세요.');
      return;
    }

    navigate('/payment', {
      state: {
        movieTitle: movie.title,
        date: selectedDate,
        time: selectedTime,
        theater: selectedTheater,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * 11000,
      }
    });
  };

  return (
    <Wrapper>
      <h2>{movie.title} 예매</h2>

      <Section>
        <ReserveMovieInfo
          title={movie.title}
          genre={movie.genre}
          release={movie.release}
          poster={movie.poster}
        />
      </Section>

      <Section>
        <ReserveDate selectedDate={selectedDate} onChange={setSelectedDate} />
      </Section>

      <Section>
        <ReserveTime
          selectedTheater={selectedTheater}
          selectedTime={selectedTime}
          onSelectTheater={setSelectedTheater}
          onSelectTime={setSelectedTime}
        />
      </Section>

      <Section>
        <ReserveSeat selectedSeats={selectedSeats} onSelectSeat={handleSeatToggle} />
      </Section>

      <Section>
        <ReserveButton onClick={handleReserve}>예매하기</ReserveButton>
      </Section>
    </Wrapper>
  );
};

export default ReservePage;

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

const SubTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.textMuted};
`;

const Section = styled.div`
  margin: 2rem 0;
  background: ${({ theme }) => theme.surface};
  padding: 1.5rem;
  border-radius: 8px;
`;

const ReserveButton = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  background: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #c1130a;
  }
`;
