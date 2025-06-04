// components/AdminLink.tsx
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AdminLink = styled(Link)`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  text-decoration: none;
  margin-left: auto;

  &:hover {
    background: #b30000;
  }
`;

export default AdminLink;
