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

  return (
    <Wrapper>
      <h2>전체 회원 목록</h2>
      <Table>
        <thead>
          <tr>
            <th>회원 ID</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>생년월일</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.userId}</td>
              <td>{member.email}</td>
              <td>{member.phoneNumber}</td>
              <td>{member.birthDate}</td>
			    <td>
				<DetailButton onClick={() => navigate(`/admin/members/detail/${member.id}`)}>
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;

  th, td {
    border: 1px solid #444;
    padding: 0.75rem 1rem;
    text-align: left;
  }

  th {
    background-color: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.text};
  }

  td {
    background-color: #1a1a1a;
  }
`;
const DetailButton = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: '#3b3bff'};
  }
`;
