export type Type = 'support' | 'ads';

export interface Support {
  _id: string;
  name: string;
  email: string;
  company: string;
  position: string;
  message: string;
  type: Type;
  createdAt: Date;
  updatedAt: Date;
}
