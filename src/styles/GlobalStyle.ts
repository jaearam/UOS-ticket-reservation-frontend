import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }

  a {
    color: ${({ theme }) => theme.text};
    text-decoration: none;
  }

  button {
    font-family: inherit;
  }
`;
