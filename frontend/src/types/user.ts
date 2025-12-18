// src/types/user.ts

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  _id: string;
  name: string;
  phone: string;
  role: UserRole;
  email?: string;
  weeklyPoints?: number;
  excellenceVouchers?: number;
  bubbleVouchers?: number;
  createdAt?: string;
}
