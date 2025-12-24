import mongoose from 'mongoose';
import { IUser } from '../models/user.model';
import * as userRepository from '../repositories/user.repository';
import * as studentRepository from '../repositories/student.repository';
import * as teacherRepository from '../repositories/teacher.repository';
import * as adminRepository from '../repositories/admin.repository';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.utils';

/**
 * התחברות למערכת
 */
export const login = async (phone: string, password: string): Promise<{ user: IUser; token: string }> => {
  const user = await userRepository.findUserByPhoneWithPassword(phone);

  if (!user) throw new Error('Invalid phone number or password');
  if (!user.status) throw new Error('User account is disabled');

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) throw new Error('Invalid phone number or password');

  // המרת ה-ObjectId למחרוזת עבור הטוקן
  const userId = (user._id as mongoose.Types.ObjectId).toString();
  const token = generateToken(userId, user.role);

  const userObject = user.toObject();
  delete userObject.passwordHash;

  return { user: userObject as IUser, token };
};

/**
 * הרשמה ראשית (מנתבת לרפוזיטורי המתאים לפי התפקיד)
 */
export const register = async (userData: {
  name: string;
  phone: string;
  password: string;
  role: 'teacher' | 'student' | 'admin';
}): Promise<{ user: IUser; token: string }> => {
  
  const existingUser = await userRepository.findUserByPhone(userData.phone);
  if (existingUser) {
    throw new Error('User with this phone number already exists, please login instead');
  }

  const passwordHash = await hashPassword(userData.password);
  let newUser: IUser;

  // יצירת המשתמש ברפוזיטורי המתאים
  switch (userData.role) {
    case 'student':
      newUser = await studentRepository.createStudent({
        name: userData.name,
        phone: userData.phone,
        passwordHash,
        role: 'student',
        status: true,
        // Student-specific field initialization
        currentVouchersCount: 0,
        excellenceCertificatesCount: 0,
      });
      break;

    case 'teacher':
      newUser = await teacherRepository.createTeacher({
        name: userData.name,
        phone: userData.phone,
        passwordHash,
        role: 'teacher',
        status: true,
        // איתחול שדות ספציפיים למורה
        students: []
      });
      break;

    case 'admin':
      newUser = await adminRepository.createAdmin({
        name: userData.name,
        phone: userData.phone,
        passwordHash,
        role: 'admin',
        status: true
      });
      break;

    default:
      throw new Error('Invalid role provided');
  }

  const userId = (newUser._id as mongoose.Types.ObjectId).toString();
  const token = generateToken(userId, newUser.role);

  const userObject = newUser.toObject();
  delete userObject.passwordHash;

  return { user: userObject as IUser, token };
};