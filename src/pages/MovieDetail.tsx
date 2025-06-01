import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import MoviePoster from '../components/MoviePoster';
import MovieInfoPanel from '../components/MovieInfoPanel';
import MovieDetailTabs from '../components/MovieDetailTabs';
import { ScheduleDto } from '../types/ScheduleList'; // ✅ 타입 정의 import

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);

  useEffect(() => {
    if (!id) return;
    axios
      .get<ScheduleDto[]>(`/api/schedules?movieId=${id}`)
      .then((res) => setSchedules(res.data))
      .catch((err) => console.error('상영 일정 로드 실패:', err));
  }, [id]);

  // 기존 dummy movie 는 제거
  // 실제 상세 영화 정보는 /api/movies/:id 에서 받아오는게 좋음 (추후 개선)

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>← 뒤로가기</BackButton>

      <MoviePoster poster={`/images/posters/${id}.jpg`} title={`영화 ${id}`} />
      <MovieInfoPanel id={Number(id)} title={`영화 ${id}`} genre="장르" release="2024-01-01" />

      <MovieDetailTabs />

      <Section>
        <h3>🎟 상영 일정</h3>
        {schedules.length === 0 ? (
          <p>상영 일정이 없습니다.</p>
        ) : (
          schedules.map((s) => (
            <ScheduleCard key={s.id}>
              <p><strong>극장:</strong> {s.cinemaName} / {s.screenName}</p>
              <p><strong>일시:</strong> {s.screeningDate} {new Date(s.screeningStartTime).toLocaleTimeString()} ~ 약 {s.runtime}분</p>
            </ScheduleCard>
          ))
        )}
      </Section>
    </Container>
  );
};

export default MovieDetail;

// 스타일 유지 + 추가
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  flex-direction: column;
  display: flex;
  gap: 2rem;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const BackButton = styled.button`
  align-self: flex-start;
  margin-bottom: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.95rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.primary};
    text-decoration: underline;
  }
`;

const Section = styled.section`
  background: ${({ theme }) => theme.surface};
  padding: 1.5rem;
  border-radius: 10px;
`;

const ScheduleCard = styled.div`
  padding: 1rem 0;
  border-top: 1px solid #444;
  &:first-child {
    border-top: none;
  }
`;
