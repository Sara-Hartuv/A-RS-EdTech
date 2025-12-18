import User, { IUser } from '../models/user.model';

export const findUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId);
};

export const findAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};

export const findActiveUsers = async (): Promise<IUser[]> => {
  return await User.find({ status: true }).exec();
};

export const findUserByPhone = async (phone: string): Promise<IUser | null> => {
  return await User.findOne({ phone });
};

export const findUserByPhoneWithPassword = async (phone: string): Promise<IUser | null> => {
  return await User.findOne({ phone }).select('+passwordHash');
};

export const updateUserById = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

export const deleteUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(
    userId,
    { status: false },
    { new: true }
  );
};