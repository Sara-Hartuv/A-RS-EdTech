import { Request, Response } from 'express';
import * as certificatePeriodService from '../services/certificatePeriod.service';

export const createPeriod = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, startDate, endDate, maxVouchers, requiredForCertificate, isActive } = req.body;

    const newPeriod = await certificatePeriodService.createPeriod({
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      maxVouchers,
      requiredForCertificate,
      isActive,
    });

    res.status(201).json(newPeriod);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllPeriods = async (req: Request, res: Response): Promise<void> => {
  try {
    const periods = await certificatePeriodService.getAllPeriods();
    res.status(200).json(periods);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivePeriod = async (req: Request, res: Response): Promise<void> => {
  try {
    const period = await certificatePeriodService.getActivePeriod();
    res.status(200).json(period);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPeriodById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const period = await certificatePeriodService.getPeriodById(id);
    res.status(200).json(period);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePeriod = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const updated = await certificatePeriodService.updatePeriod(id, updateData);
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePeriod = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await certificatePeriodService.deletePeriod(id);
    res.status(200).json({ message: 'Period deactivated', period: deleted });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
