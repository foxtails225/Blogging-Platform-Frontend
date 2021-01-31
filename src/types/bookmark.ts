import { Post } from './post';

export interface Bookmark {
  _id: string;
  post: string | Post;
  user: string;
  archived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookmarkWithPost extends Bookmark {
  post: Post;
}
