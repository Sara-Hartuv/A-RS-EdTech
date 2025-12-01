import User, { IUser } from '../models/user.model';
import mongoose from 'mongoose';

// מציאת משתמש לפי ID
export const findUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId).populate('students');
};

// מציאת כל המשתמשים
export const findAllUsers = async (): Promise<IUser[]> => {
  return await User.find().populate('students');
};

// מציאת משתמשים לפי תנאי
export const findUsersByQuery = async (query: any): Promise<IUser[]> => {
  return await User.find(query).populate('students');
};

// יצירת משתמש חדש
export const createNewUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const newUser = new User(userData);
  return await newUser.save();
};

// עדכון משתמש
export const updateUserById = async (
  userId: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('students');
};

// מחיקה פיזית
export const deleteUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(userId);
};

// בדיקת קיום משתמש לפי טלפון
export const findUserByPhone = async (phone: string): Promise<IUser | null> => {
  return await User.findOne({ phone });
};
