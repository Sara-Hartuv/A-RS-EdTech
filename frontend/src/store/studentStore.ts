import {create} from 'zustand';
import * as authApi from '../api/auth.api';

export interface StudentData {
  name: string;
  weeklyPoints: number;
  hasVoucherThisWeek: boolean;
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
      const res = await authApi.getCurrentUser();
      const user = res.data;

      const mapped: StudentData = {
        name: user.name || '',
        weeklyPoints: user.weeklyPoints ?? 0,
        hasVoucherThisWeek: (user.excellenceVouchers ?? 0) > 0 || (user.bubbleVouchers ?? 0) > 0,
        teacherComment: '',
        periodHistory: [],
        totalCertificates: 0,
        vouchersAvailable: (user.excellenceVouchers ?? 0) + (user.bubbleVouchers ?? 0),
      };

      set({ student: mapped, loading: false });
    } catch (err) {
      console.error('Failed fetching student data:', err);
      set({ loading: false });
    }
  },
}));

export default useStudentStore;
