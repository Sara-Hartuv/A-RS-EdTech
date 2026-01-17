import { Check, X, Award, Rocket } from 'lucide-react';

type Props = {
  history: Array<boolean | null>;
};

export default function StudentRoadmap({ history }: Props) {
  const weeksData = history;
  const currentIndex = weeksData.findIndex((v) => v === null);
  const completedWeeks = weeksData.filter((v) => v === true).length;
  const totalWeeks = weeksData.length;
  const progressPercent = (completedWeeks / totalWeeks) * 100;

  return (
    <div className="relative bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30 rounded-[2rem] p-8 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400" />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-black text-2xl text-neutral-800">המסע לתעודת הצטיינות</h3>
          <p className="text-neutral-500 text-sm mt-1">כל שבוע מוצלח מקרב אותך למטרה!</p>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-2 shadow-md">
          <Rocket className="w-5 h-5 text-accent-500" />
          <span className="font-bold text-neutral-700">{completedWeeks}/{totalWeeks}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="bg-neutral-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Weeks timeline */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto py-4">
        {weeksData.map((weekStatus, i) => {
          const isCurrent = i === currentIndex;
          const isPast = weekStatus !== null;

          return (
            <div key={i} className="flex flex-col items-center flex-1 min-w-[60px]">
              {/* Status indicator */}
              <div
                className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${
                  weekStatus === true
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                    : weekStatus === false
                    ? 'bg-red-400 text-white shadow-lg shadow-red-200'
                    : isCurrent
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-200 ring-4 ring-primary-200 scale-110'
                    : 'bg-neutral-200 text-neutral-400'
                }`}
              >
                {weekStatus === true ? (
                  <Check className="w-6 h-6" strokeWidth={3} />
                ) : weekStatus === false ? (
                  <X className="w-6 h-6" strokeWidth={3} />
                ) : (
                  <span className="text-sm font-bold">{i + 1}</span>
                )}
                
                {/* Current indicator pulse */}
                {isCurrent && (
                  <div className="absolute -inset-1 bg-primary-400 rounded-xl opacity-30 animate-ping" />
                )}
              </div>
              
              {/* Week label */}
              <span className={`mt-2 text-xs font-semibold ${
                isPast ? 'text-neutral-600' : 'text-neutral-400'
              }`}>
                ש׳{i + 1}
              </span>
            </div>
          );
        })}

        {/* Certificate Goal */}
        <div className="flex flex-col items-center min-w-[80px] mr-2">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            completedWeeks === totalWeeks
              ? 'bg-gradient-to-br from-amber-400 to-accent-500 shadow-xl shadow-accent-200 scale-110'
              : 'bg-gradient-to-br from-neutral-300 to-neutral-400'
          }`}>
            <Award className={`w-9 h-9 ${completedWeeks === totalWeeks ? 'text-white' : 'text-neutral-500'}`} strokeWidth={2} />
          </div>
          <span className="mt-2 text-xs font-bold text-accent-600">🏆 תעודה!</span>
        </div>
      </div>

      {/* Motivational message */}
      <div className="mt-6 text-center">
        {completedWeeks === totalWeeks ? (
          <p className="text-lg font-bold text-accent-600">🎉 מדהים! השלמת את כל השבועות!</p>
        ) : completedWeeks >= totalWeeks / 2 ? (
          <p className="text-lg font-bold text-primary-600">💪 יופי! עברת את חצי הדרך!</p>
        ) : (
          <p className="text-lg font-bold text-neutral-600">🚀 המשיכי כך, את בדרך הנכונה! עוד 3 שוברים ויש לך הצטיינות</p>
        )}
      </div>
    </div>
  );
}
