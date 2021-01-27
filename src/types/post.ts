import { User } from './user';
import { Comments } from './comment';

export interface Tag {
  symbol: string;
  name: string;
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
  status?: string;
  week?: number;
  month?: number;
  year?: number;
  comments?: Comments[];
  createdAt?: Date;
  updatedAt?: Date;
}
