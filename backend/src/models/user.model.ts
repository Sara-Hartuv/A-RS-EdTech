import mongoose, { Document } from 'mongoose';

/**
 * Interfaces
 */
export interface IUser extends Document {
  name: string;
  phone: string;
  passwordHash: string;
  role: 'teacher' | 'student' | 'admin';
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Base schema options: single collection 'users' and discriminator key 'role'
const baseOptions = { 
  discriminatorKey: 'role', 
  collection: 'users', 
  timestamps: true 
} as any;

/**
 * Schema Definition
 */
const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['teacher', 'student', 'admin'], required: true },
    status: { type: Boolean, default: true }
  },
  baseOptions
);

UserSchema.index({ role: 1, status: 1 });

/**
 * Base Model Export
 */
const User = mongoose.model<IUser>('User', UserSchema);

export default User;