import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

interface Guest {
  phoneNumber: string;
}

const GuestListPage: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGuests = async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    try {
      const res = await axios.get('http://localhost:8080/api/admin/nonmembers', {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      setGuests(res.data);
    } catch (err) {
      console.error('비회원 목록 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  if (isLoading) {
    return <Container><p>목록을 불러오는 중...</p></Container>;
  }

  return (
    <Container>
      <Title>비회원 관리</Title>
      {guests.length === 0 ? (
        <Empty>등록된 비회원 예매 내역이 없습니다.</Empty>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>전화번호</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, index) => (
                <tr key={index}>
                  <td>{guest.phoneNumber}</td>
                  <td>
                    <Link to={`/admin/guests/detail/${guest.phoneNumber}`}>
                      <ActionButton>상세조회</ActionButton>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default GuestListPage;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: #f4f4f4;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const Empty = styled.p`
  text-align: center;
  color: #999;
  padding: 3rem;
  background: #1a1a1a;
  border-radius: 12px;
`;

const TableContainer = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #333;
  }
  th {
    background: #2a2a2a;
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
  tbody tr:hover {
    background: #2c2c2c;
  }
`;

const ActionButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    background: #0056b3;
  }
`;
