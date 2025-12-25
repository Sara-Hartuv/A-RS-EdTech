import { Star, Gift, Sparkles, Trophy, Zap } from 'lucide-react';
import type { StudentData } from '../../store/studentStore';

type Props = { student: StudentData };

export default function StudentHero({ student }: Props) {
  const hasCurrentWeekData = student.hasCurrentWeekData ?? false;
  const points = student.weeklyPoints ?? 0;
  const hasVoucher = student.hasVoucherThisWeek ?? false;
  const availableVouchers = student.vouchersAvailable ?? 0;
  
  // Calculate progress percentage for visual bar (assuming 100 points = full bar)
  const maxPoints = 100;
  const progressPercent = Math.min((points / maxPoints) * 100, 100);

  // If teacher hasn't entered data for current week
  if (!hasCurrentWeekData) {
    return (
      <div className="relative">
        {/* Decorative background shapes */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-200 rounded-full opacity-30 blur-3xl" />
        
        <div className="relative bg-gradient-to-br from-neutral-50 to-primary-50 rounded-[2rem] p-8 border border-primary-100">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-10 h-10 text-accent-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-700 mb-2">ממתינים לנתוני השבוע...</p>
              <p className="text-neutral-500">המורה עוד לא עדכנה את הנתונים</p>
            </div>
            
            {/* Vouchers mini card */}
            <div className="bg-white rounded-2xl px-8 py-4 shadow-lg border-2 border-primary-200">
              <p className="text-sm text-neutral-500 mb-1">שוברים זמינים</p>
              <div className="flex items-center gap-2 justify-center">
                <Gift className="w-6 h-6 text-primary-500" />
                <span className="text-4xl font-black text-primary-600">{availableVouchers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Decorative background blobs */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary-300 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-accent-300 rounded-full opacity-20 blur-3xl" />
      
      <div className="relative space-y-6">
        {/* Main Stats Row - Bento Style */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* Points Card - Large */}
          <div className="col-span-12 md:col-span-5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-[2rem] p-6 text-white relative overflow-hidden group">
            {/* Decorative circle */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">נקודות השבוע</span>
              </div>
              
              <div className="text-7xl font-black mb-4 tracking-tight">{points}</div>
              
              {/* Progress bar */}
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs mt-2 opacity-75">{points} מתוך {maxPoints} נקודות</p>
            </div>
            
            {/* Floating stars animation */}
            <Star className="absolute top-4 right-4 w-6 h-6 text-white/30 animate-pulse" />
          </div>

          {/* Voucher Status - Medium */}
          <div className={`col-span-12 md:col-span-4 rounded-[2rem] p-6 relative overflow-hidden ${
            hasVoucher 
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white' 
              : 'bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-600'
          }`}>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">שובר השבוע</span>
              </div>
              
              {hasVoucher ? (
                <div className="text-center py-4">
                  <div className="text-5xl mb-2">🎉</div>
                  <p className="text-2xl font-black">קיבלת שובר!</p>
                  <p className="text-sm opacity-90 mt-1">כל הכבוד!</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-5xl mb-2 grayscale opacity-50">🎯</div>
                  <p className="text-xl font-bold">עוד קצת...</p>
                  <p className="text-sm opacity-70 mt-1">בשבוע הבא!</p>
                </div>
              )}
            </div>
          </div>

          {/* Available Vouchers - Small */}
          <div className="col-span-12 md:col-span-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-[2rem] p-6 text-white relative overflow-hidden">
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5" />
                <span className="text-xs font-medium opacity-90">לקניה באתר</span>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-6xl font-black">{availableVouchers}</div>
                <p className="text-sm font-medium opacity-90">שוברים</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}