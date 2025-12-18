import mongoose from 'mongoose';
import { IUser } from '../models/user.model';
import * as teacherRepository from '../repositories/teacher.repository';

/**
 * קבלת רשימת התלמידים של מורה ספציפי
 * הפונקציה משתמשת ב-repository שכבר עושה populate
 */
export const getTeacherStudents = async (teacherId: string): Promise<IUser[]> => {
  if (!mongoose.Types.ObjectId.isValid(teacherId)) throw new Error('Invalid teacher ID');

  const teacher = await teacherRepository.findTeacherById(teacherId);
  
  if (!teacher) throw new Error('Teacher not found');
  
  // מכיוון שעשינו populate ב-repository, המערך מכיל אובייקטים מלאים
  // ה-casting נדרש כי ב-Mongoose הטיפוסים של populate הם לפעמים מורכבים
  return (teacher.students as unknown as IUser[]) || [];
};

export const addStudentToClass = async (teacherId: string, studentId: string) => {
    // כאן תוסיפי לוגיקה עסקית, למשל: בדיקה אם למורה יש מקום בכיתה
    return await teacherRepository.addStudentToTeacher(teacherId, studentId);
};