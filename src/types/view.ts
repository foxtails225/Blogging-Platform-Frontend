export interface View {
  _id: string;
  viewer: string;
  post?: string;
  day?: number;
  week?: number;
  month?: number;
  year?: number;
  createdAt: Date;
  updatedAt: Date;
}
