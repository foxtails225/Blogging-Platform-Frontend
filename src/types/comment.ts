import { User } from './user';

export interface Reply {
  _id?: string;
  parent: string;
  commentId: string;
  user: string | User;
  comment: string;
  depth: number;
  createdAt?: Date;
}

export interface Comments {
  _id?: string;
  slug: string;
  post: string;
  user: string | User;
  reply?: Reply[];
  comment: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentsWithUser extends Comments {
  user: User;
}

export interface ReplyWithUser extends Reply {
  user: User;
}
