import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Review {
  id: number;
  memberUserId: string;
  memberId: number;
  ratingValue: number;
  content: string;
  createdAt: string;
}

interface Props {
  movieId: number;
}

const MovieReviews: React.FC<Props> = ({ movieId }) => {
  const { token, isLoggedIn } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  console.log("dd", localStorage.getItem('userId'));

  const fetchReviews = async (currentPage: number) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/reviews/movies/${movieId}`, {
        params: {
          page: currentPage,
          size: 5,
        },
      });
      setReviews(res.data.reviews.content);
      setTotalPages(Math.ceil(res.data.reviews.totalElements / 5));
    } catch (err) {
      console.error('리뷰 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [movieId, page]);

  const handleSubmit = async () => {
    if (!isLoggedIn) return alert('로그인이 필요합니다.');
    try {
      await axios.post(`http://localhost:8080/api/reviews/movies/${movieId}`, {
        ratingValue: Number(rating),
        content: newReview,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewReview('');
      setRating(5);
      setPage(0); // ✅ 등록 후 첫 페이지로
      fetchReviews(0);
    } catch (err) {
      console.error('리뷰 등록 실패:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews(page);
    } catch (err) {
      console.error('리뷰 삭제 실패:', err);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await axios.put(`http://localhost:8080/api/reviews/${id}`, {
        content: editContent,
        ratingValue: Number(editRating),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditId(null);
      fetchReviews(page);
    } catch (err) {
      console.error('리뷰 수정 실패:', err);
    }
  };

  return (
    <Wrapper>
      <ReviewForm>
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="리뷰를 입력하세요"
        />
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r}점</option>)}
        </select>
        <button onClick={handleSubmit}>등록</button>
      </ReviewForm>

      {reviews.map((review) => (
        <ReviewBox key={review.id}>
          <Header>
            <strong>{review.memberUserId}</strong>
            <span>{new Date(review.createdAt).toLocaleString()}</span>
          </Header>

          {editId === review.id ? (
            <>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <select
                value={editRating}
                onChange={(e) => setEditRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r}점</option>)}
              </select>
              <button onClick={() => handleUpdate(review.id)}>수정 완료</button>
              <button onClick={() => setEditId(null)}>취소</button>
            </>
          ) : (
            <>
              <p>{review.content}</p>
              <p>★ {review.ratingValue}/5</p>
              {isLoggedIn && review.memberId === Number(localStorage.getItem('userId')) && (
                <EditRow>
                  <button onClick={() => {
                    setEditId(review.id);
                    setEditContent(review.content);
                    setEditRating(review.ratingValue);
                  }}>수정</button>
                  <button onClick={() => handleDelete(review.id)}>삭제</button>
                </EditRow>
              )}
            </>
          )}
        </ReviewBox>
      ))}

      <Pagination>
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>이전</button>
        <span>{page + 1} / {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page + 1 === totalPages}>다음</button>
      </Pagination>
    </Wrapper>
  );
};

export default MovieReviews;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  textarea {
    padding: 0.8rem;
    border-radius: 6px;
    background: #1c1c1c;
    color: white;
  }

  select {
    width: 100px;
  }

  button {
    width: 100px;
    padding: 0.5rem;
    background: ${({ theme }) => theme.primary};
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
  }
`;

const ReviewBox = styled.div`
  background: ${({ theme }) => theme.surface};
  padding: 1rem;
  border-radius: 6px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const EditRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  button {
    background: none;
    border: 1px solid #555;
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
`;
