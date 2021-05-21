import { Flag } from './flag';
import { Post } from './post';
import { User } from './user';

export interface Comments {
  _id?: string;
  parent: string;
  post: string | Post;
  user: string | User;
  depth?: number;
  position: string;
  liked?: {
    count: number;
    users: string[];
  };
  flags: string[] | Flag[];
  comment: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentsWithUser extends Comments {
  user: User;
}

export interface CommentsWithPostAndUser extends CommentsWithUser {
  post: Post;
}
