import { useEffect } from 'react';
import useStudentStore from '../store/studentStore';
import StudentHero from '../components/studentDashbord/StudentHero';
import TeacherNote from '../components/studentDashbord/TeacherNote';
import StudentRoadmap from '../components/studentDashbord/StudentRoadmap';
import { Sparkles } from 'lucide-react';

export default function StudentDashboardPage() {
  const student = useStudentStore((s) => s.student);
  const fetchStudent = useStudentStore((s) => s.fetchStudent);
  const loading = useStudentStore((s) => s.loading);

  useEffect(() => {
    if (!student) fetchStudent();
  }, [student, fetchStudent]);

  if (loading || !student)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-primary-500" />
          </div>
          <p className="text-neutral-500 text-lg">טוען את הדשבורד שלך...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-primary-50/30">
      <div className="py-8 px-4 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
            שלום, {student.name || 'תלמידה'}! ✨
          </h1>
          <p className="text-neutral-500 mt-2">בואי נראה איך עבר השבוע</p>
        </div>

        {/* Stats Cards */}
        <StudentHero student={student} />

        {/* Progress Journey */}
        <StudentRoadmap history={student.periodHistory} />

        {/* Teacher Message */}
        <TeacherNote comment={student.teacherComment} />
      </div>
    </div>
  );
}
