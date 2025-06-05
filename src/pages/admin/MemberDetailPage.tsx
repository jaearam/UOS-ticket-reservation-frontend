// src/pages/admin/MemberDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Member } from '../../types/Member'; // Assuming you have a Member type defined

const MemberDetailPage: React.FC = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/admin/members/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setMember(res.data.member);
      } catch (err) {
        console.error('회원 상세 정보 조회 실패:', err);
      }
    };
    if (id) fetchMember();
  }, [id, token]);

  if (!member) return <Wrapper>회원 정보를 불러오는 중...</Wrapper>;

  return (
    <Wrapper>
      <h2>회원 상세 정보</h2>
      <InfoBox>
        <p><strong>아이디:</strong> {member.userId}</p>
        <p><strong>이메일:</strong> {member.email}</p>
        <p><strong>전화번호:</strong> {member.phoneNumber}</p>
        <p><strong>생년월일:</strong> {member.birthDate}</p>
        {/* <p><strong>보유 포인트:</strong> {member.point.toLocaleString()}P</p> */}
      </InfoBox>
    </Wrapper>
  );
};

export default MemberDetailPage;

const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const InfoBox = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid #444;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 1rem;

  p {
    margin: 0.8rem 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.text};
  }

  strong {
    color: ${({ theme }) => theme.primary};
    margin-right: 0.5rem;
  }
`;
