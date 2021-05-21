import { User } from './user';

export type NotifyStatus =
  | 'new_comment'
  | 'post_approved'
  | 'post_rejected'
  | 'payment_success'
  | 'tips_success';

export interface Notification {
  _id?: string;
  user: string | User;
  title: string;
  description: string;
  type: NotifyStatus;
  isRead: boolean;
  url: string;
  createdAt?: Date;
  updatedAt?: Date;
}
