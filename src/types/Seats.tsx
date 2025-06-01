export interface Seat {
  id: number;
  seatNumber: string; // 예: "A06"
  row: string;
  column: string;
  price: number;
  seatGradeId: string;
  seatGradeName: string;
  available: boolean;
  seatLabel?: string; // UI에 표시될 이름
}
