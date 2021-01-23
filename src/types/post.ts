import { User } from './user';

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
  week: number;
  month: number;
  year: number;
  createdAt?: Date;
  updatedAt?: Date;
}
