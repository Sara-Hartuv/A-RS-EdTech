// src/api/teacher.api.ts
import { api } from './api';
import type { Student, WeeklyPointsLog, Voucher } from '../types/teacher';

/**
 * Get all students assigned to the logged-in teacher.
 */
export const getMyStudents = () => {
  return api.get<Student[]>('/teachers/my-students');
};

/**
 * Get current week points log for a specific student.
 */
export const getCurrentWeekPoints = (studentId: string) => {
  return api.get<WeeklyPointsLog | null>(`/weekly-points-logs/student/${studentId}/current-week`);
};

/**
 * Check if a student has points entered for the current week.
 */
export const hasCurrentWeekPoints = (studentId: string) => {
  return api.get<{ hasPoints: boolean }>(`/weekly-points-logs/student/${studentId}/has-current-week`);
};

/**
 * Create a new weekly points log entry.
 */
export const createWeeklyPointsLog = (data: {
  student: string;
  points: number;
  weekStartDate: string;
  hasVoucher?: boolean;
}) => {
  return api.post<WeeklyPointsLog>('/weekly-points-logs', data);
};

/**
 * Update an existing weekly points log.
 */
export const updateWeeklyPointsLog = (logId: string, data: { points?: number; hasVoucher?: boolean }) => {
  return api.put<WeeklyPointsLog>(`/weekly-points-logs/${logId}`, data);
};

/**
 * Get unredeemed vouchers for a student.
 */
export const getUnredeemedVouchers = (studentId: string) => {
  return api.get<Voucher[]>(`/vouchers/student/${studentId}/unredeemed`);
};

/**
 * Get all vouchers for a student.
 */
export const getStudentVouchers = (studentId: string) => {
  return api.get<Voucher[]>(`/vouchers/student/${studentId}`);
};

/**
 * Issue a new voucher to a student.
 */
export const issueVoucher = (studentId: string) => {
  return api.post<Voucher>('/vouchers', { student: studentId });
};

/**
 * Delete/revoke a voucher.
 */
export const deleteVoucher = (voucherId: string) => {
  return api.delete<{ message: string; voucher: Voucher }>(`/vouchers/${voucherId}`);
};
