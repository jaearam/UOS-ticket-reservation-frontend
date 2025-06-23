import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

interface Seat {
  id: number;
  seatGradeId: string;
  seatGradeName: string;
  row: string;
  column: string;
  screenId: string;
  screenName: string;
  price: number;
}

interface Screen {
  id: string;
  name: string;
  cinemaName: string;
}

interface SeatGrade {
  id: string;
  name: string;
  price: number;
}

const SEAT_GRADES_DATA: SeatGrade[] = [
  { id: 'A', name: '일반석', price: 12000 },
  { id: 'B', name: '프리미엄', price: 15000 },
  { id: 'C', name: '커플석', price: 28000 },
  { id: 'D', name: 'VIP석', price: 18000 },
];

const gradeIdMap: { [key: string]: string } = {
  'GENERAL': 'A',
  'PREMIUM': 'B',
  'COUPLE': 'C',
  'VIP': 'D',
  'A': 'A',
  'B': 'B',
  'C': 'C',
  'D': 'D',
};

const SeatListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [seatGrades] = useState<SeatGrade[]>(SEAT_GRADES_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Seat>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedScreenId, setSelectedScreenId] = useState<string>('');

  // URL에서 screenId 파라미터 가져오기
  useEffect(() => {
    const screenIdFromUrl = searchParams.get('screenId');
    if (screenIdFromUrl) {
      setSelectedScreenId(screenIdFromUrl);
    }
  }, [searchParams]);

  // 좌석 목록 불러오기
  const fetchSeats = async (screenId?: string) => {
    setIsLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      const url = screenId 
        ? `http://localhost:8080/api/admin/screens/${screenId}/seats`
        : 'http://localhost:8080/api/admin/seats';
      const res = await axios.get(url, { headers });
      setSeats(res.data);
    } catch (e) {
      alert('좌석 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 상영관 목록 불러오기
  const fetchScreens = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      const res = await axios.get('http://localhost:8080/api/admin/screens', { headers });
      setScreens(res.data);
    } catch (e) {
      console.error('상영관 목록 조회 실패:', e);
    }
  };

  useEffect(() => {
    fetchSeats();
    fetchScreens();
  }, []);

  // 상영관 선택 시 해당 상영관 좌석만 조회
  useEffect(() => {
    if (selectedScreenId) {
      fetchSeats(selectedScreenId);
    } else {
      fetchSeats();
    }
  }, [selectedScreenId]);

  // 등록/수정 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.seatGradeId || !form.row || !form.column || !form.screenId) {
      alert('모든 항목을 입력하세요.');
      return;
    }
    const payload = {
      id: form.id,
      seatGradeId: form.seatGradeId,
      row: form.row,
      column: form.column,
      screenId: form.screenId,
    };
    console.log('좌석 등록/수정 요청 데이터:', payload);
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      if (editId) {
        await axios.put(`http://localhost:8080/api/admin/seats/${editId}`, payload, { headers });
        alert('좌석이 수정되었습니다.');
      } else {
        await axios.post('http://localhost:8080/api/admin/seats', payload, { headers });
        alert('좌석이 등록되었습니다.');
      }
      setShowModal(false);
      setForm({});
      setEditId(null);
      if (selectedScreenId) {
        fetchSeats(selectedScreenId);
      } else {
        fetchSeats();
      }
    } catch (e) {
      alert('저장에 실패했습니다.');
    }
  };

  // 삭제
  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      await axios.delete(`http://localhost:8080/api/admin/seats/${id}`, { headers });
      if (selectedScreenId) {
        fetchSeats(selectedScreenId);
      } else {
        fetchSeats();
      }
    } catch (e) {
      alert('삭제에 실패했습니다.');
    }
  };

  // 수정 버튼 클릭
  const handleEdit = (seat: Seat) => {
    setForm({
      id: seat.id,
      seatGradeId: gradeIdMap[seat.seatGradeId] || 'A',
      row: seat.row,
      column: seat.column,
      screenId: seat.screenId,
    });
    setEditId(seat.id);
    setShowModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
    setForm({});
    setEditId(null);
  };

  return (
    <Container>
      <h2>좌석 관리</h2>
      
      {/* 상영관 필터 */}
      <FilterSection>
        <label>
          상영관 선택:
          <select value={selectedScreenId} onChange={e => setSelectedScreenId(e.target.value)}>
            <option value="">전체 상영관</option>
            {screens.map(screen => (
              <option key={screen.id} value={screen.id}>
                {screen.name} ({screen.cinemaName})
              </option>
            ))}
          </select>
        </label>
      </FilterSection>

      <Button onClick={() => { setShowModal(true); setForm({}); setEditId(null); }}>+ 좌석 등록</Button>
      
      {isLoading ? (
        <LoadingText>로딩 중...</LoadingText>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>좌석번호</th>
                <th>행</th>
                <th>열</th>
                <th>상영관ID</th>
                <th>상영관명</th>
                <th>좌석등급</th>
                <th>가격</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {seats.map(seat => (
                <tr key={seat.id}>
                  <td>{seat.id}</td>
                  <td><SeatNumber>{seat.row}{seat.column}</SeatNumber></td>
                  <td>{seat.row}</td>
                  <td>{seat.column}</td>
                  <td>{seat.screenId}</td>
                  <td>{seat.screenName}</td>
                  <td><GradeBadge>{seat.seatGradeName}</GradeBadge></td>
                  <td><PriceText>{seat.price.toLocaleString()}원</PriceText></td>
                  <td>
                    <ButtonGroup>
                      <ActionButton onClick={() => handleEdit(seat)}>수정</ActionButton>
                      <ActionButton danger onClick={() => handleDelete(seat.id)}>삭제</ActionButton>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
      
      {/* 모달 */}
      {showModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h3>{editId ? '좌석 수정' : '좌석 등록'}</h3>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalForm onSubmit={handleSubmit}>
              <FormGroup>
                <label>상영관</label>
                <select value={form.screenId || ''} onChange={e => setForm(f => ({ ...f, screenId: e.target.value }))}>
                  <option value="">상영관을 선택하세요</option>
                  {screens.map(screen => (
                    <option key={screen.id} value={screen.id}>
                      {screen.name} ({screen.cinemaName})
                    </option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup>
                <label>행</label>
                <input value={form.row || ''} onChange={e => setForm(f => ({ ...f, row: e.target.value }))} />
              </FormGroup>
              <FormGroup>
                <label>열</label>
                <input value={form.column || ''} onChange={e => setForm(f => ({ ...f, column: e.target.value }))} />
              </FormGroup>
              <FormGroup>
                <label>좌석등급</label>
                <select value={form.seatGradeId || ''} onChange={e => setForm(f => ({ ...f, seatGradeId: e.target.value }))}>
                  <option value="">좌석등급을 선택하세요</option>
                  {seatGrades.map(grade => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name} ({grade.price.toLocaleString()}원)
                    </option>
                  ))}
                </select>
              </FormGroup>
              <ModalButtonGroup>
                <SubmitButton type="submit">저장</SubmitButton>
                <CancelButton type="button" onClick={handleCloseModal}>취소</CancelButton>
              </ModalButtonGroup>
            </ModalForm>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default SeatListPage;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: #f4f4f4;
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 8px;
  border: 1px solid #444;
  
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #f4f4f4;
    
    select {
      padding: 0.5rem;
      border: 1px solid #555;
      border-radius: 4px;
      font-size: 1rem;
      background: #1a1a1a;
      color: #f4f4f4;
      
      &:focus {
        outline: none;
        border-color: #e50914;
      }
    }
  }
`;

const Button = styled.button`
  margin-bottom: 1rem;
  padding: 0.6rem 1.2rem;
  background: #e50914;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s;
  
  &:hover {
    background: #b0060f;
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
    padding: 1.2rem 1rem;
    text-align: left;
    border-bottom: 1px solid #333;
  }
  
  th {
    background: #2a2a2a;
    font-weight: 700;
    color: #f4f4f4;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  td {
    color: #ccc;
    font-size: 0.95rem;
    vertical-align: middle;
  }
  
  tbody tr {
    transition: all 0.2s ease;
    
    &:hover {
      background: #2a2a2a;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const SeatNumber = styled.span`
  background: #e50914;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-block;
`;

const GradeBadge = styled.span`
  background: #333;
  color: #f4f4f4;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-block;
`;

const PriceText = styled.span`
  font-weight: 600;
  color: #28a745;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{danger?: boolean}>`
  padding: 0.5rem 1rem;
  background: ${({ danger }) => danger ? '#dc3545' : '#007bff'};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ danger }) => danger ? '#c82333' : '#0056b3'};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
`;

// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  border: 1px solid #333;
  
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

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #333;
  background: #2a2a2a;
  border-radius: 16px 16px 0 0;
  
  h3 {
    margin: 0;
    color: #f4f4f4;
    font-size: 1.4rem;
    font-weight: 700;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    color: #f4f4f4;
    background: #333;
  }
`;

const ModalForm = styled.form`
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.8rem;
    font-weight: 600;
    color: #f4f4f4;
    font-size: 1rem;
  }
  
  input, select {
    width: 100%;
    padding: 1rem;
    border: 1px solid #555;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;
    background: #2a2a2a;
    color: #f4f4f4;
    box-sizing: border-box;
    
    &:focus {
      outline: none;
      border-color: #e50914;
      box-shadow: 0 0 0 3px rgba(229,9,20,0.1);
      background: #333;
    }
    
    &::placeholder {
      color: #888;
    }
  }
  
  select {
    cursor: pointer;
    
    option {
      background: #2a2a2a;
      color: #f4f4f4;
    }
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 1rem;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #b0060f;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(229,9,20,0.3);
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #545b62;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(108,117,125,0.3);
  }
`; 