export type Type = 'support' | 'ads';

export type SupporType = 'Questions/support' | 'Feedback/ideas' | 'Refund';

export interface Support {
  _id: string;
  name: string;
  email: string;
  company: string;
  position: string;
  message: string;
  type: Type;
  support: SupporType;
  createdAt: Date;
  updatedAt: Date;
}
