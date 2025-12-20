import { motion } from 'framer-motion';
import { User, Zap } from 'lucide-react';
import type { StudentData } from '../store/studentStore';

type Props = { student: StudentData };

export default function StudentHero({ student }: Props) {
  const points = student.weeklyPoints ?? 0;

  return (
    <div className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-amber-200 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center gap-6">
      <div className="flex-1">
        <h2 className="text-2xl font-extrabold text-slate-800">כל הכבוד, {student.name}!</h2>
        <p className="mt-2 text-lg text-slate-700">רכשת {points} נקודות השבוע</p>
        <div className="mt-4 flex items-center gap-3">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-md text-lg">
            המשך כך
          </button>
          <div className="flex items-center gap-2 text-slate-700">
            <Zap className="text-amber-700" />
            <span className="font-medium">נקודות הן כרטיסי התקדמות חזקים!</span>
          </div>
        </div>
      </div>

      <div className="w-40 h-32 relative flex flex-col items-center justify-center">
        <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center shadow-md">
          <User className="text-blue-600" />
        </div>

        {points > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* simple decorative confetti dots */}
            <motion.span
              className="absolute bg-pink-400 w-2 h-2 rounded-full"
              animate={{ y: [-10, -80], x: [0, 30], opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              style={{ left: 6, top: 12 }}
            />
            <motion.span
              className="absolute bg-emerald-500 w-2 h-2 rounded-full"
              animate={{ y: [-10, -60], x: [0, -30], opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              style={{ left: 28, top: 6 }}
            />
            <motion.span
              className="absolute bg-amber-400 w-2 h-2 rounded-full"
              animate={{ y: [-8, -70], x: [0, 10], opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              style={{ left: 52, top: 18 }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
