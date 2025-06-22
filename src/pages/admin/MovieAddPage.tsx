// src/pages/admin/MovieAddPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const formatToDateInput = (yyyymmdd: string) => {
  if (yyyymmdd.length !== 8) return '';
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
};

const MovieAddPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    genre: '',
    releaseDate: '',
    screeningStatus: "D",
    runtime: '',
    actorName: '',
    directorName: '',
    distributorName: '',
    viewingGrade: '',
    description: '',
    image: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/admin/movies', form);
      alert('영화가 등록되었습니다.');
      navigate('/admin/movies');
    } catch (err: any) {
      setError(err.response?.data?.message || '등록 실패');
    }
  };

  return (
    <Wrapper>
      <h2>영화 등록</h2>
      <Form onSubmit={handleSubmit}>
        <Row><label>제목</label><input name="title" value={form.title} onChange={handleChange} required /></Row>
        <Row><label>장르</label><input name="genre" value={form.genre} onChange={handleChange} required /></Row>
        <Row>
  <label>개봉일</label>
  <input
    name="releaseDate"
    type="date"
    value={formatToDateInput(form.releaseDate)} // 내부 값이 YYYYMMDD일 때 input용 YYYY-MM-DD로 변환
    onChange={(e) => {
      const dateValue = e.target.value.replaceAll('-', ''); // "2024-06-10" → "20240610"
      setForm({ ...form, releaseDate: dateValue });
    }}
    required
  />
</Row>
        <Row><label>러닝타임 (분)</label><input name="runtime" value={form.runtime} onChange={handleChange} required /></Row>
        <Row><label>배우</label><input name="actorName" value={form.actorName} onChange={handleChange} /></Row>
        <Row><label>감독</label><input name="directorName" value={form.directorName} onChange={handleChange} /></Row>
        <Row><label>배급사</label><input name="distributorName" value={form.distributorName} onChange={handleChange} /></Row>
        <Row><label>관람등급</label><input name="viewingGrade" value={form.viewingGrade} onChange={handleChange} /></Row>
        <Row><label>설명</label><textarea name="description" value={form.description} onChange={handleChange} /></Row>
        <Row><label>이미지 URL</label><input name="image" value={form.image} onChange={handleChange} /></Row>
        {error && <ErrorText>{error}</ErrorText>}
        <SubmitButton type="submit">등록</SubmitButton>
      </Form>
    </Wrapper>
  );
};

export default MovieAddPage;

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: 0.95rem;
    font-weight: bold;
    margin-bottom: 0.4rem;
    color: ${({ theme }) => theme.text};
  }

  input,
  textarea {
    padding: 0.8rem;
    background: ${({ theme }) => theme.surface};
    border: 1px solid #444;
    border-radius: 6px;
    color: ${({ theme }) => theme.text};
    font-size: 0.95rem;
    resize: none;
  }

  textarea {
    min-height: 100px;
  }
`;

const SubmitButton = styled.button`
  padding: 0.9rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: ${({ theme }) => theme.primary}cc;
  }
`;

const ErrorText = styled.p`
  color: #f44336;
  font-size: 0.9rem;
  margin-top: -0.5rem;
`;
