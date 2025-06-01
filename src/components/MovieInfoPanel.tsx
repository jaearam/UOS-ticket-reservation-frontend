import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface Props {
  id: number;
  title: string;
  genre: string;
  releaseDate: string;
  description: string;
  viewingGrade: string;
  rating: number;
  distributorName: string;
  directorName: string;
  runtime: number;
}

const MovieInfoPanel: React.FC<Props> = ({
  id,
  title,
  genre,
  releaseDate,
  description,
  viewingGrade,
  rating,
  distributorName,
  directorName,
  runtime,
}) => {
  const navigate = useNavigate();

  return (
    <Info>
      <Title>{title}</Title>
      <Genre>{genre}</Genre>
      <Small>감독: {directorName} / 배급: {distributorName}</Small>
      <Small>등급: {viewingGrade} / 평점: {rating.toFixed(1)}</Small>
      <Release>개봉일: {releaseDate} / 러닝타임: {runtime}분</Release>
      <ReserveBtn onClick={() => navigate(`/reserve/${id}`)}>
        예매하기
      </ReserveBtn>
      {/* <Description>{description}</Description> */}
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

const Small = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 0.2rem;
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
