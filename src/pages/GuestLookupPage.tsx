import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 전화번호 포맷팅 유틸리티 함수들
const formatPhoneNumber = (value: string): string => {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '');
  
  // 길이에 따라 하이픈 추가
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

const removeHyphens = (value: string): string => {
  return value.replace(/-/g, '');
};

const GuestLookupPage: React.FC = () => {
  const [reservationId, setReservationId] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [issuedReservation, setIssuedReservation] = useState<any | null>(null);
  const navigate = useNavigate();

  // 전화번호 입력 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);
    setPhone(formattedValue);
  };

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
          phoneNumber: removeHyphens(phone) // 하이픈 제거하여 서버로 전송
        }
      });

      setResult(res.data);
    } catch (err) {
      console.error('조회 실패:', err);
      alert('조회에 실패했습니다. 정보를 다시 확인해주세요.');
    }
  };

  // 티켓 발급/출력 핸들러
  const handleIssueTicket = async () => {
    if (!result) return;
    try {
      await axios.post(`http://localhost:8080/api/reservations/${result.id}/issue`);
      setIssuedReservation(result);
      setTicketModalOpen(true);
      // 티켓 발급 상태를 즉시 반영
      setResult({ ...result, ticketIssuanceStatus: 'Y' });
    } catch (err) {
      alert('티켓 발급에 실패했습니다.');
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
          placeholder="예: 202405179001"
        />

        <label htmlFor="phone">전화번호</label>
        <Input
          id="phone"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="010-1234-5678"
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
          <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.2rem' }}>
            <CancelButton type="button" onClick={handleCancel}>예매 취소</CancelButton>
            {result.paymentStatus !== 'Y' && (
              <ActionBtn type="button" onClick={() => navigate('/payment', { state: { reservationId: result.id } })}>
                결제하기
              </ActionBtn>
            )}
            {result.paymentStatus === 'Y' && (
              <ActionBtn type="button" onClick={handleIssueTicket} disabled={result.ticketIssuanceStatus === 'Y'}>
                {result.ticketIssuanceStatus === 'Y' ? '티켓 출력 완료' : '티켓 출력'}
              </ActionBtn>
            )}
          </div>
        </ResultBox>
      )}
      <TicketModal open={ticketModalOpen} onClose={() => setTicketModalOpen(false)} reservation={issuedReservation} />
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

const ActionBtn = styled.button`
  margin-top: 1.2rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

// TicketModal 컴포넌트 추가 (Mypage.tsx 참고, 스타일 단순화)
const TicketModal = ({ open, onClose, reservation }: { open: boolean; onClose: () => void; reservation: any | null }) => {
  if (!open || !reservation) return null;
  const [date, time] = reservation.screeningStartTime.split('T');
  return (
    <ModalOverlay>
      <ModalContent>
        <TicketCard>
          <h2>🎟️ 티켓 정보</h2>
          <InfoGrid>
            <InfoRow><strong>예매번호</strong><span>{reservation.id}</span></InfoRow>
            <InfoRow><strong>영화</strong><span>{reservation.movieTitle}</span></InfoRow>
            <InfoRow><strong>일시</strong><span>{date} {time.slice(0, 5)}</span></InfoRow>
            <InfoRow><strong>극장</strong><span>{reservation.cinemaName} / {reservation.screenName}</span></InfoRow>
            <InfoRow><strong>좌석</strong><span>{reservation.seatLabel}</span></InfoRow>
            <InfoRow><strong>결제금액</strong><span>{reservation.finalPrice.toLocaleString()}원</span></InfoRow>
          </InfoGrid>
          <CloseBtn onClick={onClose}>닫기</CloseBtn>
        </TicketCard>
      </ModalContent>
    </ModalOverlay>
  );
};

// TicketModal 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: #222;
  padding: 2rem;
  border-radius: 10px;
  min-width: 320px;
  color: #fff;
  position: relative;
`;
const TicketCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin: 1rem 0 2rem 0;
  align-items: center;
`;
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 320px;
`;
const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #444;
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
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
