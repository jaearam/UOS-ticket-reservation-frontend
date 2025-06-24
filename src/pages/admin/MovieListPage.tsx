import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

// API 응답에 맞춰 인터페이스 필드명 수정
interface Movie {
  id: number;
  title: string;
  directorName: string;
  actorName?: string;
  distributorName?: string;
  genre: string;
  runtime: number;
  releaseDate: string;
  image: string;
  description: string;
  viewingGrade: string;
  viewingGradeText: string;
  status: string;
  [key: string]: any; 
}

// 등급 텍스트 변환 함수
function getViewingGradeText(grade: string) {
  if (grade === 'ALL' || grade === '전체') return '전체관람가';
  if (grade === '12') return '12세 이상 관람가';
  if (grade === '15') return '15세 이상 관람가';
  if (grade === '18') return '청소년 관람불가';
  return grade;
}

// 상영상태 텍스트 변환 함수
function getScreeningStatusText(status: string) {
  if (status === 'N') return '상영 예정';
  if (status === 'D') return '상영중';
  if (status === 'Y') return '상영 종료';
  return status;
}

const MovieListPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Movie>>({ status: 'N' });
  const [editId, setEditId] = useState<number | null>(null);

  // 영화 목록 불러오기
  const fetchMovies = async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      // 페이지네이션 응답을 처리하도록 수정
      const res = await axios.get('http://localhost:8080/api/movies', { headers, params: { size: 100 } });
      if (res.data && Array.isArray(res.data.content)) {
        setMovies(res.data.content);
      } else {
        console.error('API 응답이 예상과 다릅니다:', res.data);
        setMovies([]);
      }
    } catch (e) {
      console.error('영화 목록 조회 실패:', e);
      setMovies([]);
      alert('영화 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // 등록/수정 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    // API 명세에 맞는 필수값 체크
    if (!form.title || !form.directorName || !form.genre || !form.runtime || !form.releaseDate || !form.viewingGrade || !form.status) {
      alert('필수 항목을 모두 입력하세요.');
      return;
    }
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    
    // API 명세에 맞는 필드명으로 맞춤
    const submissionData = {
      title: form.title,
      genre: form.genre,
      releaseDate: form.releaseDate.replace(/-/g, ''), // YYYYMMDD
      screeningStatus: form.status, // status -> screeningStatus
      runtime: Number(form.runtime),
      actorName: form.actorName || '',
      directorName: form.directorName,
      distributorName: form.distributorName || '',
      viewingGrade: form.viewingGrade,
      description: form.description || '',
      image: form.image || ''
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:8080/api/movies/${editId}`, submissionData, { headers });
        alert('영화가 수정되었습니다.');
      } else {
        await axios.post('http://localhost:8080/api/movies', submissionData, { headers });
        alert('영화가 등록되었습니다.');
      }
      setShowModal(false);
      setForm({ status: 'N' });
      setEditId(null);
      fetchMovies();
    } catch (e: any) {
      const message = e.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
      alert(`저장에 실패했습니다. 이유: ${message}`);
    }
  };

  // 삭제
  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      await axios.delete(`http://localhost:8080/api/movies/${id}`, { headers });
      fetchMovies();
    } catch (e) {
      alert('삭제에 실패했습니다.');
    }
  };

  // 수정 버튼 클릭
  const handleEdit = (movie: Movie) => {
    const formattedDate = movie.releaseDate && movie.releaseDate.length === 8
      ? `${movie.releaseDate.slice(0, 4)}-${movie.releaseDate.slice(4, 6)}-${movie.releaseDate.slice(6, 8)}`
      : movie.releaseDate;

    setForm({ 
      ...movie, 
      releaseDate: formattedDate,
      viewingGrade: movie.viewingGrade,
      status: movie.status || 'N',
    });
    setEditId(movie.id);
    setShowModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ status: 'N' });
    setEditId(null);
  };

  return (
    <Container>
      <h2>영화 관리</h2>
      
      <Button onClick={() => { setShowModal(true); setForm({ status: 'N' }); setEditId(null); }}>+ 영화 등록</Button>
      
      {isLoading ? (
        <LoadingText>로딩 중...</LoadingText>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>포스터</th>
                <th>제목</th>
                <th>감독</th>
                <th>장르</th>
                <th>상영시간</th>
                <th>개봉일</th>
                <th>등급</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {/* API 응답에 맞춰 필드명 수정 */}
              {movies.map(movie => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>
                    {movie.image && (
                      <PosterImage src={movie.image} alt={movie.title} />
                    )}
                  </td>
                  <td><MovieTitle>{movie.title}</MovieTitle></td>
                  <td>{movie.directorName}</td>
                  <td><GenreBadge>{movie.genre}</GenreBadge></td>
                  <td><RunningTime>{movie.runtime}분</RunningTime></td>
                  <td><ReleaseDate>{movie.releaseDate}</ReleaseDate></td>
                  <td><RatingBadge rating={getViewingGradeText(movie.viewingGrade)}>{getViewingGradeText(movie.viewingGrade)}</RatingBadge></td>
                  <td>
                    <ButtonGroup>
                      <ActionButton onClick={() => handleEdit(movie)}>수정</ActionButton>
                      <ActionButton danger onClick={() => handleDelete(movie.id)}>삭제</ActionButton>
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
              <h3>{editId ? '영화 수정' : '영화 등록'}</h3>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalForm onSubmit={handleSubmit}>
              <FormGroup>
                <label>제목</label>
                <input 
                  value={form.title || ''} 
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>감독</label>
                <input 
                  value={form.directorName || ''} 
                  onChange={e => setForm(f => ({ ...f, directorName: e.target.value }))} 
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>장르</label>
                <input 
                  value={form.genre || ''} 
                  onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} 
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>상영시간 (분)</label>
                <input 
                  type="number"
                  value={form.runtime || ''} 
                  onChange={e => setForm(f => ({ ...f, runtime: parseInt(e.target.value) || 0 }))} 
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>개봉일</label>
                <input 
                  type="date"
                  value={form.releaseDate || ''} 
                  onChange={e => setForm(f => ({ ...f, releaseDate: e.target.value }))} 
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>포스터 URL</label>
                <input 
                  value={form.image || ''} 
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))} 
                />
              </FormGroup>
              <FormGroup>
                <label>등급</label>
                <select value={form.viewingGrade || ''} onChange={e => setForm(f => ({ ...f, viewingGrade: e.target.value }))} required>
                  <option value="" disabled>등급을 선택하세요</option>
                  <option value="ALL">전체관람가</option>
                  <option value="12">12세관람가</option>
                  <option value="15">15세관람가</option>
                  <option value="18">18세관람가</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>상영상태</label>
                <select value={form.status || 'N'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} required>
                  <option value="N">상영 예정</option>
                  <option value="Y">상영중</option>
                  <option value="D">상영 종료</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label>줄거리</label>
                <textarea 
                  value={form.description || ''} 
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                  rows={4}
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

export default MovieListPage;

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

const PosterImage = styled.img`
  width: 50px;
  height: auto;
  border-radius: 4px;
`;

const MovieTitle = styled.span`
  font-weight: 600;
  color: #e5e5e5;
`;

const GenreBadge = styled.span`
  background: #333;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const RunningTime = styled.span``;

const ReleaseDate = styled.span``;

const RatingBadge = styled.span<{ rating?: string }>`
  font-weight: 600;
  color: ${({ rating }) => {
    if (rating === '15세 이상 관람가') return '#f5c518';
    if (rating === '12세 이상 관람가') return '#28a745';
    if (rating === '전체관람가') return '#007bff';
    if (rating === '청소년 관람불가') return '#dc3545';
    return '#ccc';
  }};
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
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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
  padding: 1.5rem;
  border-bottom: 1px solid #333;
  
  h3 {
    margin: 0;
    color: #f4f4f4;
    font-size: 1.3rem;
    font-weight: 700;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #f4f4f4;
  }
`;

const ModalForm = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #f4f4f4;
    font-size: 1rem;
  }
  
  input, select, textarea {
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
      box-shadow: 0 0 0 2px rgba(229,9,20,0.1);
    }
    
    &::placeholder {
      color: #888;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #b0060f;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #545b62;
  }
`;
