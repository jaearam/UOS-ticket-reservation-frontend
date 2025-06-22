import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

// API 응답에 따른 인터페이스 정의
interface Reservation {
  id: string;
  movieTitle: string;
  cinemaName: string;
  screenName: string;
  seatLabel: string;
  statusText: string;
  reservationTime: string;
  screeningDate: string;
  screeningStartTime: string;
  finalPrice: number;
  ticketIssuanceStatusText: string;
  paymentStatus?: string;
}

interface GuestDetails {
  phoneNumber: string;
  reservations: Reservation[];
  totalReservations: number;
  completedReservations: number;
  cancelledReservations: number;
}

const GuestDetailPage: React.FC = () => {
  const { phoneNumber } = useParams<{ phoneNumber: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<GuestDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGuestDetails = useCallback(async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/nonmembers/${phoneNumber}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      setDetails(res.data);
    } catch (err) {
      console.error('비회원 상세 정보 조회 실패:', err);
      alert('정보를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (phoneNumber) fetchGuestDetails();
  }, [phoneNumber, fetchGuestDetails]);

  const handleCancelReservation = async (reservationId: string) => {
    if (!window.confirm('정말로 이 예매를 취소하시겠습니까?')) return;

    const accessToken = localStorage.getItem('accessToken');
    try {
        await axios.delete(`http://localhost:8080/api/reservations/${reservationId}`, {
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });
        alert('예매가 취소되었습니다.');
        fetchGuestDetails();
    } catch (err) {
        console.error('예매 취소 실패:', err);
        alert('예매 취소에 실패했습니다.');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || String(dateStr).length !== 8) return dateStr;
    const year = String(dateStr).substring(0, 4);
    const month = String(dateStr).substring(4, 6);
    const day = String(dateStr).substring(6, 8);
    return `${year}-${month}-${day}`;
  };

  const formatTime = (timeStr: string) => {
      try {
          return new Date(timeStr).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
      } catch (e) {
          return '';
      }
  };

  if (isLoading) {
    return <Container><LoadingText>상세 정보를 불러오는 중...</LoadingText></Container>;
  }

  if (!details) {
    return <Container><p>해당 비회원의 정보를 찾을 수 없습니다.</p></Container>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/admin/guests')}>← 목록으로</BackButton>
        <Title>비회원 상세 정보</Title>
        <PhoneNumber>📞 {details.phoneNumber}</PhoneNumber>
      </Header>

      <Summary>
        <SummaryItem>
          <span>총 예매</span>
          <strong>{details.totalReservations}</strong>
        </SummaryItem>
        <SummaryItem>
          <span>완료</span>
          <strong>{details.completedReservations}</strong>
        </SummaryItem>
        <SummaryItem>
          <span>취소</span>
          <strong>{details.cancelledReservations}</strong>
        </SummaryItem>
      </Summary>
      
      <h3>예매 내역</h3>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>예매번호</th>
              <th>영화</th>
              <th>극장/상영관</th>
              <th>좌석</th>
              <th>상영일시</th>
              <th>예매상태</th>
              <th>티켓상태</th>
              <th>결제금액</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {details.reservations.map(res => (
              <tr key={res.id}>
                <td>{res.id}</td>
                <td>{res.movieTitle}</td>
                <td>{res.cinemaName} / {res.screenName}</td>
                <td>{res.seatLabel}</td>
                <td>
                  {formatDate(res.screeningDate)}
                  <br/>
                  {formatTime(res.screeningStartTime)}
                </td>
                <td><StatusBadge status={res.statusText}>{res.statusText}</StatusBadge></td>
                <td><StatusBadge status={res.ticketIssuanceStatusText}>{res.ticketIssuanceStatusText}</StatusBadge></td>
                <td>{res.finalPrice.toLocaleString()}원</td>
                <td>
                  {res.paymentStatus === 'N' && (
                    <CancelButton onClick={() => handleCancelReservation(res.id)}>
                      미결제 취소
                    </CancelButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default GuestDetailPage;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #f4f4f4;
`;

const Header = styled.div`
  position: relative;
  text-align: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background: #333;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  &:hover { background: #444; }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
`;

const PhoneNumber = styled.p`
  font-size: 1.2rem;
  color: #aaa;
  margin-top: 0.5rem;
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
`;

const Summary = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 12px;
`;

const SummaryItem = styled.div`
  flex: 1;
  text-align: center;
  span {
    display: block;
    color: #aaa;
    margin-bottom: 0.5rem;
  }
  strong {
    font-size: 1.8rem;
    font-weight: 700;
    color: #e50914;
  }
`;

const TableContainer = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #333;
  }
  th {
    background: #2a2a2a;
    font-weight: 600;
  }
  tbody tr:hover {
    background: #2c2c2c;
  }
`;

const StatusBadge = styled.span<{ status?: string }>`
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  background-color: ${({ status }) => 
    status === '예매 완료' || status === '발권 완료' ? '#28a745' :
    status === '예매 취소' ? '#dc3545' : 
    '#6c757d'
  };
  color: white;
`;

const CancelButton = styled.button`
  padding: 0.4rem 0.8rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #c82333;
  }
`; 