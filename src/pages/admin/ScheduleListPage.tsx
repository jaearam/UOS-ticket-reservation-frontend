import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Schedule {
  id: string;
  movieId: number;
  movieTitle: string;
  screenId: string;
  screenName: string;
  cinemaName: string;
  runtime: number;
  screeningDate: string;
  screeningStartTime: string;
  screeningEndTime: string;
}

interface Movie {
  id: number;
  title: string;
  runningTime: number;
}

interface MovieApiResponse {
  content: Movie[];
  totalPages: number;
  totalElements: number;
}

interface Screen {
  id: string;
  name: string;
  cinemaName: string;
}

const ScheduleListPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<Schedule & { date: string, startTime: string, endTime: string }>>({});
  const [editId, setEditId] = useState<string | null>(null);

  // 상영일정 목록 불러오기
  const fetchSchedules = async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      const res = await axios.get('http://localhost:8080/api/admin/schedules', { headers });
      // API 응답이 배열인지 확인하고 안전하게 설정
      setSchedules(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('상영일정 목록 조회 실패:', e);
      setSchedules([]);
      alert('상영일정 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 영화 목록 불러오기
  const fetchMovies = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      const res = await axios.get<MovieApiResponse>('http://localhost:8080/api/movies', { 
        headers,
        params: { size: 1000 } 
      });
      // API 응답이 예상한 구조인지 확인하고 안전하게 설정
      setMovies(Array.isArray(res.data.content) ? res.data.content : []);
    } catch (e) {
      console.error('영화 목록 조회 실패:', e);
      setMovies([]);
    }
  };

  // 상영관 목록 불러오기
  const fetchScreens = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    try {
      const res = await axios.get('http://localhost:8080/api/admin/screens', { headers });
      // API 응답이 배열인지 확인하고 안전하게 설정
      setScreens(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('상영관 목록 조회 실패:', e);
      setScreens([]);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchMovies();
    fetchScreens();
  }, []);

  // 등록/수정 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.movieId || !form.screenId || !form.startTime || !form.date) {
      alert('모든 항목을 입력하세요.');
      return;
    }
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    // 서버에 전송할 데이터 재구성
    const submissionData = {
      movieId: form.movieId,
      screenId: form.screenId,
      startTime: `${form.date}T${form.startTime}:00`,
      endTime: form.endTime ? `${form.date}T${form.endTime}:00` : undefined,
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:8080/api/admin/schedules/${editId}`, submissionData, { headers });
        alert('상영일정이 수정되었습니다.');
      } else {
        await axios.post('http://localhost:8080/api/admin/schedules', submissionData, { headers });
        alert('상영일정이 등록되었습니다.');
      }
      setShowModal(false);
      setForm({});
      setEditId(null);
      fetchSchedules();
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
      await axios.delete(`http://localhost:8080/api/admin/schedules/${id}`, { headers });
      fetchSchedules();
    } catch (e) {
      alert('삭제에 실패했습니다.');
    }
  };

  // 수정 버튼 클릭
  const handleEdit = (schedule: Schedule) => {
    // 서버에서 받은 시간 문자열을 input 형식으로 변환
    const formatToDateInput = (dateString: string) => {
      if (!dateString) return '';
      return dateString.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    };
    const formatToTimeInput = (dateTimeString: string) => {
      if (!dateTimeString) return '';
      try {
        return new Date(dateTimeString.replace(' ', 'T')).toTimeString().slice(0, 5);
      } catch (e) { return ''; }
    };

    setForm({
      ...schedule,
      date: formatToDateInput(schedule.screeningDate),
      startTime: formatToTimeInput(schedule.screeningStartTime),
      endTime: formatToTimeInput(schedule.screeningEndTime),
    });
    setEditId(schedule.id);
    setShowModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
    setForm({});
    setEditId(null);
  };

  // 날짜 포맷팅 (안정성 강화)
  const formatDate = (dateString: string) => {
    if (!dateString || dateString.length !== 8) return '날짜 없음';
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
  };

  // 시간 포맷팅 (안정성 강화)
  const formatTime = (timeString: string) => {
    if (!timeString) return '시간 없음';
    const time = new Date(timeString.replace(' ', 'T'));
    if (isNaN(time.getTime())) return 'Invalid Date';
    return time.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Container>
      <h2>상영일정 관리</h2>
      
      <Button onClick={() => { setShowModal(true); setForm({}); setEditId(null); }}>+ 상영일정 등록</Button>
      
      {isLoading ? (
        <LoadingText>로딩 중...</LoadingText>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>영화</th>
                <th>상영관</th>
                <th>영화관</th>
                <th>상영일</th>
                <th>시작시간</th>
                <th>종료시간</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(schedule => (
                <tr key={schedule.id}>
                  <td>{schedule.id}</td>
                  <td><MovieTitle>{schedule.movieTitle}</MovieTitle></td>
                  <td><ScreenName>{schedule.screenName}</ScreenName></td>
                  <td><CinemaName>{schedule.cinemaName}</CinemaName></td>
                  <td><DateText>{formatDate(schedule.screeningDate)}</DateText></td>
                  <td><TimeText>{formatTime(schedule.screeningStartTime)}</TimeText></td>
                  <td><TimeText>{formatTime(schedule.screeningEndTime)}</TimeText></td>
                  <td>
                    <ButtonGroup>
                      <ActionButton onClick={() => handleEdit(schedule)}>수정</ActionButton>
                      <ActionButton danger onClick={() => handleDelete(schedule.id)}>삭제</ActionButton>
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
              <h3>{editId ? '상영일정 수정' : '상영일정 등록'}</h3>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalForm onSubmit={handleSubmit}>
              <FormGroup>
                <label>영화</label>
                <select value={form.movieId || ''} onChange={e => setForm(f => ({ ...f, movieId: parseInt(e.target.value) }))}>
                  <option value="">영화를 선택하세요</option>
                  {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title} ({movie.runningTime}분)
                    </option>
                  ))}
                </select>
              </FormGroup>
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
                <label>상영일</label>
                <input 
                  type="date"
                  value={form.date || ''} 
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))} 
                />
              </FormGroup>
              <FormGroup>
                <label>시작시간</label>
                <input 
                  type="time"
                  value={form.startTime || ''}
                  onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} 
                />
              </FormGroup>
              <FormGroup>
                <label>종료시간</label>
                <input 
                  type="time"
                  value={form.endTime || ''}
                  onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} 
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

export default ScheduleListPage;

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

const MovieTitle = styled.span`
  font-weight: 600;
  color: #e50914;
`;

const ScreenName = styled.span`
  background: #17a2b8;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const CinemaName = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const DateText = styled.span`
  font-weight: 600;
  color: #28a745;
`;

const TimeText = styled.span`
  font-weight: 500;
  color: #495057;
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
      box-shadow: 0 0 0 2px rgba(229,9,20,0.1);
    }
    
    &::placeholder {
      color: #888;
    }
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