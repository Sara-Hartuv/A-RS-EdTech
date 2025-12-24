// src/types/user.ts

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  _id: string;
  name: string;
  phone: string;
  role: UserRole;
  email?: string;
  currentVouchersCount?: number;
  excellanceCetificatesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

//צריך להוסיף אימייל והאם קיבלה שובר השבוע 