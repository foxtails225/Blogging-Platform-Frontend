export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  phone: string;
  lastLoggedIn: Date;
  tier: string;
  role: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
