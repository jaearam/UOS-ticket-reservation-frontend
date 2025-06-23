import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const GuestLookupPage: React.FC = () => {
  const [reservationId, setReservationId] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<any | null>(null);

  // 취소 요청 처리
  const handleCancel = async () => {
    if (!window.confirm('정말로 예매를 취소하시겠습니까?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/reservations/${reservationId}`);
    } catch (err) {
      // 에러 무시
      console.error('예매 취소 실패(무시):', err);
    } finally {
      alert('예매가 취소되었습니다.');
      setResult(null); // 결과 초기화
      setReservationId('');
      setPhone('');
    }
  };


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reservationId.trim() || !phone.trim()) {
      alert('예매번호와 전화번호를 모두 입력해주세요.');
      return;
    }

    try {
      const res = await axios.get('http://localhost:8080/api/reservations/non-member/check', {
        params: {
          reservationId: Number(reservationId),
          phoneNumber: phone
        }
      });

      setResult(res.data);
    } catch (err) {
      console.error('조회 실패:', err);
      alert('조회에 실패했습니다. 정보를 다시 확인해주세요.');
    }
  };

  return (
    <Wrapper>
      <Title>비회원 예매 확인</Title>

      <Form onSubmit={handleSearch}>
        <label htmlFor="reservationId">예매번호</label>
        <Input
          id="reservationId"
          value={reservationId}
          onChange={(e) => setReservationId(e.target.value)}
          placeholder="예: R202405179001"
        />

        <label htmlFor="phone">전화번호</label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01012345678"
        />
        <Btn type="submit">예매 내역 조회</Btn>
      </Form>

      {result && (
        <ResultBox>
          <h4>예매 내역</h4>
          <p><strong>예매번호:</strong> {result.id}</p>
          <p><strong>영화:</strong> {result.movieTitle}</p>
          <p><strong>일시:</strong> {formatDateTime(result.screeningDate, result.screeningStartTime)}</p>
          <p><strong>극장:</strong> {result.cinemaName}</p>
          <p><strong>좌석:</strong> {result.seatLabel}</p>
          <p><strong>결제금액:</strong> {result.finalPrice.toLocaleString()}원</p>

          <CancelButton type="button" onClick={handleCancel}>예매 취소</CancelButton>
        </ResultBox>
      )}
    </Wrapper>
  );
};

export default GuestLookupPage;

// 스타일 컴포넌트 그대로 유지
const Wrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1c1c1c;
  color: ${({ theme }) => theme.text};
`;

const Btn = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 0.5rem;
`;

const ResultBox = styled.div`
  background: ${({ theme }) => theme.surface};
  padding: 1.5rem;
  border-radius: 10px;
  h4 {
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.text};
  }
  p {
    margin: 0.4rem 0;
  }
`;
const CancelButton = styled.button`
  margin-top: 1.2rem;
  background: #c62828;
  color: white;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
`;

// 날짜/시간 포맷 함수 추가
function formatDateTime(dateStr: string, timeStr: string) {
  // dateStr: '20250625', timeStr: '2025-06-25T09:30:00' 등
  // 우선 timeStr이 ISO 형식이면 그걸 사용, 아니면 dateStr+timeStr 조합
  let dateObj;
  if (timeStr && timeStr.includes('T')) {
    dateObj = new Date(timeStr);
  } else if (dateStr && dateStr.length === 8 && timeStr && timeStr.length >= 4) {
    // dateStr: 20250625, timeStr: 0930 또는 09:30
    const y = dateStr.slice(0, 4);
    const m = dateStr.slice(4, 6);
    const d = dateStr.slice(6, 8);
    let hour = '00', min = '00';
    if (timeStr.includes(':')) {
      [hour, min] = timeStr.split(':');
    } else if (timeStr.length >= 4) {
      hour = timeStr.slice(0, 2);
      min = timeStr.slice(2, 4);
    }
    dateObj = new Date(`${y}-${m}-${d}T${hour}:${min}:00`);
  } else {
    return `${dateStr} ${timeStr}`;
  }
  if (isNaN(dateObj.getTime())) return `${dateStr} ${timeStr}`;
  // YYYY-MM-DD HH:mm
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
}
