// src/utils/mapper.ts
import { Movie } from '../types/Movie';

interface MovieDto {
  id: number;
  title: string;
  genre: string;
  releaseDate: string;
  screeningStatus: string; // 'D', 'N', 'Y'
  image: string;
}

export const mapMovieDtoToMovie = (dto: MovieDto): Movie => ({
  id: dto.id,
  title: dto.title,
  genre: dto.genre,
  release: dto.releaseDate,
  poster: dto.image,
  status: dto.screeningStatus === 'D' ? 'now' : 'soon', // or use full mapping if needed
});
