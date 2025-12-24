import mongoose from 'mongoose';
import { IStudent } from '../models/student.model';
import * as studentRepository from '../repositories/student.repository';

/**
 * קבלת פרופיל תלמיד מלא
 * משמש להצגת דף הבית של התלמיד או צפייה של מורה בתלמיד
 */
export const getStudentById = async (studentId: string): Promise<IStudent> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  const student = await studentRepository.findStudentById(studentId);

  if (!student) {
    throw new Error('Student not found');
  }

  return student;
};

/**
 * שליפת כל התלמידים (לדוגמה עבור טבלה בדשבורד מנהל)
 */
export const getAllStudents = async (): Promise<IStudent[]> => {
  return await studentRepository.findStudentsByQuery({});
};

/**
 * מציאת תלמידים לפי כיתה או קבוצה (אופציונלי - דורש שיהיה שדה כזה בעתיד)
 */
export const getStudentsByFilter = async (filter: any): Promise<IStudent[]> => {
  return await studentRepository.findStudentsByQuery(filter);
};

/**
 * הוספת נקודות שבועיות לתלמיד
 * זוהי פעולה עסקית מובהקת (Business Logic)
 */
export const addWeeklyPoints = async (studentId: string, points: number): Promise<IStudent> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  // This function is deprecated - weekly points are no longer stored on student
  // Points are tracked through WeeklyPointsLog only
  
  const student = await studentRepository.findStudentById(studentId);

  if (!student) {
    throw new Error('Student not found or update failed');
  }

  return student;
};

/**
 * הענקת שוברים (Vouchers) לתלמיד
 */
export const addVouchers = async (studentId: string, count: number): Promise<IStudent> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  if (count < 0) {
    throw new Error('Cannot add negative vouchers count');
  }

  const updatedStudent = await studentRepository.updateStudentVouchers(studentId, count);

  if (!updatedStudent) {
    throw new Error('Student not found');
  }

  return updatedStudent;
};

/**
 * עדכון תעודות הצטיינות
 */
export const addExcellenceCertificate = async (studentId: string): Promise<IStudent> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  // הוספת תעודה אחת
  const updatedStudent = await studentRepository.updateStudentExcellenceVouchers(studentId, true);

  if (!updatedStudent) {
    throw new Error('Student not found');
  }

  return updatedStudent;
};