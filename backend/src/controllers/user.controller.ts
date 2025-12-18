import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // מניחים שיש Middleware ששם את המשתמש ב-req.user
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const user = await userService.getUserById(req.user.userId);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getActiveUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// פונקציה ליצירת משתמש ע"י אדמין (לא הרשמה עצמית)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // הערה: בגלל הפיצול, מומלץ להשתמש ב-authService.register גם כאן,
    // או לממש פונקציה ייעודית ב-userService אם הלוגיקה שונה.
    // לצורך הדוגמה נניח שזה קיים ב-userService כפי שהיה במקור:
    const newUser = await userService.createUserByAdmin(req.body); 
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // מניעת עדכון סיסמה מוצפנת ישירות (Security best practice)
    if ('passwordHash' in updateData) {
      delete updateData.passwordHash;
    }
    
    const updatedUser = await userService.updateUser(id, updateData);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.status(200).json({ message: 'User deactivated', user: result });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};