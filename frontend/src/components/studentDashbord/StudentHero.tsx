import { Star, Gift, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { StudentData } from '../../store/studentStore';

type Props = { student: StudentData };

export default function StudentHero({ student }: Props) {
  const hasCurrentWeekData = student.hasCurrentWeekData ?? false;
  const points = student.weeklyPoints ?? 0;
  const hasVoucher = student.hasVoucherThisWeek ?? false;
  const availableVouchers = student.vouchersAvailable ?? 0;

  // If teacher hasn't entered data for current week, show message
  if (!hasCurrentWeekData) {
    return (
      <div className="space-y-4">
        {/* Message Card */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                המורה עדיין לא הכניסה נתוני שבוע זה
              </h3>
              <p className="text-amber-800">
                לכן אין אפשרות לצפות בדו״ח השבוע. בינתיים תוכלי לראות כמה שוברים יש לך למימוש באתר.
              </p>
            </div>
          </div>
        </div>

        {/* Available Vouchers Card Only */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-start-2">
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-6 shadow-lg text-white">
              <div className="text-sm font-medium opacity-90 mb-2">שוברים שצברתי למימוש באתר</div>
              <div className="text-5xl font-black mb-3">{availableVouchers}</div>
              <div className="flex justify-center">
                <Gift className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show full dashboard with current week data
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Weekly Points - Sky Blue */}
      <div className="bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl p-6 shadow-lg text-white">
        <div className="text-sm font-medium opacity-90 mb-2">נקודות שצברתי השבוע</div>
        <div className="text-5xl font-black mb-3">{points}</div>
        <div className="flex justify-center">
          <Star className="w-10 h-10 fill-white" />
        </div>
      </div>

      {/* Card 2: Voucher This Week - Green */}
      <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl p-6 shadow-lg text-white">
        <div className="text-sm font-medium opacity-90 mb-2">האם קיבלתי שובר השבוע?</div>
        <div className="flex items-center justify-center mt-4 mb-3">
          {hasVoucher ? (
            <CheckCircle className="w-20 h-20" strokeWidth={3} />
          ) : (
            <XCircle className="w-20 h-20" strokeWidth={3} />
          )}
        </div>
        <div className="text-2xl font-bold text-center">
          {hasVoucher ? 'כן!' : 'לא הפעם'}
        </div>
      </div>

      {/* Card 3: Available Vouchers - Purple */}
      <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-6 shadow-lg text-white">
        <div className="text-sm font-medium opacity-90 mb-2">שוברים שצברתי למימוש באתר</div>
        <div className="text-5xl font-black mb-3">{availableVouchers}</div>
        <div className="flex justify-center">
          <Gift className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
}