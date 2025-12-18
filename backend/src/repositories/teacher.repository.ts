import mongoose, { FilterQuery } from 'mongoose';
import Teacher, { ITeacher } from '../models/teacher.model';

export const createTeacher = async (teacherData: Partial<ITeacher>): Promise<ITeacher> => {
  const newTeacher = new Teacher(teacherData);
  return await newTeacher.save();
};

export const findTeacherById = async (teacherId: string): Promise<ITeacher | null> => {
  if (!mongoose.Types.ObjectId.isValid(teacherId)) return null;
  return await Teacher.findById(teacherId).populate('students').exec();
};

export const findTeachersByQuery = async (query: FilterQuery<ITeacher>): Promise<ITeacher[]> => {
  return await Teacher.find(query).populate('students').exec();
};

export const updateTeacherById = async (
  teacherId: string,
  updateData: Partial<ITeacher>
): Promise<ITeacher | null> => {
  return await Teacher.findByIdAndUpdate(
    teacherId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('students').exec();
};

export const addStudentToTeacher = async (
  teacherId: string,
  studentId: string
): Promise<ITeacher | null> => {
  return await Teacher.findByIdAndUpdate(
    teacherId,
    { $addToSet: { students: studentId } },
    { new: true }
  ).populate('students').exec();
};

export const removeStudentFromTeacher = async (
  teacherId: string,
  studentId: string
): Promise<ITeacher | null> => {
  return await Teacher.findByIdAndUpdate(
    teacherId,
    { $pull: { students: studentId } },
    { new: true }
  ).populate('students').exec();
};