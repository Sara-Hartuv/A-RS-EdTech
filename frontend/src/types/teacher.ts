// src/types/teacher.ts

export interface Student {
  _id: string;
  name: string;
  phone: string;
  role: 'student';
  status: boolean;
  currentVouchersCount?: number;
  currentWeeklyPoints?: number;
  excellenceCertificatesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WeeklyPointsLog {
  _id: string;
  student: string | Student;
  points: number;
  weekStartDate: string;
  approvedBy: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface Voucher {
  _id: string;
  student: string | Student;
  issuedBy: string | { _id: string; name: string };
  order?: string | null;
  period?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string | { _id: string; name: string } | null;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentDashboardData {
  student: Student;
  hasCurrentWeekPoints: boolean;
  currentWeekPoints?: WeeklyPointsLog | null;
  hasVoucher: boolean;
}
