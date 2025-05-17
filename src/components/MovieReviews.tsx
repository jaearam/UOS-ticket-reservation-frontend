import React, { useState } from 'react';
import styled from 'styled-components';

type Review = {
  id: number;
  user: string;
  content: string;
};

const initialReviews: Review[] = [
  { id: 1, user: '영화광123', content: '스토리 너무 흥미롭고 몰입감 최고!' },
  { id: 2, user: '감성러버', content: 'OST가 미쳤어요. 감정선 터짐.' },
];

const MovieReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setReviews([...reviews, { id: Date.now(), user: '익명', content: input }]);
    alert('리뷰가 등록되었습니다 (목업)');
    setInput('');
  };

  return (
    <Wrapper>
      <ReviewList>
        {reviews.map((r) => (
          <ReviewItem key={r.id}>
            <strong>{r.user}</strong>
            <p>{r.content}</p>
          </ReviewItem>
        ))}
      </ReviewList>

      <Form onSubmit={handleSubmit}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="리뷰를 입력해주세요"
        />
        <Button type="submit">등록</Button>
      </Form>
    </Wrapper>
  );
};

export default MovieReviews;

const Wrapper = styled.div`
  padding: 1rem 2rem;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ReviewItem = styled.div`
  background: ${({ theme }) => theme.surface};
  padding: 1rem;
  border-radius: 6px;
  color: ${({ theme }) => theme.text};
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);

  strong {
    display: block;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.primary};
  }
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #444;
  border-radius: 4px;
  background: #1c1c1c;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 1rem;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background: #c1130a;
  }
`;
