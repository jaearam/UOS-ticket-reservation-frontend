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
  reservationTime: string;
  basePrice: number;
  discountAmount: number;
  finalPrice: number;
  paymentId: string | null;
  paymentStatus: string;
  ticketIssuanceStatus: string;
  memberUserId: string | null;
  userName: string;
  phoneNumber: string;
  screeningDate: string;
  screeningStartTime: string;
  completed: boolean;
  ticketIssuanceStatusText: string;
}
