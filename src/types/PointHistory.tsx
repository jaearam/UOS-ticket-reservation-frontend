export interface PointHistory {
  id: number;
  memberId: number;
  amount: number;
  type: 'A' | 'U'; // A: 적립, U: 사용
  typeText: string;
  createdAt: string;
  accumulation: boolean;
  expiration: boolean;
  usage: boolean;
}