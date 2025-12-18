import { IWeeklyPointsLog } from '../models/weeklyPointsLog.model';
import mongoose from 'mongoose';
import * as weeklyPointsLogRepository from '../repositories/weeklyPointsLog.repository';
import * as userRepository from '../repositories/user.repository';
import * as studentRepository from '../repositories/student.repository';

export const getWeeklyPointsLogById = async (logId: string): Promise<IWeeklyPointsLog | null> => {
  if (!mongoose.Types.ObjectId.isValid(logId)) {
    throw new Error('Invalid log ID');
  }

  const log = await weeklyPointsLogRepository.findWeeklyPointsLogById(logId);

  if (!log) {
    throw new Error('Weekly points log not found');
  }

  return log;
};

export const getAllWeeklyPointsLogs = async (): Promise<IWeeklyPointsLog[]> => {
  const logs = await weeklyPointsLogRepository.findAllWeeklyPointsLogs();
  return logs;
};

export const getWeeklyPointsLogsByStudent = async (studentId: string): Promise<IWeeklyPointsLog[]> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  const logs = await weeklyPointsLogRepository.findWeeklyPointsLogsByStudent(studentId);
  return logs;
};

export const getWeeklyPointsLogsByApprover = async (approverId: string): Promise<IWeeklyPointsLog[]> => {
  if (!mongoose.Types.ObjectId.isValid(approverId)) {
    throw new Error('Invalid approver ID');
  }

  const logs = await weeklyPointsLogRepository.findWeeklyPointsLogsByApprover(approverId);
  return logs;
};

export const createWeeklyPointsLog = async (logData: {
  student: string;
  points: number;
  weekStartDate: Date;
  approvedBy: string;
}): Promise<IWeeklyPointsLog> => {
  if (!mongoose.Types.ObjectId.isValid(logData.student)) {
    throw new Error('Invalid student ID');
  }

  if (!mongoose.Types.ObjectId.isValid(logData.approvedBy)) {
    throw new Error('Invalid approver ID');
  }

  if (!logData.points || logData.points < 0) {
    throw new Error('Points must be a positive number');
  }

  if (!logData.weekStartDate) {
    throw new Error('Week start date is required');
  }

  // Verify student exists
  const student = await userRepository.findUserById(logData.student);
  if (!student) {
    throw new Error('Student not found');
  }

  if (student.role !== 'student') {
    throw new Error('Weekly points can only be assigned to students');
  }

  if (!student.status) {
    throw new Error('Cannot create log for inactive student');
  }

  // Verify approver exists
  const approver = await userRepository.findUserById(logData.approvedBy);
  if (!approver) {
    throw new Error('Approver not found');
  }

  if (approver.role !== 'teacher' && approver.role !== 'admin') {
    throw new Error('Only teachers and admins can approve weekly points');
  }

  // Create log
  const newLog = await weeklyPointsLogRepository.createWeeklyPointsLog({
    student: new mongoose.Types.ObjectId(logData.student),
    points: logData.points,
    weekStartDate: logData.weekStartDate,
    approvedBy: new mongoose.Types.ObjectId(logData.approvedBy),
  });

  // Update user's weeklyPoints by adding points
  await studentRepository.updateStudentWeeklyPoints(logData.student, logData.points);

  return newLog;
};

export const updateWeeklyPointsLog = async (
  logId: string,
  updateData: {
    points?: number;
  }
): Promise<IWeeklyPointsLog | null> => {
  if (!mongoose.Types.ObjectId.isValid(logId)) {
    throw new Error('Invalid log ID');
  }

  if (updateData.points !== undefined && updateData.points < 0) {
    throw new Error('Points must be a positive number');
  }

  const existingLog = await weeklyPointsLogRepository.findWeeklyPointsLogById(logId);
  if (!existingLog) throw new Error('Weekly points log not found');

  const oldPoints = existingLog.points;
  const updatedLog = await weeklyPointsLogRepository.updateWeeklyPointsLogById(logId, updateData);

  if (!updatedLog) {
    throw new Error('Weekly points log not found');
  }

  // If points changed, adjust user's weeklyPoints by the difference
  if (updateData.points !== undefined) {
    const delta = (updateData.points || 0) - oldPoints;
    if (delta !== 0) {
      await studentRepository.updateStudentWeeklyPoints(existingLog.student.toString(), delta);
    }
  }

  return updatedLog;
};

export const deleteWeeklyPointsLog = async (logId: string): Promise<IWeeklyPointsLog | null> => {
  if (!mongoose.Types.ObjectId.isValid(logId)) {
    throw new Error('Invalid log ID');
  }

  const log = await weeklyPointsLogRepository.findWeeklyPointsLogById(logId);

  if (!log) {
    throw new Error('Weekly points log not found');
  }

  const deletedLog = await weeklyPointsLogRepository.deleteWeeklyPointsLogById(logId);

  if (deletedLog) {
    // Subtract the points from the student's weeklyPoints
    await studentRepository.updateStudentWeeklyPoints(deletedLog.student.toString(), -deletedLog.points);
  }

  return deletedLog;
};

/**
 * Get the week start date (Sunday) for a given date.
 */
export const getWeekStartDate = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Check if a student has a weekly points log for the current week.
 */
export const hasCurrentWeekPoints = async (studentId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  const weekStartDate = getWeekStartDate();
  const log = await weeklyPointsLogRepository.findWeeklyPointsLogByStudentAndWeek(studentId, weekStartDate);
  return log !== null;
};

/**
 * Get the current week's points for a student if exists.
 */
export const getCurrentWeekPointsForStudent = async (studentId: string): Promise<IWeeklyPointsLog | null> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  const weekStartDate = getWeekStartDate();
  return await weeklyPointsLogRepository.findWeeklyPointsLogByStudentAndWeek(studentId, weekStartDate);
};

