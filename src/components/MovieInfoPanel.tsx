import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

type Props = {
  title: string;
  genre: string;
  release: string;
  id: number;
};

const MovieInfoPanel: React.FC<Props> = ({ title, genre, release, id }) => {
  const navigate = useNavigate();

  return (
    <Info>
      <Title>{title}</Title>
      <Genre>{genre}</Genre>
      <Release>개봉일: {release}</Release>
      <ReserveBtn onClick={() => navigate(`/reserve/${id}`)}>
        예매하기
      </ReserveBtn>
      <Description>
        여기는 줄거리 요약이 들어가는 공간입니다. API 연결 시 실제 데이터를 불러올 수 있습니다.
      </Description>
    </Info>
  );
};

export default MovieInfoPanel;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Genre = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.textMuted};
`;

const Release = styled.p`
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const ReserveBtn = styled.button`
  margin-top: 1rem;
  width: 140px;
  padding: 0.8rem;
  font-size: 1rem;
  background: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #c1130a;
  }
`;

const Description = styled.p`
  margin-top: 2rem;
  line-height: 1.5;
  font-size: 0.95rem;
`;
