import { User } from './user';

export type NotifyStatus =
  | 'new_comment'
  | 'post_approved'
  | 'post_rejected'
  | 'payment_success'
  | 'tips_success'
  | 'tip_refunded';

export interface Notification {
  _id?: string;
  user: string | User;
  title: string;
  description: string;
  type: NotifyStatus;
  url: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
