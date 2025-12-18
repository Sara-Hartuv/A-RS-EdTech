import { Request, Response } from 'express';
import * as studentService from '../services/student.service';

// קבלת פרופיל תלמיד מורחב (כולל נקודות וכו')
export const getStudentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);
    res.status(200).json(student);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

// הוספת נקודות לתלמיד (לשימוש ע"י מורים/אדמין)
export const addPoints = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Student ID
    const { points } = req.body;

    if (typeof points !== 'number') {
        res.status(400).json({ message: 'Points must be a number' });
        return;
    }

    const updatedStudent = await studentService.addWeeklyPoints(id, points);
    res.status(200).json(updatedStudent);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// הוספת שוברים
export const addVouchers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { count } = req.body;

    const updatedStudent = await studentService.addVouchers(id, count);
    res.status(200).json(updatedStudent);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};