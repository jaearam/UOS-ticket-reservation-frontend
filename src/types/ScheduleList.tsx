export interface Schedule {
  id: string;
  movieId: number;
  movieTitle: string;
  runtime: number;
  screeningDate: string; // "20250603"
  screeningStartTime: string; // "2025-06-03T09:30:00"
  screeningEndTime: string;   // "2025-06-03T11:41:00"
  cinemaName: string;
  screenId: string;
  screenName: string;
}
