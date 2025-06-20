import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Guest {
  phoneNumber: string;
}

const GuestListPage: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);

  const fetchGuests = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/admin/nonmembers');
      setGuests(res.data);
    } catch (err) {
      console.error('비회원 목록 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);
console.log(guests);
  return (
    <Wrapper>
      <Title>비회원 전화번호 목록</Title>
      {guests.length === 0 ? (
        <Empty>등록된 비회원 예매 내역이 없습니다.</Empty>
      ) : (
        <PhoneList>
          {guests.map((guest, index) => (
            <PhoneItem key={index}>
              📱 {guest.phoneNumber.trim()}
            </PhoneItem>
          ))}
        </PhoneList>
      )}
    </Wrapper>
  );
};

export default GuestListPage;

const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.primary};
`;

const Empty = styled.p`
  text-align: center;
  color: #999;
  padding: 2rem;
`;

const PhoneList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PhoneItem = styled.li`
  background: ${({ theme }) => theme.surface};
  padding: 0.9rem 1.2rem;
  border-radius: 8px;
  margin-bottom: 0.6rem;
  font-size: 1rem;
  border: 1px solid #333;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.primary}22;
  }
`;
