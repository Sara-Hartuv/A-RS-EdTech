// src/api/student.api.ts
import { api } from './api';

export interface DashboardData {
  hasCurrentWeekData: boolean;
  weeklyPoints: number | null;
  hasVoucherThisWeek: boolean | null;
  currentVouchersCount: number;
}

/**
 * Get dashboard data for the logged-in student.
 */
export const getMyDashboardData = () => {
  return api.get<DashboardData>('/students/me/dashboard');
};
