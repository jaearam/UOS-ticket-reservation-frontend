export interface ScheduleDto {
  id: string;
  movieId: number;
  movieTitle: string;
  screenId: string;
  screenName: string;
  cinemaName: string;
  screeningDate: string; // yyyy-MM-dd
  screeningStartTime: string; // ISO string e.g. "2025-06-01T13:30:00"
  runtime: number;
}
