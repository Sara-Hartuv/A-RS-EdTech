import mongoose from 'mongoose';
import User, { IUser } from './user.model'; // import base User model

/**
 * Teacher Interface
 * Inherits from the base IUser
 */
export interface ITeacher extends IUser {
  students?: mongoose.Types.ObjectId[];
}

/**
 * Teacher Schema (Discriminator)
 */
const TeacherSchema = new mongoose.Schema<ITeacher>(
  {
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // reference the base 'User' model
      }
    ]
  },
  { _id: false }
);

/**
 * Teacher Discriminator Export
 */
const Teacher = User.discriminator<ITeacher>('Teacher', TeacherSchema, 'teacher');

export default Teacher;