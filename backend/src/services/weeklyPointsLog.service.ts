import { IWeeklyPointsLog } from '../models/weeklyPointsLog.model';
import mongoose from 'mongoose';
import * as weeklyPointsLogRepository from '../repositories/weeklyPointsLog.repository';
import * as userRepository from '../repositories/user.repository';
import * as studentRepository from '../repositories/student.repository';
import * as voucherRepository from '../repositories/voucher.repository';

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
  hasVoucher?: boolean;
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
    hasVoucher: logData.hasVoucher || false,
  });

  // If hasVoucher is true, create voucher and increment count
  if (logData.hasVoucher) {
    await voucherRepository.createVoucher({
      student: new mongoose.Types.ObjectId(logData.student),
      issuedBy: new mongoose.Types.ObjectId(logData.approvedBy),
      status: 'approved',
      approvedBy: new mongoose.Types.ObjectId(logData.approvedBy),
      approvedAt: new Date(),
      order: null,
    });
    await studentRepository.incrementVouchersCount(logData.student, 1);
  }

  return newLog;
};

export const updateWeeklyPointsLog = async (
  logId: string,
  updateData: {
    points?: number;
    hasVoucher?: boolean;
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

  // Handle voucher changes
  if (updateData.hasVoucher !== undefined && updateData.hasVoucher !== existingLog.hasVoucher) {
    const weekEndDate = new Date(existingLog.weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 7);

    if (updateData.hasVoucher === true && !existingLog.hasVoucher) {
      // Teacher now grants voucher - create it
      await voucherRepository.createVoucher({
        student: existingLog.student,
        issuedBy: existingLog.approvedBy,
        status: 'approved',
        approvedBy: existingLog.approvedBy,
        approvedAt: new Date(),
        order: null,
      });
      await studentRepository.incrementVouchersCount(existingLog.student.toString(), 1);
    } else if (updateData.hasVoucher === false && existingLog.hasVoucher) {
      // Teacher revokes voucher - delete it
      const voucher = await voucherRepository.findVoucherByStudentAndWeek(
        existingLog.student.toString(),
        existingLog.weekStartDate,
        weekEndDate
      );
      if (voucher && voucher._id) {
        await voucherRepository.deleteVoucherById(voucher._id.toString());
        await studentRepository.decrementVouchersCount(existingLog.student.toString(), 1);
      }
    }
  }

  const updatedLog = await weeklyPointsLogRepository.updateWeeklyPointsLogById(logId, updateData);

  if (!updatedLog) {
    throw new Error('Weekly points log not found');
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

  // If log has voucher, delete it and decrement count
  if (log.hasVoucher) {
    const weekEndDate = new Date(log.weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 7);

    const voucher = await voucherRepository.findVoucherByStudentAndWeek(
      log.student.toString(),
      log.weekStartDate,
      weekEndDate
    );
    if (voucher && voucher._id) {
      await voucherRepository.deleteVoucherById(voucher._id.toString());
      await studentRepository.decrementVouchersCount(log.student.toString(), 1);
    }
  }

  const deletedLog = await weeklyPointsLogRepository.deleteWeeklyPointsLogById(logId);

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

