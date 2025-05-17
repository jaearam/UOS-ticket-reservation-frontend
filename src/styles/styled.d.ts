import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    surface: string;
    card: string;
    primary: string;
    text: string;
    textMuted: string;
  }
}
