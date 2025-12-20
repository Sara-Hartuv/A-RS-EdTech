import { Check, X, Award } from 'lucide-react';

type Props = {
  history: Array<boolean | null>;
};

export default function StudentRoadmap({ history }: Props) {
  const currentIndex = history.findIndex((v) => v === null);
  const remaining = history.filter((v) => v === true).length;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-bold text-lg text-slate-800">המסלול שלך</h3>
      <div className="mt-4 flex items-center gap-4 overflow-x-auto py-2">
        {history.map((h, i) => {
          const isCurrent = i === currentIndex || (currentIndex === -1 && i === history.length - 1);
          return (
            <div key={i} className="flex flex-col items-center min-w-[68px]">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md ${
                  h === true
                    ? 'bg-emerald-500 text-white'
                    : h === false
                    ? 'bg-red-500 text-white'
                    : isCurrent
                    ? 'bg-amber-400 text-white ring-4 ring-amber-200 animate-pulse'
                    : 'bg-transparent border border-slate-200 text-slate-400'
                }`}
              >
                {h === true ? <Check /> : h === false ? <X /> : <div className="text-sm">שבוע</div>}
              </div>
              <div className="mt-2 text-xs text-slate-600">ש{i + 1}</div>
            </div>
          );
        })}

        <div className="flex flex-col items-center min-w-[88px]">
          <div className="w-16 h-16 rounded-xl bg-amber-100 flex items-center justify-center shadow">
            <Award className="text-amber-600" />
          </div>
          <div className="mt-2 text-sm font-medium text-slate-700">תעודת הצטיינות</div>
        </div>
      </div>

      <p className="mt-4 text-slate-700">רק עוד {Math.max(0, 6 - remaining)} שוברים עד התעודה!</p>
    </div>
  );
}
