import { User } from './user';

export interface Comments {
  _id?: string;
  parent: string;
  post: string;
  user: string | User;
  depth?: number;
  position: string;
  liked?: {
    count: number;
    users: string[];
  };
  comment: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentsWithUser extends Comments {
  user: User;
}
