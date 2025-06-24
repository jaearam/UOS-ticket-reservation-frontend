import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface UnpaidReservation {
  id: string;
  scheduleId?: string;
  movieTitle?: string;
  screenName?: string;
  cinemaName?: string;
  seatId?: number;
  seatLabel?: string;
  seatGradeName?: string;
  status?: string;
  reservationTime?: string;
  basePrice?: number;
  discountAmount?: number;
  finalPrice?: number;
  paymentId?: string | null;
  paymentStatus?: string | null;
  ticketIssuanceStatus?: string;
  memberUserId?: string | null;
  userName?: string;
  phoneNumber?: string | null;
  screeningDate?: string;
  screeningStartTime?: string;
  completed?: boolean;
  ticketIssuanceStatusText?: string;
  statusText?: string;
  ticketIssuable?: boolean;
  cancellable?: boolean;
}

interface UnpaidReservationsResponse {
  reservations: UnpaidReservation[];
  checkTime?: string;
  totalCount?: number;
}

const ReservationListPage: React.FC = () => {
  const [reservations, setReservations] = useState<UnpaidReservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutMinutes, setTimeoutMinutes] = useState(30);
  const [isCancelling, setIsCancelling] = useState(false);

  // 미결제 예약 목록 불러오기
  const fetchUnpaidReservations = async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      const res = await axios.get<UnpaidReservationsResponse>('http://localhost:8080/api/reservations/admin/unpaid', { headers });
      setReservations(res.data.reservations || []);
    } catch (e) {
      alert('미결제 예약 목록을 불러오지 못했습니다.');
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidReservations();
  }, []);

  // 만료 미결제 예약 일괄 취소
  const handleCancelExpired = async () => {
    if (!window.confirm(`${timeoutMinutes}분 이전 미결제 예약을 모두 취소하시겠습니까?`)) return;
    setIsCancelling(true);
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      await axios.post(`http://localhost:8080/api/reservations/admin/cancel-expired?timeoutMinutes=${timeoutMinutes}`, {}, { headers });
      alert('만료 미결제 예약이 일괄 취소되었습니다.');
      fetchUnpaidReservations();
    } catch (e) {
      alert('일괄 취소에 실패했습니다.');
    } finally {
      setIsCancelling(false);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    if (dateStr.length === 8) {
      return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
    }
    return dateStr.split('T')[0];
  };

  // 시간 포맷팅
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    if (timeStr.includes('T')) {
      return timeStr.split('T')[1].slice(0, 5);
    }
    return timeStr;
  };

  // 예매 시간 포맷팅
  const formatReservationTime = (timeStr?: string) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return date.toLocaleString('ko-KR');
  };

  return (
    <Container>
      <Header>
        <h2>미결제 예매 관리</h2>
        <CancelBox>
          <label>
            <span>만료 기준(분):</span>
            <TimeoutInput
              type="number"
              min={1}
              value={timeoutMinutes}
              onChange={e => setTimeoutMinutes(Number(e.target.value))}
            />
          </label>
          <CancelButton onClick={handleCancelExpired} disabled={isCancelling}>
            {isCancelling ? '취소 중...' : '만료 미결제 예약 일괄 취소'}
          </CancelButton>
        </CancelBox>
      </Header>
      {isLoading ? (
        <LoadingText>로딩 중...</LoadingText>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>예매ID</th>
                <th>상영일시</th>
                <th>영화명</th>
                <th>영화관/상영관</th>
                <th>좌석</th>
                <th>예매자</th>
                <th>예매시간</th>
                <th>예매상태</th>
                <th>결제상태</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr><td colSpan={9}>미결제 예약이 없습니다.</td></tr>
              ) : (
                reservations.map(rsv => (
                  <tr key={rsv.id}>
                    <td>{rsv.id}</td>
                    <td>
                      {formatDate(rsv.screeningDate)}<br/>
                      {formatTime(rsv.screeningStartTime)}
                    </td>
                    <td>{rsv.movieTitle || '-'}</td>
                    <td>{rsv.cinemaName || '-'}<br/>{rsv.screenName || '-'}</td>
                    <td>{rsv.seatLabel || '-'}</td>
                    <td>{rsv.userName || rsv.phoneNumber || '-'}</td>
                    <td>{formatReservationTime(rsv.reservationTime)}</td>
                    <td>{rsv.statusText || rsv.status || '-'}</td>
                    <td>{rsv.paymentStatus || '미결제'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ReservationListPage;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: #f4f4f4;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;

  h2 {
    font-size: 2rem;
    font-weight: 800;
    color: #e50914;
    margin: 0;
  }
`;

const CancelBox = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #232323;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
`;

const TimeoutInput = styled.input`
  width: 60px;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  border: 1.5px solid #444;
  font-size: 1rem;
  background: #181818;
  color: #fff;
  margin-left: 0.5rem;
  text-align: right;
`;

const CancelButton = styled.button`
  padding: 0.7rem 1.5rem;
  background: #e50914;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  margin-left: 1rem;
  transition: background 0.2s;
  &:hover:enabled {
    background: #b0060f;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #aaa;
  margin: 2rem 0;
`;

const TableContainer = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  overflow: hidden;
  border: 1px solid #333;
  margin-top: 1.5rem;
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 1.1rem 0.7rem;
    text-align: left;
    border-bottom: 1px solid #333;
    white-space: nowrap;
  }
  th {
    background: #2a2a2a;
    font-weight: 700;
    color: #f4f4f4;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  td {
    color: #ccc;
    font-size: 0.97rem;
    vertical-align: middle;
  }
  tbody tr {
    transition: all 0.2s ease;
    &:hover {
      background: #232323;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.13);
    }
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
`; 