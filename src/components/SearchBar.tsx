import React from 'react';
import styled from 'styled-components';
import * as FiIcons from 'react-icons/fi'; 

interface Props {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchBar: React.FC<Props> = ({ query, onChange, onSubmit }) => {
  return (
	<Form onSubmit={onSubmit}>
	<IconWrapper>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
    </svg>
	</IconWrapper>
	<Input
		type="text"
		placeholder="영화 제목, 배우, 감독 등 검색"
		value={query}
		onChange={onChange}
	/>
	</Form>
  );
};

export default SearchBar;

const Form = styled.form`
  display: flex;
  align-items: center;
  background-color: #1c1c1c;
  padding: 0.75rem 1rem;
  border: 1px solid #555;
  border-radius: 8px;
  width: 100%;
  max-width: 480px;
  margin: 1rem auto;
  gap: 0.5rem;
  color: white;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: #888;
  }	
`
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #aaa;
`;
;
