import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

interface Screen {
  id: string;
  name: string;
  cinemaId: string;
  cinemaName: string;
  totalSeats: number;
}

interface Cinema {
  id: string;
  name: string;
  location: string;
  regionName: string;
}

const CinemaScreenListPage: React.FC = () => {
  const { cinemaId } = useParams<{ cinemaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [screens, setScreens] = useState<Screen[]>([]);
  const [cinema, setCinema] = useState<Cinema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const [editId, setEditId] = useState<string | null>(null);

  // 영화관 정보 불러오기
  const fetchCinema = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      const res = await axios.get(`http://localhost:8080/api/cinemas/${cinemaId}`, { headers });
      setCinema(res.data);
    } catch (e) {
      console.error('영화관 정보 조회 실패:', e);
    }
  };

  // 상영관 목록 불러오기
  const fetchScreens = async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/cinemas/${cinemaId}/screens`, { headers });
      setScreens(res.data);
    } catch (e) {
      alert('상영관 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cinemaId) {
      fetchCinema();
      fetchScreens();
    }
  }, [cinemaId]);

  // 등록/수정 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.name || form.totalSeats === undefined || form.totalSeats === null || form.totalSeats === "") {
      alert('모든 항목을 입력하세요.');
      return;
    }
    if (isNaN(Number(form.totalSeats)) || Number(form.totalSeats) < 1) {
      alert('총 좌석수는 1 이상의 숫자여야 합니다.');
      return;
    }
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      const submitData = {
        id: form.id,
        name: form.name,
        totalSeats: Number(form.totalSeats),
        cinemaId: cinemaId
      };
      if (editId) {
        await axios.put(`http://localhost:8080/api/admin/screens/${editId}`, submitData, { headers });
        alert('상영관이 수정되었습니다.');
      } else {
        await axios.post('http://localhost:8080/api/admin/screens', submitData, { headers });
        alert('상영관이 등록되었습니다.');
      }
      setShowModal(false);
      setForm({});
      setEditId(null);
      fetchScreens();
    } catch (e) {
      alert('저장에 실패했습니다.');
    }
  };

  // 삭제
  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      await axios.delete(`http://localhost:8080/api/admin/screens/${id}`, { headers });
      fetchScreens();
    } catch (e) {
      alert('삭제에 실패했습니다.');
    }
  };

  // 수정 버튼 클릭
  const handleEdit = (screen: Screen) => {
    setForm({
      ...screen,
      totalSeats: screen.totalSeats !== undefined && screen.totalSeats !== null ? String(screen.totalSeats) : ''
    });
    setEditId(screen.id);
    setShowModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
    setForm({});
    setEditId(null);
  };

  // 좌석 관리로 이동
  const handleManageSeats = (screenId: string, screenName: string) => {
    navigate(`/admin/seats?screenId=${screenId}`);
  };

  // 뒤로가기
  const handleBack = () => {
    navigate('/admin/cinemas');
  };

  if (!cinema) {
    return <Container><p>영화관 정보를 불러오는 중...</p></Container>;
  }

  return (
    <Container>
      {/* 영화관 정보 헤더 */}
      <CinemaHeader>
        <BackButton onClick={handleBack}>← 영화관 목록으로</BackButton>
        <CinemaInfo>
          <h2>{cinema.name}</h2>
          <p>{cinema.location} • {cinema.regionName}</p>
        </CinemaInfo>
      </CinemaHeader>

      <SectionTitle>상영관 관리</SectionTitle>
      <Button onClick={() => { setShowModal(true); setForm({}); setEditId(null); }}>+ 상영관 등록</Button>
      
      {isLoading ? (
        <LoadingText>로딩 중...</LoadingText>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>상영관명</th>
                <th>총 좌석수</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {screens.map(screen => (
                <tr key={screen.id}>
                  <td>{screen.id}</td>
                  <td><ScreenName>{screen.name}</ScreenName></td>
                  <td><SeatCount>{screen.totalSeats}석</SeatCount></td>
                  <td>
                    <ButtonGroup>
                      <ActionButton onClick={() => handleEdit(screen)}>수정</ActionButton>
                      <ActionButton danger onClick={() => handleDelete(screen.id)}>삭제</ActionButton>
                      <ActionButton onClick={() => handleManageSeats(screen.id, screen.name)}>
                        좌석관리
                      </ActionButton>
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
              <h3>{editId ? '상영관 수정' : '상영관 등록'}</h3>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalForm onSubmit={handleSubmit}>
              <FormGroup>
                <label>ID</label>
                <input 
                  value={form.id || ''} 
                  onChange={e => setForm((f: any) => ({ ...f, id: e.target.value }))} 
                  disabled={!!editId}
                  placeholder="상영관 ID를 입력하세요"
                />
              </FormGroup>
              <FormGroup>
                <label>상영관명</label>
                <input 
                  value={form.name || ''} 
                  onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} 
                  placeholder="상영관명을 입력하세요"
                />
              </FormGroup>
              <FormGroup>
                <label>총 좌석수</label>
                <input
                  type="number"
                  min={1}
                  value={form.totalSeats ?? ''}
                  onChange={e => setForm((f: any) => ({ ...f, totalSeats: e.target.value }))}
                  placeholder="총 좌석수를 입력하세요"
                />
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

export default CinemaScreenListPage;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: #f4f4f4;
`;

const CinemaHeader = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  position: relative;
  border: 1px solid #333;
`;

const BackButton = styled.button`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: transparent;
  border: 1px solid #555;
  color: #ccc;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: #333;
    color: #fff;
    border-color: #e50914;
  }
`;

const CinemaInfo = styled.div`
  text-align: center;
  color: #fff;

  h2 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    color: #e50914;
  }

  p {
    font-size: 1.1rem;
    color: #ccc;
    margin: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #f4f4f4;
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

  th:first-child,
  td:first-child,
  th:nth-child(3),
  td:nth-child(3) {
    text-align: center;
  }

  /* 관리 컬럼의 버튼 그룹을 중앙 정렬하기 위해 td에 text-align을 적용 */
  th:last-child,
  td:last-child {
    text-align: center;
  }
`;

const ScreenName = styled.span`
  font-weight: 600;
  color: #e50914;
  font-size: 1rem;
`;

const SeatCount = styled.span`
  font-weight: 600;
  color: #28a745;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: inline-flex; /* td의 text-align: center를 적용받기 위해 inline-flex로 변경 */
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
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
  max-width: 450px;
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
  
  input {
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