import { Request, Response } from 'express';
import * as weeklyPointsLogService from '../services/weeklyPointsLog.service';

export const getWeeklyPointsLogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const log = await weeklyPointsLogService.getWeeklyPointsLogById(id);
    res.status(200).json(log);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllWeeklyPointsLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await weeklyPointsLogService.getAllWeeklyPointsLogs();
    res.status(200).json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getWeeklyPointsLogsByStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const logs = await weeklyPointsLogService.getWeeklyPointsLogsByStudent(studentId);
    res.status(200).json(logs);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyWeeklyPointsLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const logs = await weeklyPointsLogService.getWeeklyPointsLogsByStudent(req.user.userId);
    res.status(200).json(logs);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getWeeklyPointsLogsByApprover = async (req: Request, res: Response): Promise<void> => {
  try {
    const { approverId } = req.params;
    const logs = await weeklyPointsLogService.getWeeklyPointsLogsByApprover(approverId);
    res.status(200).json(logs);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createWeeklyPointsLog = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { student, points, weekStartDate, hasVoucher } = req.body;

    if (!student || points === undefined || !weekStartDate) {
      res.status(400).json({ message: 'Student, points, and week start date are required' });
      return;
    }

    const logData = {
      student,
      points,
      weekStartDate: new Date(weekStartDate),
      approvedBy: req.user.userId,
      hasVoucher: hasVoucher || false,
    };

    const newLog = await weeklyPointsLogService.createWeeklyPointsLog(logData);
    res.status(201).json(newLog);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateWeeklyPointsLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { points, hasVoucher } = req.body;

    const updateData: { points?: number; hasVoucher?: boolean } = {};
    if (points !== undefined) updateData.points = points;
    if (hasVoucher !== undefined) updateData.hasVoucher = hasVoucher;

    const updatedLog = await weeklyPointsLogService.updateWeeklyPointsLog(id, updateData);
    res.status(200).json(updatedLog);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteWeeklyPointsLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedLog = await weeklyPointsLogService.deleteWeeklyPointsLog(id);
    res.status(200).json({ message: 'Weekly points log deleted successfully', log: deletedLog });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getCurrentWeekPointsForStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const log = await weeklyPointsLogService.getCurrentWeekPointsForStudent(studentId);
    res.status(200).json(log);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const hasCurrentWeekPoints = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const hasPoints = await weeklyPointsLogService.hasCurrentWeekPoints(studentId);
    res.status(200).json({ hasPoints });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
