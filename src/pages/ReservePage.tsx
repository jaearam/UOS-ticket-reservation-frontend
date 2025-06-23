import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  const { selectedSchedule: scheduleFromState, selectedDate: dateFromState } = location.state || {};
  
  const movieId = Number(id);
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = !!accessToken;

  const [selectedDate, setSelectedDate] = useState(dateFromState || '');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(scheduleFromState || null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayPhone, setDisplayPhone] = useState('');

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

  // 전화번호 입력 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const onlyNumber = value.replace(/[^0-9]/g, '');
    let formatted = onlyNumber;
    if (onlyNumber.length > 3 && onlyNumber.length <= 7) {
      formatted = onlyNumber.slice(0, 3) + '-' + onlyNumber.slice(3);
    } else if (onlyNumber.length > 7) {
      formatted = onlyNumber.slice(0, 3) + '-' + onlyNumber.slice(3, 7) + '-' + onlyNumber.slice(7, 11);
    }
    setPhoneNumber(onlyNumber);
    setDisplayPhone(formatted);
  };

const handleReserve = async () => {
  if (!selectedSchedule || selectedSeats.length === 0) {
    alert('좌석을 선택해주세요.');
    return;
  }

  if (!isLoggedIn && !phoneNumber.trim()) {
    return alert('로그인하거나 전화번호를 입력해주세요.');
  }

  const selectedSeatObjects = selectedSeats
    .map(seatLabel => seats.find(s => s.seatLabel === seatLabel))
    .filter((s): s is Seat => !!s);

  if (selectedSeatObjects.length !== selectedSeats.length) {
    alert('선택한 좌석 정보를 찾을 수 없습니다.');
    return;
  }

  const seatIds = selectedSeatObjects.map(s => s.id);

  const payload = {
    scheduleId: Number(selectedSchedule.id),
    seatIds: seatIds,
    phoneNumber: isLoggedIn ? undefined : phoneNumber,
  };

  try {
    const response = await axios.post('http://localhost:8080/api/reservations/create', payload, {
      headers: isLoggedIn ? { Authorization: `Bearer ${accessToken}` } : {},
    });

    console.log('--- 예매 생성 API 응답 데이터 --- :', response.data);

    const reservationIds = response.data.reservationIds;
    const reservationId = reservationIds && reservationIds[0];

    if (!reservationId) {
      alert('예매 ID를 받아오지 못했습니다. API 응답을 확인해주세요.');
      console.error('API 응답에 reservationIds가 없거나 비어있습니다:', response.data);
      return;
    }

    const reservationDetails = {
      movieTitle: selectedSchedule.movieTitle,
      cinemaName: selectedSchedule.cinemaName,
      screenName: selectedSchedule.screenName,
      screeningDate: selectedSchedule.screeningDate,
      screeningStartTime: selectedSchedule.screeningStartTime,
      seatLabels: selectedSeats,
    };

    navigate('/payment', {
      state: {
        reservationId,
        reservationIds,
        reservationDetails,
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
            placeholder="010-1234-5678"
            value={displayPhone}
            onChange={handlePhoneChange}
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

export default ReservePage;