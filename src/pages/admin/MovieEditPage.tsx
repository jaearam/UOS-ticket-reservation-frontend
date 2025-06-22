import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const AdminMovieEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [form, setForm] = useState({
    title: '',
    genre: '',
    releaseDate: '',
    runtime: 0,
    actorName: '',
    directorName: '',
    distributorName: '',
    viewingGrade: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/admin/movies/${id}`);
        setMovie(res.data);
        setForm(res.data); // 초기값 세팅
      } catch (err) {
        console.error('영화 정보 조회 실패:', err);
      }
    };
    if (id) fetchMovie();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/admin/movies/${id}`, form);
      alert('영화 정보가 수정되었습니다!');
      navigate('/admin/movies');
    } catch (err) {
      console.error('영화 수정 실패:', err);
      alert('수정에 실패했습니다.');
    }
  };

  if (!movie) return <p>로딩 중...</p>;

  return (
    <Wrapper>
      <Title>영화 정보 수정</Title>
      <Form onSubmit={handleSubmit}>
        <Label>영화 제목</Label>
        <Input name="title" value={form.title} onChange={handleChange} required />

        <Label>장르</Label>
        <Input name="genre" value={form.genre} onChange={handleChange} required />

        <Label>개봉일</Label>
        <Input name="releaseDate" value={form.releaseDate} onChange={handleChange} required />

        <Label>러닝타임 (분)</Label>
        <Input name="runtime" type="number" value={form.runtime} onChange={handleChange} required />

        <Label>배우</Label>
        <Input name="actorName" value={form.actorName} onChange={handleChange} />

        <Label>감독</Label>
        <Input name="directorName" value={form.directorName} onChange={handleChange} />

        <Label>배급사</Label>
        <Input name="distributorName" value={form.distributorName} onChange={handleChange} />

        <Label>관람등급</Label>
        <Input name="viewingGrade" value={form.viewingGrade} onChange={handleChange} />

        <Label>영화 설명</Label>
        <TextArea name="description" value={form.description} onChange={handleChange} />

        <Label>이미지 URL</Label>
        <Input name="image" value={form.image} onChange={handleChange} />

        <SubmitButton type="submit">수정 완료</SubmitButton>
      </Form>
    </Wrapper>
  );
};

export default AdminMovieEditPage;

// 스타일 컴포넌트
const Wrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.2rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;

  &:hover {
    background: ${({ theme }) => theme.primary}cc;
  }
`;
