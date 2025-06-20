// src/pages/admin/MemberDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Member } from '../../types/Member'; // Assuming you have a Member type defined

const MemberDetailPage: React.FC = () => {
  const { userId } = useParams();
  const { token } = useAuth();
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    console.log(userId);
    const fetchMember = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/admin/members/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setMember(res.data);
        console.log(res.data);
      } catch (err) {
        console.error('회원 상세 정보 조회 실패:', err);
      }
    };
    if (userId) fetchMember();
  }, [userId, token]);

  if (!member) return <Wrapper>회원 정보를 불러오는 중...</Wrapper>;

  return (
    <Wrapper>
      <Title>회원 상세 정보</Title>
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
  min-height: 100vh;
  background: #181818;
  max-width: 600px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoBox = styled.div`
  background: #232323;
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.25);
  padding: 2.5rem 2rem;
  margin-top: 2rem;
  width: 100%;
  max-width: 480px;

  p {
    margin: 1.2rem 0;
    font-size: 1.08rem;
    color: #f5f5f5;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #333;
    padding-bottom: 0.7rem;
    &:last-child {
      border-bottom: none;
    }
  }

  strong {
    color: #e50914;
    margin-right: 0.7rem;
    font-weight: 700;
    min-width: 90px;
    display: inline-block;
  }
`;

const Title = styled.h2`
  color: #fff;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.25);
`;
