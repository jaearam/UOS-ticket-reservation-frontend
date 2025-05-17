import React from 'react';
import styled from 'styled-components';

const MovieSynopsis: React.FC = () => {
  return (
    <Container>
      <Paragraph>
        2050년, 인류는 또다시 멸망의 위기에 직면한다.
        전 세계를 혼란에 빠뜨린 '이너월드'의 출현으로
        현실과 환상의 경계가 무너지며 사람들은 서서히 자아를 잃어가는데...
      </Paragraph>
      <Paragraph>
        그 속에서 깨어난 한 남자, 자신의 기억을 찾기 위한 여정을 시작하며
        세상을 바꿀 거대한 비밀과 마주하게 된다.
      </Paragraph>
      <Paragraph>
        기억을 잃은 자, 세계를 구할 열쇠가 되다.  
        2024년, 상상 그 이상의 SF 블록버스터가 펼쳐진다.
      </Paragraph>
    </Container>
  );
};

export default MovieSynopsis;

const Container = styled.div`
  padding: 1rem 2rem;
`;

const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;
