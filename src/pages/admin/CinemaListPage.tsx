import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Cinema {
  id: string;
  name: string;
  location: string;
  regionId: string;
  regionName: string;
  screenCount: number;
}

const CinemaListPage: React.FC = () => {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Cinema>>({});
  const [editId, setEditId] = useState<string | null>(null);

  // 영화관 목록 불러오기
  const fetchCinemas = async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      const res = await axios.get('http://localhost:8080/api/cinemas', { headers });
      setCinemas(res.data);
    } catch (e) {
      alert('영화관 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  // 등록/수정 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.regionId) {
      alert('모든 항목을 입력하세요.');
      return;
    }
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      if (editId) {
        await axios.put(`http://localhost:8080/api/admin/cinemas/${editId}`, form, { headers });
        alert('영화관이 수정되었습니다.');
      } else {
        await axios.post('http://localhost:8080/api/admin/cinemas', form, { headers });
        alert('영화관이 등록되었습니다.');
      }
      setShowModal(false);
      setForm({});
      setEditId(null);
      fetchCinemas();
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
      await axios.delete(`http://localhost:8080/api/admin/cinemas/${id}`, { headers });
      fetchCinemas();
    } catch (e) {
      alert('삭제에 실패했습니다.');
    }
  };

  // 수정 버튼 클릭
  const handleEdit = (cinema: Cinema) => {
    setForm(cinema);
    setEditId(cinema.id);
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
      <h2>영화관 관리</h2>
      
      <Button onClick={() => { setShowModal(true); setForm({}); setEditId(null); }}>+ 영화관 등록</Button>
      
      {isLoading ? (
        <LoadingText>로딩 중...</LoadingText>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>영화관명</th>
                <th>위치</th>
                <th>지역</th>
                <th>상영관 수</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {cinemas.map(cinema => (
                <tr key={cinema.id}>
                  <td>{cinema.id}</td>
                  <td><CinemaName>{cinema.name}</CinemaName></td>
                  <td><LocationText>{cinema.location}</LocationText></td>
                  <td><RegionBadge>{cinema.regionName}</RegionBadge></td>
                  <td><ScreenCount>{cinema.screenCount}관</ScreenCount></td>
                  <td>
                    <ButtonGroup>
                      <ActionButton onClick={() => handleEdit(cinema)}>수정</ActionButton>
                      <ActionButton danger onClick={() => handleDelete(cinema.id)}>삭제</ActionButton>
                      <Link to={`/admin/cinemas/${cinema.id}/screens`}>
                        <ActionButton>상영관관리</ActionButton>
                      </Link>
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
              <h3>{editId ? '영화관 수정' : '영화관 등록'}</h3>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalForm onSubmit={handleSubmit}>
              <FormGroup>
                <label>영화관 코드</label>
                <input 
                  value={form.id || ''} 
                  onChange={e => setForm(f => ({ ...f, id: e.target.value }))} 
                  placeholder="영화관 코드를 입력하세요"
                />
              </FormGroup>
              <FormGroup>
                <label>영화관명</label>
                <input 
                  value={form.name || ''} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                  placeholder="영화관명을 입력하세요"
                />
              </FormGroup>
              <FormGroup>
                <label>위치</label>
                <input 
                  value={form.location || ''} 
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))} 
                  placeholder="주소를 입력하세요"
                />
              </FormGroup>
              <FormGroup>
                <label>지역 코드</label>
                <input 
                  value={form.regionId || ''} 
                  onChange={e => setForm(f => ({ ...f, regionId: e.target.value }))} 
                  placeholder="지역 코드를 입력하세요 (01: 서울, 02: 대구)"
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

export default CinemaListPage;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
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
    font-weight: 700;
    color: #f4f4f4;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  td {
    color: #ccc;
    font-size: 0.95rem;
  }
  
  tbody tr {
    transition: background 0.2s;
    
    &:hover {
      background: #2a2a2a;
    }
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const CinemaName = styled.span`
  font-weight: 600;
  color: #e50914;
`;

const LocationText = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const RegionBadge = styled.span`
  background: #17a2b8;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const ScreenCount = styled.span`
  font-weight: 600;
  color: #28a745;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{danger?: boolean}>`
  padding: 0.4rem 0.8rem;
  background: ${({ danger }) => danger ? '#dc3545' : '#007bff'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.2s;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    background: ${({ danger }) => danger ? '#c82333' : '#0056b3'};
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