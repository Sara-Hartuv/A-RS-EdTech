import { useEffect } from 'react';
import useStudentStore from '../store/studentStore';
import StudentHero from '../components/StudentHero';
import TeacherNote from '../components/TeacherNote';
import StudentRoadmap from '../components/StudentRoadmap';
import WalletBoxes from '../components/WalletBoxes';

export default function StudentDashboardPage() {
  const student = useStudentStore((s) => s.student);
  const fetchStudent = useStudentStore((s) => s.fetchStudent);
  const loading = useStudentStore((s) => s.loading);

  useEffect(() => {
    if (!student) fetchStudent();
  }, [student, fetchStudent]);

  if (loading || !student)
    return <div className="mt-8 text-center text-slate-600">טוען נתונים...</div>;

  return (
    <div className="mt-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800"> התקדמות אישית</h1>

      <StudentHero student={student} />

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <div className="bg-white rounded-xl shadow p-4">
            {student.hasVoucherThisWeek ? (
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-3 rounded-md">
                  <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3 7h7l-5.6 4.1L20 22l-8-5-8 5 3.6-8.9L2 9h7l3-7z" fill="#10B981" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-slate-500">שובר השבוע</div>
                  <div className="text-lg font-bold text-emerald-700">קיבלת שובר!!! 🎉</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 opacity-90">
                <div className="bg-slate-100 p-3 rounded-md grayscale">
                  <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3 7h7l-5.6 4.1L20 22l-8-5-8 5 3.6-8.9L2 9h7l3-7z" fill="#94A3B8" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-slate-500">שובר השבוע</div>
                  <div className="text-lg font-bold text-slate-500">לא הפעם, אבל תמשיכי לנסות!</div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <TeacherNote comment={student.teacherComment} />
          </div>
        </div>

        <div className="md:col-span-2">
          <StudentRoadmap history={student.periodHistory} />
        </div>
      </div>

      <WalletBoxes certificates={student.totalCertificates} vouchers={student.vouchersAvailable} />
    </div>
  );
}
