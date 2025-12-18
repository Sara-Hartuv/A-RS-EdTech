import mongoose from 'mongoose';
import User, { IUser } from './user.model'; // import base User model

/**
 * Student Interface
 * Inherits from the base IUser
 */
export interface IStudent extends IUser {
  currentVouchersCount?: number;
  currentWeeklyPoints?: number;
  excellenceCertificatesCount?: number;
}

/**
 * Student Schema (Discriminator)
 */
const StudentSchema = new mongoose.Schema<IStudent>(
  {
    currentVouchersCount: { type: Number, default: 0 },
    currentWeeklyPoints: { type: Number, default: 0 },
    excellenceCertificatesCount: { type: Number, default: 0 },
  },
  { _id: false } // do not create a new _id; use the base User's _id
);

/**
 * Student Discriminator Export
 */
const Student = User.discriminator<IStudent>('Student', StudentSchema, 'student');

export default Student;