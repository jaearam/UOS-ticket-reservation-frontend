// 📁 src/data/movies.ts
export type Movie = {
  id: number;
  title: string;
  poster: string;
  genre: string;
  release: string;
  status: 'now' | 'soon';
};

export const movies: Movie[] = [
  {
    id: 1,
    title: '몬스터즈',
    poster: '/images/movie1.jpg',
    genre: '액션',
    release: '2024.05.20',
    status: 'now',
  },
  {
    id: 2,
    title: '소울플레이',
    poster: '/images/movie2.jpg',
    genre: '드라마',
    release: '2024.05.22',
    status: 'now',
  },
  {
    id: 3,
    title: '이너월드',
    poster: '/images/movie3.jpg',
    genre: 'SF',
    release: '2024.06.01',
    status: 'soon',
  },
];
