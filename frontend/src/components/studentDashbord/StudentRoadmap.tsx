import { Check, X, Award, MapPin } from 'lucide-react';

type Props = {
  history: Array<boolean | null>;
};

export default function StudentRoadmap({ history }: Props) {
  // Ensure we always have 10 weeks
  const weeksData = history;
  const currentIndex = weeksData.findIndex((v) => v === null);
  const completedWeeks = weeksData.filter((v) => v === true).length;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h3 className="font-bold text-2xl text-slate-800 mb-6 text-center">מפת הדרך לתעודת ההצטיינות</h3>
      
      <div className="mt-6 flex items-center overflow-x-auto py-4 px-2">
        {weeksData.map((weekStatus, i) => {
          const isCurrent = i === currentIndex || (currentIndex === -1 && i === weeksData.length - 1);
          const isLastWeek = i === weeksData.length - 1;

          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center min-w-[72px] relative">
                {/* Current week indicator */}
                {isCurrent && weekStatus !== false && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
                      <MapPin className="w-5 h-5" />
                      <span className="text-xs font-semibold">את כאן</span>
                    </div>
                  </div>
                )}
                
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all ${
                    weekStatus === true
                      ? 'bg-emerald-500 text-white'
                      : weekStatus === false
                      ? 'bg-red-500 text-white'
                      : isCurrent
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-200 scale-110'
                      : 'bg-slate-200 text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {weekStatus === true ? (
                    <Check className="w-7 h-7" strokeWidth={3} />
                  ) : weekStatus === false ? (
                    <X className="w-7 h-7" strokeWidth={3} />
                  ) : (
                    <div className="text-xl font-bold">○</div>
                  )}
                </div>
                
                <div className="mt-2 text-sm font-semibold text-slate-700">שבוע {i + 1}</div>
              </div>

              {/* Connecting line between weeks */}
              {!isLastWeek && (
                <div
                  className={`h-1.5 w-10 mx-1 rounded-full transition-colors ${
                    weekStatus === true ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}

        {/* Line connecting last week to certificate */}
        <div
          className={`h-1.5 w-10 mx-1 rounded-full transition-colors ${
            weeksData[9] === true ? 'bg-emerald-500' : 'bg-slate-200'
          }`}
        />

        {/* Excellence Certificate goal */}
        <div className="flex flex-col items-center min-w-[100px]">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform">
            <Award className="text-white w-11 h-11" strokeWidth={2.5} />
          </div>
          <div className="mt-2 text-sm font-bold text-amber-600 text-center">תעודת<br/>הצטיינות!</div>
        </div>
      </div>

      <p className="mt-6 text-center text-slate-600 font-medium">
        השלמת <span className="font-bold text-emerald-600">{completedWeeks}</span> שבועות מתוך 5
      </p>
    </div>
  );
}
