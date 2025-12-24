import mongoose, { FilterQuery } from 'mongoose';
import Student, { IStudent } from '../models/student.model';

export const createStudent = async (studentData: Partial<IStudent>): Promise<IStudent> => {
  const newStudent = new Student(studentData);
  return await newStudent.save();
};


export const findStudentById = async (studentId: string): Promise<IStudent | null> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) return null;
  return await Student.findById(studentId).exec();
};


export const findStudentsByQuery = async (query: FilterQuery<IStudent>): Promise<IStudent[]> => {
  return await Student.find(query).exec();
};


export const updateStudentById = async (
  studentId: string,
  updateData: Partial<IStudent>
): Promise<IStudent | null> => {
  return await Student.findByIdAndUpdate(
    studentId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).exec();
};


export const updateStudentVouchers = async (
  studentId: string,
  count: number
): Promise<IStudent | null> => {
  return await Student.findByIdAndUpdate(
    studentId,
    { $inc: { currentVouchersCount: count } },
    { new: true }
  ).exec();
};

export const updateStudentExcellenceVouchers = async (
  studentId: string,
  isIncrement: boolean
): Promise<IStudent | null> => {
  const amount = isIncrement ? 1 : -1;

  return await Student.findByIdAndUpdate(
    studentId,
    { $inc: { currentVouchersCount: amount } }, 
    { new: true, runValidators: true }
  ).exec();
};

export const incrementVouchersCount = async (
  studentId: string,
  amount: number
): Promise<IStudent | null> => {
  return await Student.findByIdAndUpdate(
    studentId,
    { $inc: { currentVouchersCount: amount } },
    { new: true, runValidators: true }
  ).exec();
};

export const decrementVouchersCount = async (
  studentId: string,
  amount: number
): Promise<IStudent | null> => {
  return await Student.findByIdAndUpdate(
    studentId,
    { $inc: { currentVouchersCount: -amount } },
    { new: true, runValidators: true }
  ).exec();
};