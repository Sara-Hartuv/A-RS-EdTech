// src/components/teacher/StudentCard.tsx
import type { Student, WeeklyPointsLog, Voucher } from '../../types/teacher';

interface StudentData {
  student: Student;
  hasCurrentWeekPoints: boolean;
  currentWeekPoints: WeeklyPointsLog | null;
  unredeemedVouchersCount: number;
  lastVoucher: Voucher | null;
  excellenceCertificatesCount?: number;
}

interface StudentCardProps {
  studentData: StudentData;
  onOpenWeeklyPoints: () => void;
  onToggleVoucher: () => void;
}

export default function StudentCard({
  studentData,
  onOpenWeeklyPoints,
  onToggleVoucher,
}: StudentCardProps) {
  const { student, hasCurrentWeekPoints, currentWeekPoints, unredeemedVouchersCount } = studentData;

  return (
    <div className="p-4 hover:bg-slate-50 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Student Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {student.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-slate-800 truncate">{student.name}</h3>
            <p className="text-xs text-slate-400">{student.phone}</p>
          </div>
        </div>

        {/* Weekly Points Section */}
        <div className="flex items-center gap-2">
          {hasCurrentWeekPoints ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">נקודות השבוע:</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {currentWeekPoints?.points || 0}
              </span>
              <button
                onClick={onOpenWeeklyPoints}
                className="text-blue-600 hover:text-blue-700 text-sm underline"
              >
                עריכה
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenWeeklyPoints}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              הכנס ניקוד שבועי
            </button>
          )}
        </div>

        {/* Voucher Section */}
        <div className="flex items-center gap-2">
          {unredeemedVouchersCount > 0 ? (
            <button
              onClick={onToggleVoucher}
              className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors group"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
              </svg>
              יש שובר ({unredeemedVouchersCount})
              <span className="text-xs text-emerald-600 group-hover:text-emerald-700">
                (לחצי לביטול)
              </span>
            </button>
          ) : (
            <button
              onClick={onToggleVoucher}
              className="flex items-center gap-2 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              תן שובר
            </button>
          )}
        </div>

        {/* Student Stats */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-slate-500">
          <div className="text-center">
            <span className="block font-semibold text-slate-700">
              {student.currentVouchersCount || 0}
            </span>
            <span>שוברים</span>
          </div>
          <div className="text-center">
            <span className="block font-semibold text-slate-700">
              {student.excellenceCertificatesCount || 0}
            </span>
            <span>תעודות הצטיינות</span>
          </div>
        </div>
      </div>
    </div>
  );
}
