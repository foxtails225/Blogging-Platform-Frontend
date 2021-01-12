export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  country: string;
  phone: string;
  firstName: string;
  lastName: string;
  bio: string;
  lastLoggedIn: Date;
  tier: string;
  role: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
