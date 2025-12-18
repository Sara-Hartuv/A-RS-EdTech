import mongoose from 'mongoose';
import { IUser } from '../models/user.model';
import * as userRepository from '../repositories/user.repository';
import { hashPassword } from '../utils/auth.utils';

export const getUserById = async (userId: string): Promise<IUser> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error('Invalid user ID');
  
  const user = await userRepository.findUserById(userId);
  if (!user) throw new Error('User not found');
  
  return user;
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return await userRepository.findAllUsers();
};

// src/services/user.service.ts

export const getActiveUsers = async (): Promise<IUser[]> => {
  return await userRepository.findActiveUsers();
};



/**
 * יצירת משתמש אדמיניסטרטיבית (למשל דרך דשבורד מנהל)
 * הערה: זה די דומה ל-register, אבל מחזיר רק את המשתמש בלי טוקן
 */
export const createUserByAdmin = async (userData: any): Promise<IUser> => {
   // כאן אפשר להשתמש בפונקציית ה-register מה-auth service 
   // או לשכפל את הלוגיקה אם רוצים התנהגות שונה
   // לצורך הפשטות, מומלץ לקרוא ל-authService.register
   throw new Error("Use authService.register instead"); 
};

export const updateUser = async (
  userId: string,
  updateData: Partial<IUser> & { password?: string } // מאפשרים לקבל סיסמה כטקסט
): Promise<IUser> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error('Invalid user ID');

  // מונעים עדכון ישיר של ה-Hash מבחוץ
  if ('passwordHash' in updateData) {
    delete updateData.passwordHash;
  }

  // אם התקבלה סיסמה חדשה, מצפינים אותה ושמים בשדה הנכון
  if (updateData.password) {
    updateData.passwordHash = await hashPassword(updateData.password);
    delete updateData.password; // מוחקים את הסיסמה הגלויה
  }

  // בדיקה שאין כפילות טלפון במקרה של עדכון טלפון
  if (updateData.phone) {
    const existingUser = await userRepository.findUserByPhone(updateData.phone);
    // מוודאים שזה לא אותו משתמש שאנחנו מעדכנים כרגע
    if (existingUser && existingUser.id !== userId) {
      throw new Error('Phone number already in use by another user');
    }
  }

  const updatedUser = await userRepository.updateUserById(userId, updateData);
  if (!updatedUser) throw new Error('User not found');

  return updatedUser;
};

export const deleteUser = async (userId: string): Promise<IUser> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error('Invalid user ID');

  const deletedUser = await userRepository.deleteUserById(userId);
  if (!deletedUser) throw new Error('User not found');

  return deletedUser;
};