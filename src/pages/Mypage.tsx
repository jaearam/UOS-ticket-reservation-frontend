import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Reservation } from '../types/Reservation'; 
import { PointHistory } from '../types/PointHistory';
interface MemberDto {
  id: number;
  userId: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  grade: string;
  availablePoints: number;
  gradeText: string;
}

interface PointHistoryResponse {
  content: PointHistory[];
  totalPages: number;
  totalElements: number;
}

const TicketModal = ({ open, onClose, reservation }: { open: boolean; onClose: () => void; reservation: Reservation | null }) => {
  if (!open || !reservation) return null;
  const [date, time] = reservation.screeningStartTime.split('T');
  return (
    <ModalOverlay>
      <ModalContent>
        <TicketCard>
          <h2>🎟️ 티켓 발급 완료</h2>
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

// 티켓 전달 모달 (Redesigned)
const TransferModal = ({ open, onClose, reservationId, fetchData }: { open: boolean; onClose: () => void; reservationId: string | null; fetchData: () => void }) => {
  const [transferType, setTransferType] = useState<'id' | 'email'>('id');
  const [target, setTarget] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTransferType('id');
      setTarget('');
    }
  }, [open]);

  if (!open || !reservationId) return null;

  const handleTransfer = async () => {
    if (!target) {
      alert('전달할 대상의 ID 또는 이메일을 입력해야 합니다.');
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:8080/api/reservations/transfer', {
        reservationIds: [reservationId],
        targetUserId: transferType === 'id' ? target : undefined,
        targetEmail: transferType === 'email' ? target : undefined,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('티켓이 성공적으로 전달되었습니다!');
      onClose();
      fetchData();
    } catch (err: any) {
      alert('티켓 전달 실패: ' + (err.response?.data?.message || '알 수 없는 오류'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TransferModalOverlay onClick={onClose}>
      <TransferModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <TransferModalHeader>
          <h3>티켓 전달</h3>
          <p>티켓을 전달할 회원의 ID 또는 이메일을 입력하세요.</p>
        </TransferModalHeader>
        
        <TransferTypeSelector>
          <label>
            <input type="radio" name="transferType" value="id" checked={transferType === 'id'} onChange={() => setTransferType('id')} />
            <span>회원 ID</span>
          </label>
          <label>
            <input type="radio" name="transferType" value="email" checked={transferType === 'email'} onChange={() => setTransferType('email')} />
            <span>이메일</span>
          </label>
        </TransferTypeSelector>

        <TransferInput 
          value={target}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTarget(e.target.value)}
          placeholder={transferType === 'id' ? '전달할 회원의 ID' : '전달할 회원의 이메일'}
        />

        <TransferModalActions>
          <DangerBtn onClick={onClose}>취소</DangerBtn>
          <MainBtn onClick={handleTransfer} disabled={isLoading || !target}>
            {isLoading ? '전달 중...' : '전달하기'}
          </MainBtn>
        </TransferModalActions>
      </TransferModalContent>
    </TransferModalOverlay>
  );
};

const Mypage: React.FC = () => {
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberDto | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [pointHistory, setPointHistory] = useState<PointHistory[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [issuedReservation, setIssuedReservation] = useState<Reservation | null>(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferReservationId, setTransferReservationId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [memberRes, reservationRes, pointRes] = await Promise.all([
        axios.get<MemberDto>('http://localhost:8080/api/members/my', { headers }),
        axios.get<Reservation[]>('http://localhost:8080/api/reservations/my', { headers }),
        axios.get<{ pointHistory: PointHistoryResponse }>(
          'http://localhost:8080/api/members/my/points',
          {
            headers,
            params: { page, size: 5 },
          }
        ),
      ]);

      setMember(memberRes.data);
      setReservations(
        reservationRes.data.filter((r) => r.status !== 'D')
      ); // D 상태는 취소된 예매로 필터링
      setPointHistory(pointRes.data.pointHistory.content);
      setTotalPages(Math.max(pointRes.data.pointHistory.totalPages, 1));
    } catch (err) {
      console.error('마이페이지 데이터 조회 실패:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn === false) {
      // alert('로그인이 필요합니다.'); // 중복 경고창 제거
      navigate('/login');
      return;
    }
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, token, navigate, page]);

  // isLoggedIn이 undefined면 로딩 표시
  if (isLoggedIn === undefined) return <Wrapper>로딩 중...</Wrapper>;

  if (!member) return <Wrapper>로딩 중...</Wrapper>;

  return (
    <Wrapper>
      <Title>마이페이지</Title>

      <Section>
        <h3>👤 개인정보</h3>
        <p><strong>아이디:</strong> {member.userId}</p>
        <p><strong>이메일:</strong> {member.email}</p>
        <p><strong>전화번호:</strong> {member.phoneNumber}</p>
        <p><strong>생년월일:</strong> {member.birthDate}</p>
        <p><strong>포인트:</strong> {member.availablePoints.toLocaleString()} P</p>
        <ActionRow>
          <Btn onClick={() => navigate('/edit-profile')}>정보 수정</Btn>
          <Btn onClick={async () => {
            if (!window.confirm('정말로 회원 탈퇴를 진행하시겠습니까?')) return;
            try {
              const token = localStorage.getItem('accessToken');
              await axios.delete('http://localhost:8080/api/members/my', {
                headers: { Authorization: `Bearer ${token}` },
              });
              alert('회원 탈퇴가 완료되었습니다.');
              // 로그아웃 및 메인으로 이동
              localStorage.removeItem('accessToken');
              sessionStorage.removeItem('accessToken');
              window.location.href = '/';
            } catch (err) {
              alert('회원 탈퇴에 실패했습니다.');
            }
          }}>회원 탈퇴</Btn>
        </ActionRow>
      </Section>

<Section>
  <h3>🧾 예매 내역</h3>
  {reservations.length === 0 ? (
    <p>예매 내역이 없습니다.</p>
  ) : (
    reservations.map((r: Reservation) => {
      const [date, time] = r.screeningStartTime.split('T');

      const handleCancel = async () => {
        const confirmed = window.confirm('예매를 취소하시겠습니까?');
        if (!confirmed) return;

        try {
          const token = localStorage.getItem('accessToken');
          await axios.delete(`http://localhost:8080/api/reservations/${r.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          alert('예매가 취소되었습니다.');
          setReservations((prev) => prev.filter((res) => res.id !== r.id));
        } catch (err: any) {
          // 404(존재하지 않는 예매) 또는 400(존재하지 않는 예매입니다 메시지) 에러는 무시하고 성공 메시지로 처리
          const msg = err.response?.data?.message;
          if (
            err.response?.status === 404 ||
            (err.response?.status === 400 && typeof msg === 'string' && msg.includes('존재하지 않는 예매'))
          ) {
            alert('예매가 취소되었습니다.');
            setReservations((prev) => prev.filter((res) => res.id !== r.id));
          } else {
            console.error('예매 취소 실패:', err);
            console.error('서버 응답 메시지:', msg);
            alert(`예매 취소 실패: ${msg ?? '알 수 없는 오류'}`);
          }
        }
      };

      // 미결제 여부 판별
      const isUnpaid = !r.paymentStatus || r.paymentStatus === 'N';
      const isPaid = r.paymentStatus && r.paymentStatus !== 'N';
      const isIssued = r.ticketIssuanceStatus === 'Y';

      return (
        <Card key={r.id}>
          <p><strong>예매번호:</strong> {r.id}</p>
          <p><strong>영화:</strong> {r.movieTitle}</p>
          <p><strong>일시:</strong> {date} {time.slice(0, 5)}</p>
          <p><strong>극장:</strong> {r.cinemaName} / {r.screenName}</p>
          <p><strong>좌석:</strong> {r.seatLabel}</p>
          <p><strong>결제금액:</strong> {r.finalPrice.toLocaleString()}원</p>
          <BtnRow>
            <DangerBtn onClick={handleCancel}>예매 취소</DangerBtn>
            {isUnpaid ? (
              <MainBtn onClick={() => {
                navigate('/payment', { state: { reservationId: r.id } });
                setTimeout(() => {
                  alert('결제 완료 후 마이페이지로 돌아오면 내역이 자동 갱신됩니다.');
                }, 500);
              }}>결제하기</MainBtn>
            ) : (
              <>
                <MainBtn onClick={async () => {
                  try {
                    const token = localStorage.getItem('accessToken');
                    await axios.post(`http://localhost:8080/api/reservations/${r.id}/issue`, {}, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    setIssuedReservation(r);
                    setTicketModalOpen(true);
                  } catch (err) {
                    alert('티켓 발급에 실패했습니다.');
                  }
                }} disabled={isIssued}>티켓 발급</MainBtn>
                <MainBtn onClick={() => {
                  setTransferReservationId(r.id);
                  setTransferModalOpen(true);
                }} disabled={isIssued}>
                  티켓 전달
                </MainBtn>
              </>
            )}
          </BtnRow>
        </Card>
      );
    })
  )}
</Section>




      <Section>
        <h3>💰 포인트 사용 내역</h3>
        {pointHistory.length === 0 ? (
          <p>포인트 사용 내역이 없습니다.</p>
        ) : (
          pointHistory.map((p) => (
          <Card key={p.id}>
            <p><strong>일시:</strong> {new Date(p.pointTime).toLocaleString()}</p>
            <p><strong>내역:</strong> {p.typeText}</p>
            <p>
              <strong>금액:</strong>{' '}
              <span style={{ color: p.type === 'U' ? 'red' : 'limegreen' }}>
                {p.amount.toLocaleString()} P
              </span>
            </p>
          </Card>

          ))
        )}
        <Pagination>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page <= 0 || totalPages <= 1}
          >
            이전
          </button>
          <span>{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page + 1 >= totalPages || totalPages <= 1}
          >
            다음
          </button>
        </Pagination>
      </Section>
      <TicketModal open={ticketModalOpen} onClose={() => { setTicketModalOpen(false); fetchData(); }} reservation={issuedReservation} />
      <TransferModal open={transferModalOpen} onClose={() => setTransferModalOpen(false)} reservationId={transferReservationId} fetchData={fetchData} />
    </Wrapper>
  );
};

export default Mypage;

// 스타일
const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.primary};
`;

const Section = styled.section`
  background: ${({ theme }) => theme.surface};
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;

  h3 {
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
  }

  p {
    margin: 0.4rem 0;
  }
`;

const Card = styled.div`
  border-top: 1px solid #333;
  margin-top: 1rem;
  padding-top: 1rem;
`;

const ActionRow = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
`;

const Btn = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background 0.18s, opacity 0.18s;
  &:hover:enabled {
    background: #b0060f;
    opacity: 0.95;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MainBtn = styled(Btn)`
  background: ${({ theme }) => theme.primary};
`;

const DangerBtn = styled(Btn)`
  background: #ff4d4f;
  &:hover:enabled {
    background: #d9363e;
  }
`;

const BtnRow = styled.div`
  display: flex;
  gap: 0.7rem;
  margin-top: 0.7rem;
`;

const Pagination = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  button {
    background: none;
    border: 1px solid #555;
    color: ${({ theme }) => theme.text};
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
`;

// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.65);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalContent = styled.div`
  background: none;
  border: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const TicketCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
  padding: 2.5rem;
  width: 90%;
  min-width: 360px;
  max-width: 420px;
  color: ${({ theme }) => theme.text};
  border: 1px solid #333;
  text-align: left;
  
  h2 {
    color: ${({ theme }) => theme.primary};
    margin: 0 0 1.5rem 0;
    text-align: center;
    font-size: 1.4rem;
    font-weight: 700;
  }
`;

const InfoGrid = styled.div`
  border-top: 1px solid #444;
  border-bottom: 1px solid #444;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;

  strong {
    color: #aaa;
    font-weight: 500;
  }

  span {
    font-weight: 500;
    text-align: right;
  }
`;

const CloseBtn = styled(MainBtn)`
  display: block;
  width: 100%;
  margin-top: 2rem;
  padding: 0.9rem;
`;

const TransferModalOverlay = styled(ModalOverlay)``;

const TransferModalContent = styled.div`
  background: #232323;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
  width: 90%;
  max-width: 450px;
  padding: 2.5rem;
  color: #fff;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TransferModalHeader = styled.div`
  text-align: center;
  h3 {
    font-size: 1.8rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;
    color: ${({ theme }) => theme.primary};
  }
  p {
    font-size: 1rem;
    color: #ccc;
    margin: 0;
  }
`;

const TransferTypeSelector = styled.div`
  display: flex;
  border: 1px solid #444;
  border-radius: 10px;
  overflow: hidden;

  label {
    flex: 1;
    padding: 0.8rem;
    text-align: center;
    cursor: pointer;
    background: #1a1a1a;
    color: #aaa;
    transition: all 0.2s ease-in-out;

    input {
      display: none;
    }
    
    input:checked + span {
      color: #fff;
      font-weight: 700;
    }
  }

  label:has(input:checked) {
    background: ${({ theme }) => theme.primary};
  }
`;

const TransferInput = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #555;
  background: #1a1a1a;
  color: #fff;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: #777;
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.2);
  }
`;

const TransferModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  button {
    flex: 1;
  }
`;
