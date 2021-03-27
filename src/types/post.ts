import { User } from './user';
import { Comments } from './comment';

export type PostStatus = 'approved' | 'pending' | 'rejected';

export interface Tag {
  symbol: string;
  securityName: string;
}

export interface Post {
  _id?: string;
  slug: string;
  author?: string | User;
  title: string;
  content: string;
  disclosure: string;
  tags: Tag[];
  viewers?: string[];
  liked?: {
    count: number;
    users: string[];
  };
  status?: PostStatus;
  reason?: string;
  day?: number;
  week?: number;
  month?: number;
  year?: number;
  comments?: Comments[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostWithAuthor extends Post {
  author: User;
}
