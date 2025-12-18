import { Request, Response } from 'express';
import * as teacherService from '../services/teacher.service';

export const getMyStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // קריאה לשירות הייעודי למורים
    const students = await teacherService.getTeacherStudents(req.user.userId);
    res.status(200).json(students);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const addStudentToClass = async (req: Request, res: Response): Promise<void> => {
  try {
      if (!req.user || !req.user.userId) {
          res.status(401).json({ message: 'Not authenticated' });
          return;
      }

      const { studentId } = req.body;
      const result = await teacherService.addStudentToClass(req.user.userId, studentId);
      
      res.status(200).json(result);
  } catch (error: any) {
      res.status(400).json({ message: error.message });
  }
};