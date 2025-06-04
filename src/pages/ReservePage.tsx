import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReserveDate from '../components/ReserveDate';
import ReserveTime from '../components/ReserveTime';
import ReserveSeat from '../components/ReserveSeat';
import ReserveMovieInfo from '../components/ReserveMovieInfo';
import { Schedule } from '../types/Schedule';
import { Seat } from '../types/Seats'

console.log('Authentication token', localStorage.getItem('accessToken'));

const ReservePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const movieId = Number(id);
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = !!accessToken;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
  // 날짜나 스케줄이 바뀌면 선택 좌석 초기화
  setSelectedSeats([]);
}, [selectedDate, selectedSchedule]);

  // ✅ 좌석 데이터 불러오기
  useEffect(() => {
    if (selectedSchedule?.id) {
      axios
        .get(`http://localhost:8080/api/reservations/schedules/${selectedSchedule.id}/seats`)
        .then((res) => {
          setSeats(res.data.seats);
        })
        .catch((err) => console.error('좌석 정보 조회 실패:', err));
    }
  }, [selectedSchedule]);

    const handleToggleSeat = (seatNumber: string) => {
      setSelectedSeats((prev) =>
        prev.includes(seatNumber)
          ? prev.filter((s) => s !== seatNumber)
          : [...prev, seatNumber]
      );
    };


const handleReserve = async () => {

  
  if (!selectedSchedule || selectedSeats.length === 0) {
    alert('좌석을 선택해주세요.');
    return;
  }
  
  if (selectedSeats.length > 1) {
    alert('현재는 하나의 좌석만 선택할 수 있습니다.');
    return;
  }
  
  if (!isLoggedIn && !phoneNumber.trim()) {
    return alert('로그인하거나 전화번호를 입력해주세요.');
  }

  const selectedSeatNumber = selectedSeats[0];
  console.log('선택한 좌석:', selectedSeatNumber);
  console.log('선택한 스케줄:', selectedSchedule);
  const selectedSeat = seats.find((s) => s.seatLabel === selectedSeatNumber);
  if (!selectedSeat) {
    alert('선택한 좌석 정보를 찾을 수 없습니다.');
    return;
  }

  const payload = {
    scheduleId: Number(selectedSchedule.id),
    seatId: Number(selectedSeat.id),
    phoneNumber: isLoggedIn ? undefined : phoneNumber, // 비회원만 전송
  };

  try {
    console.log('예매 요청 데이터:', payload);
    const response = await axios.post('http://localhost:8080/api/reservations/create', payload,
    {
      headers: isLoggedIn ? { Authorization: `Bearer ${accessToken}` } : {},
    }
    );

    const reservationId = response.data.reservationId;
    console.log('예매 성공:', reservationId);
    navigate('/payment', {
      state: {
        reservationId,
      },
    });
  } catch (error) {
    console.error('예매 실패:', error);
    alert('예매에 실패했습니다.');
  }
};


  return (
    <Wrapper>
      <h2>영화 예매</h2>

      <Section>
        <ReserveMovieInfo movieId={movieId} />
      </Section>

      <Section>
        <ReserveDate
          movieId={movieId}
          selectedDate={selectedDate}
          onChange={setSelectedDate}
        />
      </Section>

      <Section>
        <ReserveTime
          movieId={movieId}
          selectedDate={selectedDate}
          selectedSchedule={selectedSchedule}
          onSelectSchedule={setSelectedSchedule}
        />
      </Section>

      {selectedSchedule && (
        <Section>
        <ReserveSeat
          seats={seats}
          scheduleId={selectedSchedule.id}
          selectedSeats={selectedSeats}
          onSelectSeat={handleToggleSeat}
        />
        </Section>
      )}

      {!isLoggedIn && (
      <Section>
        <InputGroup>
          <label>전화번호 (비회원 예매 전용)</label>
          <input
            type="text"
            placeholder="01012345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </InputGroup>
      </Section>
    )}


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

const Section = styled.section`
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
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  label {
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
  }

  input {
    padding: 0.75rem 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};

    &:focus {
      border-color: ${({ theme }) => theme.primary};
      box-shadow: 0 0 0 2px rgba(255, 87, 87, 0.2);
    }
  }
`;