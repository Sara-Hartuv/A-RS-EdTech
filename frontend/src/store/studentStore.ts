import { create } from 'zustand';
import { useAuthStore } from './authStore';
import * as studentApi from '../api/student.api';

// להשתמש בטייפים שיש לי כבר ולא להגדיר מחדש 

export interface StudentData {
  name: string;
  hasCurrentWeekData: boolean;
  weeklyPoints: number | null;
  hasVoucherThisWeek: boolean | null;
  teacherComment: string;
  periodHistory: Array<boolean | null>; // true = voucher earned, false = missed, null = future/current
  totalCertificates: number;
  vouchersAvailable: number;
}

type StudentState = {
  student?: StudentData;
  loading: boolean;
  fetchStudent: () => Promise<void>;
};

export const useStudentStore = create<StudentState>((set) => ({
  student: undefined,
  loading: false,
  fetchStudent: async () => {
    set({ loading: true });
    try {
      const authUser = useAuthStore.getState().user;

      if (!authUser) {
        // No authenticated user — nothing to fetch
        set({ loading: false });
        return;
      }

      // Fetch dashboard data from new endpoint
      try {
        const dashboardRes = await studentApi.getMyDashboardData();
        const dashboardData = dashboardRes.data;

        const mapped: StudentData = {
          name: authUser.name || '',
          hasCurrentWeekData: dashboardData.hasCurrentWeekData,
          weeklyPoints: dashboardData.weeklyPoints,
          hasVoucherThisWeek: dashboardData.hasVoucherThisWeek,
          teacherComment: 'רחלי יקרה! עשית התקדמות משמעותית השבוע, המשיכי כך!',
          periodHistory: [true, null, null, null, null],
          totalCertificates: authUser.excellanceCetificatesCount ?? 0,
          vouchersAvailable: dashboardData.currentVouchersCount,
        };

        set({ student: mapped, loading: false });
      } catch (innerErr) {
        // If student-specific API fails, return fallback data
        console.error('Failed fetching student dashboard data:', innerErr);
        const fallback: StudentData = {
          name: authUser.name || '',
          hasCurrentWeekData: false,
          weeklyPoints: null,
          hasVoucherThisWeek: null,
          teacherComment: '',
          periodHistory: [],
          totalCertificates: authUser.excellanceCetificatesCount ?? 0,
          vouchersAvailable: authUser.currentVouchersCount ?? 0,
        };
        set({ student: fallback, loading: false });
      }
    } catch (err) {
      console.error('Failed fetching student data:', err);
      set({ loading: false });
    }
  },
}));

export default useStudentStore;
