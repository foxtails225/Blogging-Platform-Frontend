export interface Tag {
  symbol: string;
  name: string;
}

export interface Post {
  _id: string;
  author: string;
  title: string;
  content: string;
  disclosure: string;
  tags: Tag[];
  viewers: string[];
  liked: {
    count: number;
    users: string[];
  };
  status: string;
  week: string;
  month: string;
  year: string;
  createdAt: Date;
  updatedAt: Date;
}
