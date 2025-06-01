export interface SeatDto {
  id: number;
  seatGradeId: string;
  seatGradeName: string;
  row: string;
  column: string;
  screenId: string;
  price: number;
}

const getSeatLabel = (seat: SeatDto) => `${seat.row}${seat.column}`;
