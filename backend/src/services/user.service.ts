import { IUser } from '../models/user.model';
import mongoose from 'mongoose';
import * as userRepository from '../repositories/user.repository';

// GET - קבלת משתמש לפי ID
export const getUserById = async (userId: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  
  const user = await userRepository.findUserById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

// GET - קבלת כל המשתמשים
export const getAllUsers = async (): Promise<IUser[]> => {
  const users = await userRepository.findAllUsers();
  return users;
};

// GET - קבלת משתמשים פעילים בלבד
export const getActiveUsers = async (): Promise<IUser[]> => {
  const users = await userRepository.findUsersByQuery({ status: true });
  return users;
};

// POST - יצירת משתמש חדש
export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  // בדיקת קיום משתמש עם אותו מספר טלפון
  const existingUser = await userRepository.findUserByPhone(userData.phone!);
  
  if (existingUser) {
    throw new Error('User with this phone number already exists');
  }

  // וולידציה על השדות הנדרשים
  if (!userData.name || !userData.phone || !userData.passwordHash || !userData.role) {
    throw new Error('Missing required fields');
  }

  const newUser = await userRepository.createNewUser(userData);
  return newUser;
};

// PUT - עדכון משתמש לפי ID
export const updateUser = async (
  userId: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  // אם מעדכנים טלפון, לוודא שהוא לא קיים אצל משתמש אחר
  if (updateData.phone) {
    const existingUser = await userRepository.findUserByPhone(updateData.phone);
    if (existingUser && existingUser.id !== userId) {
      throw new Error('Phone number already in use by another user');
    }
  }

  const updatedUser = await userRepository.updateUserById(userId, updateData);
  
  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
};

// DELETE - מחיקה רכה (שינוי סטטוס ללא פעיל)
export const deleteUser = async (userId: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const deletedUser = await userRepository.updateUserById(userId, { status: false });
  
  if (!deletedUser) {
    throw new Error('User not found');
  }

  return deletedUser;
};

// DELETE - מחיקה קשה (מחיקה פיזית מהDB)
export const hardDeleteUser = async (userId: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const deletedUser = await userRepository.deleteUserById(userId);
  
  if (!deletedUser) {
    throw new Error('User not found');
  }

  return deletedUser;
};


