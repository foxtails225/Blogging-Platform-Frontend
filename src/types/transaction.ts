import { User } from './user';

export type TransactionType = 'post_approved' | 'tips';

export interface Transaction {
  _id?: string;
  user: string;
  client: string | User;
  amount: number;
  fee: number;
  paymentId: string;
  refund: boolean;
  requestRefund: boolean;
  type: TransactionType;
  refId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Balance {
  available: number;
  instant_available: number;
  pending: number;
}

export interface TransactionWithClient extends Transaction {
  client: User;
}
