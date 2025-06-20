import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Member } from '../../types/Member'; // Assuming you have a Member type defined

const MemberListPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    axios.get('http://localhost:8080/api/admin/members', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => setMembers(res.data))
    .catch((err) => {
      console.error('회원 목록 조회 실패:', err);
      alert('회원 목록을 불러오지 못했습니다.');
    });
  }, []);
console.log(members);
  return (
    <Wrapper>
      <Title>전체 회원 목록</Title>
      <Table>
        <thead>
          <tr>
            <th>회원 ID</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>생년월일</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.userId}>
              <td>{member.userId}</td>
              <td>{member.email}</td>
              <td>{member.phoneNumber}</td>
              <td>{member.birthDate}</td>
              <td>
                <DetailButton onClick={() => navigate(`/admin/members/detail/${member.userId}`)}>
                  상세보기
                </DetailButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default MemberListPage;

const Wrapper = styled.div`
  min-height: 100vh;
  background: #181818;
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 2rem;
  background: #232323;
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.25);
  overflow: hidden;

  th, td {
    padding: 1.1rem 1.2rem;
    text-align: left;
    font-size: 1.05rem;
  }

  th {
    background-color: #181818;
    color: #e50914;
    font-weight: 700;
    border-bottom: 2px solid #e50914;
    letter-spacing: 0.5px;
  }

  td {
    background-color: #232323;
    color: #f5f5f5;
    border-bottom: 1px solid #333;
    transition: background 0.2s;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover td {
    background: #292929;
  }
`;

const DetailButton = styled.button`
  padding: 0.5rem 1.1rem;
  border: none;
  background: #e50914;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(229,9,20,0.12);
  transition: background 0.2s, transform 0.1s;

  &:hover {
    background: #b0060f;
    transform: translateY(-2px) scale(1.04);
  }
`;

const Title = styled.h2`
  color: #fff;
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0,0,0,0.25);
`;
