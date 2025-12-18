// src/components/teacher/WeeklyPointsModal.tsx
import { useState, useEffect } from 'react';

interface WeeklyPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (points: number) => Promise<void>;
  studentName: string;
  existingPoints?: number;
}

export default function WeeklyPointsModal({
  isOpen,
  onClose,
  onSubmit,
  studentName,
  existingPoints,
}: WeeklyPointsModalProps) {
  const [points, setPoints] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset points when modal opens with existing points
  useEffect(() => {
    if (isOpen) {
      setPoints(existingPoints !== undefined ? existingPoints.toString() : '');
    }
  }, [isOpen, existingPoints]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const pointsNumber = parseInt(points, 10);
    if (isNaN(pointsNumber) || pointsNumber < 0) {
      alert('נא להזין מספר נקודות תקין');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(pointsNumber);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-l from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {existingPoints !== undefined ? 'עריכת ניקוד שבועי' : 'הכנסת ניקוד שבועי'}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1">{studentName}</p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="points" className="block text-sm font-medium text-slate-700 mb-2">
              מספר הנקודות
            </label>
            <input
              type="number"
              id="points"
              min="0"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center font-semibold"
              placeholder="הזיני מספר נקודות"
              autoFocus
              required
            />
          </div>

          {/* Quick Points Buttons */}
          <div className="mb-6">
            <p className="text-xs text-slate-500 mb-2">בחירה מהירה:</p>
            <div className="flex flex-wrap gap-2">
              {[150,200,250,300,350,400].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPoints(num.toString())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    points === num.toString()
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              disabled={isSubmitting}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  שומר...
                </span>
              ) : (
                'שמירה'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
