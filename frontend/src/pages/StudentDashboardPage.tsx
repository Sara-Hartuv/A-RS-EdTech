import { useEffect } from 'react';
import useStudentStore from '../store/studentStore';
import StudentHero from '../components/studentDashbord/StudentHero';
import TeacherNote from '../components/studentDashbord/TeacherNote';
import StudentRoadmap from '../components/studentDashbord/StudentRoadmap';

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
    <div className="mt-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 text-center"> מעקב ההתקדמות שלי </h1>

      {/* Top Section: 3 Widget Cards */}
      <StudentHero student={student} />

      {/* Middle Section: Progress Map */}
      <StudentRoadmap history={student.periodHistory} />

      {/* Bottom Section: Teacher Note */}
      <TeacherNote comment={student.teacherComment} />
    </div>
  );
}
