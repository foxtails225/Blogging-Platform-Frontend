export interface Status {
  published: number;
  comments: number;
  pending: number;
  tags: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  cover: string;
  country: string;
  phone: string;
  firstName: string;
  lastName: string;
  bio: string;
  lastLoggedIn: Date;
  banned: Date;
  tier: string;
  role: string;
  isPublic: boolean;
  status: boolean;
  reason: string;
  stripeId: string;
  following: string[];
  followers: string[];
  createdAt: Date;
  updatedAt: Date;
}
