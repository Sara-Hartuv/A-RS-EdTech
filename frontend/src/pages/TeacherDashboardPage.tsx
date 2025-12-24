// src/pages/TeacherDashboardPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import * as teacherApi from '../api/teacher.api';
import type { Student, WeeklyPointsLog, Voucher } from '../types/teacher';
import StudentCard from '../components/teacher/StudentCard';
import WeeklyPointsModal from '../components/teacher/WeeklyPointsModal';

interface StudentData {
  student: Student;
  hasCurrentWeekPoints: boolean;
  currentWeekPoints: WeeklyPointsLog | null;
  unredeemedVouchersCount: number;
  lastVoucher: Voucher | null;
}

export default function TeacherDashboardPage() {
  const { user } = useAuthStore();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingLog, setExistingLog] = useState<WeeklyPointsLog | null>(null);

  // Format today's date using the Hebrew calendar with Hebrew numerals
  const numberToHebrew = (n: number): string => {
    if (n === 0) return '';
    const units: Record<number, string> = {
      1: 'א', 2: 'ב', 3: 'ג', 4: 'ד', 5: 'ה', 6: 'ו', 7: 'ז', 8: 'ח', 9: 'ט',
    };
    const tens: Record<number, string> = {
      10: 'י', 20: 'כ', 30: 'ל', 40: 'מ', 50: 'נ', 60: 'ס', 70: 'ע', 80: 'פ', 90: 'צ',
    };
    const hundredsMap: Record<number, string> = {
      100: 'ק', 200: 'ר', 300: 'ש', 400: 'ת',
    };

    let result = '';
    // thousands as repeated ת (rare for our year handling but keep generic)
    while (n >= 400) {
      result += 'ת';
      n -= 400;
    }

    if (n >= 100) {
      const h = Math.floor(n / 100) * 100;
      if (hundredsMap[h]) {
        result += hundredsMap[h];
        n -= h;
      }
    }

    // special handling for 15 and 16 to avoid
    if (n === 15) return result + 'טו';
    if (n === 16) return result + 'טז';

    if (n >= 10) {
      const t = Math.floor(n / 10) * 10;
      if (t && tens[t]) {
        result += tens[t];
        n -= t;
      }
    }

    if (n > 0) {
      result += units[n];
    }

    return result;
  };

  const addHebrewPunctuation = (hebrewLetters: string): string => {
    if (!hebrewLetters) return '';
    const GERESH = '\u05F3';
    const GERSHAYIM = '\u05F4';
    if (hebrewLetters.length === 1) return hebrewLetters + GERESH;
    return hebrewLetters.slice(0, -1) + GERSHAYIM + hebrewLetters.slice(-1);
  };

  const formatHebrewDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    // Use Intl to get Hebrew weekday and month names (Hebrew calendar)
    let weekday = '';
    let month = '';
    let dayNum = 0;
    let yearNum = 0;

    try {
      const parts = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', options).formatToParts(date);
      for (const p of parts) {
        if (p.type === 'weekday') weekday = p.value;
        if (p.type === 'day') dayNum = Number(p.value);
        if (p.type === 'month') month = p.value.replace(/^ב?/, ''); // strip leading ב if present
        if (p.type === 'year') yearNum = Number(p.value);
      }
    } catch {
      // fallback to simpler formatting
      weekday = date.toLocaleDateString('he-IL', { weekday: 'long' });
      month = date.toLocaleDateString('he-IL', { month: 'long' });
      dayNum = Number(date.toLocaleDateString('en-US', { day: 'numeric' }));
      yearNum = Number(new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { year: 'numeric' }).format(date));
    }

    // Convert day and year into Hebrew letters
    const hebDayLetters = numberToHebrew(dayNum);
    const hebDay = addHebrewPunctuation(hebDayLetters);

    // Hebrew year usually omits the thousands (5000), so subtract 5000 when present
    let shortYear = yearNum;
    if (yearNum > 1000) shortYear = yearNum - 5000;
    const hebYearLetters = numberToHebrew(shortYear);
    const hebYear = addHebrewPunctuation(hebYearLetters);

    // Compose: "יום ... , כ"ד בכסלו, תשפ"ו"
    return `${weekday}, ${hebDay} ב${month}, ${hebYear}`;
  };

  const todayHebrew = formatHebrewDate(new Date());
  const gregorianOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const todayGregorian = new Intl.DateTimeFormat('he-IL', gregorianOptions).format(new Date());
  const today = `${todayHebrew} (${todayGregorian})`;

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get teacher's students
      const studentsRes = await teacherApi.getMyStudents();
      const studentsList = studentsRes.data;

      // For each student, fetch their current week points and vouchers
      const studentsData = await Promise.all(
        studentsList.map(async (student) => {
          try {
            const [weekPointsRes, vouchersRes] = await Promise.all([
              teacherApi.getCurrentWeekPoints(student._id),
              teacherApi.getUnredeemedVouchers(student._id),
            ]);

            return {
              student,
              hasCurrentWeekPoints: weekPointsRes.data !== null,
              currentWeekPoints: weekPointsRes.data,
              unredeemedVouchersCount: vouchersRes.data.length,
              lastVoucher: vouchersRes.data[0] || null,
            };
          } catch {
            // If there's an error fetching student data, return defaults
            return {
              student,
              hasCurrentWeekPoints: false,
              currentWeekPoints: null,
              unredeemedVouchersCount: 0,
              lastVoucher: null,
            };
          }
        })
      );

      setStudents(studentsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle opening weekly points modal
  const handleOpenWeeklyPointsModal = (studentData: StudentData) => {
    setSelectedStudent(studentData.student);
    setExistingLog(studentData.currentWeekPoints);
    setIsModalOpen(true);
  };

  // Handle weekly points submission
  const handleWeeklyPointsSubmit = async (points: number, hasVoucher: boolean) => {
    if (!selectedStudent) return;

    try {
      if (existingLog) {
        // Update existing log
        await teacherApi.updateWeeklyPointsLog(existingLog._id, { points, hasVoucher });
      } else {
        // Create new log
        const weekStartDate = getWeekStartDate();
        await teacherApi.createWeeklyPointsLog({
          student: selectedStudent._id,
          points,
          weekStartDate: weekStartDate.toISOString(),
          hasVoucher,
        });
      }

      setIsModalOpen(false);
      setSelectedStudent(null);
      setExistingLog(null);
      fetchData(); // Refresh data
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save weekly points');
    }
  };

  // Handle voucher toggle
  const handleVoucherToggle = async (studentData: StudentData) => {
    try {
      if (studentData.unredeemedVouchersCount > 0 && studentData.lastVoucher) {
        // Remove voucher
        await teacherApi.deleteVoucher(studentData.lastVoucher._id);
      } else {
        // Issue voucher
        await teacherApi.issueVoucher(studentData.student._id);
      }
      fetchData(); // Refresh data
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update voucher');
    }
  };

  // Get week start date (Sunday)
  const getWeekStartDate = (): Date => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day;
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  if (isLoading) {
    return (
      <div className="mt-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">שלום, {user?.name || 'מורה'}</h1>
            <p className="text-blue-100 mt-1">{today}</p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-2xl font-bold">{students.length}</span>
            <span className="text-blue-100">תלמידות</span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-slate-500">תלמידות ללא ניקוד השבוע</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {students.filter((s) => !s.hasCurrentWeekPoints).length}
          </p>
          <p className="text-xs text-slate-400 mt-1">ממתינות להכנסת ניקוד</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-slate-500">תלמידות עם שובר</p>
          <p className="text-3xl font-bold text-emerald-700 mt-2">
            {students.filter((s) => s.unredeemedVouchersCount > 0).length}
          </p>
          <p className="text-xs text-slate-400 mt-1">יש להן שובר זמין</p>
        </div>
      </div>

      {/* Students List */}
      {students.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-slate-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">אין תלמידות משויכות</h3>
          <p className="text-slate-500">פנו למנהלת המערכת כדי לשייך תלמידות לחשבון שלכם</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="border-b border-slate-100 p-4">
            <h2 className="font-semibold text-slate-800">התלמידות שלי</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {students.map((studentData) => (
              <StudentCard
                key={studentData.student._id}
                studentData={studentData}
                onOpenWeeklyPoints={() => handleOpenWeeklyPointsModal(studentData)}
                onToggleVoucher={() => handleVoucherToggle(studentData)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Weekly Points Modal */}
      <WeeklyPointsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
          setExistingLog(null);
        }}
        onSubmit={handleWeeklyPointsSubmit}
        studentName={selectedStudent?.name || ''}
        existingPoints={existingLog?.points}
        existingHasVoucher={existingLog?.hasVoucher}
      />
    </div>
  );
}
