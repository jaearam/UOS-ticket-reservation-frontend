import React, { useState } from 'react';
import styled from 'styled-components';

type Props = {
  selectedTheater: string;
  selectedTime: string;
  onSelectTheater: (theater: string) => void;
  onSelectTime: (time: string) => void;
};

const theaters = ['CGV 강남', 'CGV 용산', 'CGV 홍대'];
const times = ['10:00', '13:30', '16:00', '18:40', '21:20'];

const ReserveTime: React.FC<Props> = ({
  selectedTheater,
  selectedTime,
  onSelectTheater,
  onSelectTime,
}) => {
  return (
    <Wrapper>
      <Label>극장 선택</Label>
      <ButtonGroup>
        {theaters.map((t) => (
          <SelectButton
            key={t}
            selected={t === selectedTheater}
            onClick={() => onSelectTheater(t)}
          >
            {t}
          </SelectButton>
        ))}
      </ButtonGroup>

      <Label>시간 선택</Label>
      <ButtonGroup>
        {times.map((t) => (
          <SelectButton
            key={t}
            selected={t === selectedTime}
            onClick={() => onSelectTime(t)}
          >
            {t}
          </SelectButton>
        ))}
      </ButtonGroup>
    </Wrapper>
  );
};

export default ReserveTime;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Label = styled.h4`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.textMuted};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SelectButton = styled.button<{ selected: boolean }>`
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  background: ${({ theme, selected }) =>
    selected ? theme.primary : theme.surface};
  color: ${({ selected }) => (selected ? '#fff' : '#ccc')};

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: #fff;
  }
`;
