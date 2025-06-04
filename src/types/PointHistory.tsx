export interface PointHistory {
  id: number;
  memberId: number;
  amount: number;
  type: 'A' | 'U'; // A: 적립, U: 사용
  typeText: string;
  pointTime: string;
  accumulation: boolean;
  expiration: boolean;
  usage: boolean;
}