import { Request, Response } from 'express';
import * as userService from '../services/user.services';

// GET - קבלת משתמש לפי ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET - קבלת כל המשתמשים
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET - קבלת משתמשים פעילים
export const getActiveUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getActiveUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST - יצירת משתמש חדש
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = req.body;
    const newUser = await userService.createUser(userData);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT - עדכון משתמש
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedUser = await userService.updateUser(id, updateData);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE - מחיקה רכה (שינוי סטטוס)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedUser = await userService.deleteUser(id);
    res.status(200).json({ message: 'User deactivated successfully', user: deletedUser });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE - מחיקה קשה
export const hardDeleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedUser = await userService.hardDeleteUser(id);
    res.status(200).json({ message: 'User permanently deleted', user: deletedUser });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
