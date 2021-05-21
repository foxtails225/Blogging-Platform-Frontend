export type TransactionType = 'post_approved' | 'tips';

export interface Transaction {
  _id?: string;
  user: string;
  client: string;
  amount: number;
  fee: number;
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
