export interface Reservation {
  id: string;
  scheduleId: string;
  movieTitle: string;
  cinemaName: string;
  screenName: string;
  seatId: number;
  seatLabel: string;
  seatGradeName: string;
  status: string;
  basePrice: number;
  discountAmount: number;
  finalPrice: number;
  paymentId: string;
  paymentStatus: string;
  ticketIssuanceStatus: string;
  memberId: number;
  userName: string;
  phoneNumber: string;
  screeningDate: string;
  screeningStartTime: string;
}
