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
      alert('리뷰를 쓸 수 없습니다');
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
          className="review-textarea"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="리뷰를 입력하세요"
        />
        <div className="side-col">
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r}점</option>)}
          </select>
          <button onClick={handleSubmit}>등록</button>
        </div>
      </ReviewForm>

      {reviews.map((review) => (
        <ReviewBox key={review.id}>
          <Header>
            <strong>{review.memberUserId}</strong>
            <span>{new Date(review.createdAt).toLocaleString()}</span>
          </Header>

          {editId === review.id ? (
            <EditForm>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="리뷰 내용을 수정하세요"
              />
              <div className="edit-controls">
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r}점</option>)}
                </select>
                <div className="edit-buttons">
                  <button className="save-btn" onClick={() => handleUpdate(review.id)}>완료</button>
                  <button className="cancel-btn" onClick={() => setEditId(null)}>취소</button>
                </div>
              </div>
            </EditForm>
          ) : (
            <>
              <p>{review.content}</p>
              <div className="review-footer">
                <span className="rating">★ {review.ratingValue}/5</span>
                {isLoggedIn && review.memberUserId === localStorage.getItem('userId') && (
                  <EditRow>
                    <button onClick={() => {
                      setEditId(review.id);
                      setEditContent(review.content);
                      setEditRating(review.ratingValue);
                    }}>수정</button>
                    <button onClick={() => handleDelete(review.id)}>삭제</button>
                  </EditRow>
                )}
              </div>
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
  flex-direction: row;
  align-items: stretch;
  gap: 1.2rem;
  margin-bottom: 0.5rem;

  .review-textarea {
    flex: 1 1 0;
    min-width: 0;
    padding: 0.8rem;
    border-radius: 6px;
    background: #1c1c1c;
    color: white;
    resize: vertical;
    font-size: 1rem;
    height: 90px;
    box-sizing: border-box;
  }

  .side-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    min-width: 120px;
    max-width: 140px;
    height: 90px;
    gap: 0.5rem;
  }

  .side-col select {
    width: 100%;
    padding: 0.5rem 2.2rem 0.5rem 0.8rem;
    border-radius: 6px;
    background: #232323;
    color: #fff;
    border: 1.5px solid #333;
    font-size: 1rem;
    font-weight: 600;
    appearance: none;
    outline: none;
    position: relative;
    background-image: url('data:image/svg+xml;utf8,<svg fill="%23e50914" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
    background-repeat: no-repeat;
    background-position: right 0.7rem center;
    background-size: 1.2rem;
    transition: border 0.18s;
  }
  .side-col select:focus {
    border: 1.5px solid #e50914;
    background-color: #292929;
  }
  .side-col select:hover {
    border: 1.5px solid #e50914;
  }

  .side-col button {
    width: 100%;
    padding: 0.5rem;
    background: ${({ theme }) => theme.primary};
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
  }

  @media (max-width: 700px) {
    flex-direction: column;
    .side-col, .review-textarea {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      height: auto;
    }
  }
`;

const ReviewBox = styled.div`
  background: ${({ theme }) => theme.surface};
  padding: 1rem;
  border-radius: 6px;

  .review-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.8rem;
    padding-top: 0.8rem;
    border-top: 1px solid #333;
  }

  .rating {
    font-size: 0.9rem;
    color: #ffd700;
    font-weight: 600;
  }

  select {
    width: 110px;
    min-width: 90px;
    padding: 0.5rem 2.2rem 0.5rem 0.8rem;
    border-radius: 6px;
    background: #232323;
    color: #fff;
    border: 1.5px solid #333;
    font-size: 1rem;
    font-weight: 600;
    appearance: none;
    outline: none;
    position: relative;
    background-image: url('data:image/svg+xml;utf8,<svg fill="%23e50914" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
    background-repeat: no-repeat;
    background-position: right 0.7rem center;
    background-size: 1.2rem;
    transition: border 0.18s;
    margin-left: 0.2rem;
  }
  select:focus {
    border: 1.5px solid #e50914;
    background-color: #292929;
  }
  select:hover {
    border: 1.5px solid #e50914;
  }

  @media (max-width: 600px) {
    .review-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.8rem;
    }
    
    select {
      width: 100%;
      margin-left: 0;
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;

  textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.8rem;
    border-radius: 8px;
    background: #1a1a1a;
    color: white;
    border: 2px solid #333;
    font-size: 0.95rem;
    font-family: inherit;
    resize: vertical;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
    
    &:focus {
      border-color: #e50914;
      background: #1c1c1c;
      box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.1);
    }
    
    &::placeholder {
      color: #888;
    }
  }

  .edit-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .edit-controls select {
    width: 120px;
    padding: 0.6rem 2.5rem 0.6rem 1rem;
    border-radius: 6px;
    background: #232323;
    color: #fff;
    border: 1.5px solid #333;
    font-size: 0.9rem;
    font-weight: 600;
    appearance: none;
    outline: none;
    cursor: pointer;
    background-image: url('data:image/svg+xml;utf8,<svg fill="%23e50914" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
    background-repeat: no-repeat;
    background-position: right 0.7rem center;
    background-size: 1.2rem;
    transition: all 0.2s ease;
    
    &:focus {
      border-color: #e50914;
      background-color: #292929;
    }
    
    &:hover {
      border-color: #e50914;
    }
  }

  .edit-buttons {
    display: flex;
    gap: 0.8rem;
  }

  .save-btn, .cancel-btn {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 70px;
  }

  .save-btn {
    background: #2d5aa0;
    color: white;
    
    &:hover {
      background: #1e4a8a;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(45, 90, 160, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  .cancel-btn {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  }

  @media (max-width: 600px) {
    .edit-controls {
      flex-direction: column;
      align-items: stretch;
      gap: 0.8rem;
    }
    
    .edit-controls select {
      width: 100%;
    }
    
    .edit-buttons {
      justify-content: center;
    }
    
    .save-btn, .cancel-btn {
      flex: 1;
      max-width: 120px;
    }
  }
`;

const EditRow = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
  
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 60px;
    
    &:first-child {
      background: #2d5aa0;
      color: white;
      
      &:hover {
        background: #1e4a8a;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(45, 90, 160, 0.3);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
    
    &:last-child {
      background: #dc3545;
      color: white;
      
      &:hover {
        background: #c82333;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
  
  @media (max-width: 600px) {
    gap: 0.6rem;
    
    button {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
      min-width: 50px;
    }
  }
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
