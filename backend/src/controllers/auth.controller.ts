import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({ message: 'Phone and password are required' });
      return;
    }

    const result = await authService.login(phone, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // כאן אנחנו מצפים לקבל את ה-role מה-body
    const { name, phone, password, role } = req.body;

    if (!name || !phone || !password || !role) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const result = await authService.register({ name, phone, password, role });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * פונקציות נוחות (Wrappers) אם את רוצה endpoints נפרדים ב-API
 * למשל: POST /auth/register-student
 */
export const registerStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) {
       res.status(400).json({ message: 'Missing fields' });
       return;
    }
    // קוראים לשירות הכללי אבל קובעים את התפקיד ידנית
    const result = await authService.register({ name, phone, password, role: 'student' });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const registerTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) {
       res.status(400).json({ message: 'Missing fields' });
       return;
    }
    const result = await authService.register({ name, phone, password, role: 'teacher' });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};