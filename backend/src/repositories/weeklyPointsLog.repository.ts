import WeeklyPointsLog, { IWeeklyPointsLog } from '../models/weeklyPointsLog.model';
import mongoose from 'mongoose';

export const findWeeklyPointsLogById = async (logId: string): Promise<IWeeklyPointsLog | null> => {
  return await WeeklyPointsLog.findById(logId)
    .populate('student', 'name phone role')
    .populate('approvedBy', 'name phone role');
};

export const findAllWeeklyPointsLogs = async (): Promise<IWeeklyPointsLog[]> => {
  return await WeeklyPointsLog.find()
    .populate('student', 'name phone role')
    .populate('approvedBy', 'name phone role')
    .sort({ weekStartDate: -1 });
};

export const findWeeklyPointsLogsByQuery = async (query: any): Promise<IWeeklyPointsLog[]> => {
  return await WeeklyPointsLog.find(query)
    .populate('student', 'name phone role')
    .populate('approvedBy', 'name phone role')
    .sort({ weekStartDate: -1 });
};

export const findWeeklyPointsLogsByStudent = async (studentId: string): Promise<IWeeklyPointsLog[]> => {
  return await WeeklyPointsLog.find({ student: studentId })
    .populate('approvedBy', 'name phone role')
    .sort({ weekStartDate: -1 });
};

export const findWeeklyPointsLogByStudentAndWeek = async (
  studentId: string,
  weekStartDate: Date
): Promise<IWeeklyPointsLog | null> => {
  return await WeeklyPointsLog.findOne({ student: studentId, weekStartDate })
    .populate('approvedBy', 'name phone role');
};

export const findWeeklyPointsLogsByApprover = async (approverId: string): Promise<IWeeklyPointsLog[]> => {
  return await WeeklyPointsLog.find({ approvedBy: approverId })
    .populate('student', 'name phone role')
    .sort({ weekStartDate: -1 });
};

export const createWeeklyPointsLog = async (
  logData: Partial<IWeeklyPointsLog>
): Promise<IWeeklyPointsLog> => {
  const newLog = new WeeklyPointsLog(logData);
  return await newLog.save();
};

export const updateWeeklyPointsLogById = async (
  logId: string,
  updateData: Partial<IWeeklyPointsLog>
): Promise<IWeeklyPointsLog | null> => {
  return await WeeklyPointsLog.findByIdAndUpdate(
    logId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('student', 'name phone role')
    .populate('approvedBy', 'name phone role');
};

export const deleteWeeklyPointsLogById = async (logId: string): Promise<IWeeklyPointsLog | null> => {
  return await WeeklyPointsLog.findByIdAndDelete(logId);
};
