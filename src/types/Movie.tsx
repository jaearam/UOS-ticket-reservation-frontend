// src/types/Movie.ts
export interface Movie {
  id: number;
  title: string;
  genre: string;
  release: string;
  status: 'now' | 'soon';
  poster: string;
}
