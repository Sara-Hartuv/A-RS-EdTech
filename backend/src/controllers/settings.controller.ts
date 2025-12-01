import { Request, Response } from 'express';
import * as settingsService from '../services/settings.service';

// GET - קבלת הגדרות המערכת
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await settingsService.getSettings();
    res.status(200).json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT - עדכון הגדרות המערכת
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData = req.body;
    const updatedSettings = await settingsService.updateSettings(updateData);
    res.status(200).json(updatedSettings);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT - פתיחת/סגירת חנות לפדיון
export const toggleRedeemStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isOpen } = req.body;
    const updatedSettings = await settingsService.toggleRedeemStatus(isOpen);
    res.status(200).json(updatedSettings);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT - הפעלת/כיבוי מצב תחזוקה
export const toggleMaintenanceMode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isActive } = req.body;
    const updatedSettings = await settingsService.toggleMaintenanceMode(isActive);
    res.status(200).json(updatedSettings);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT - עדכון מידע קיוסק
export const updateKioskInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { kioskInfo } = req.body;
    const updatedSettings = await settingsService.updateKioskInfo(kioskInfo);
    res.status(200).json(updatedSettings);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT - עדכון חוקי רכישה
export const updatePurchaseRules = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rules } = req.body;
    const updatedSettings = await settingsService.updatePurchaseRules(rules);
    res.status(200).json(updatedSettings);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
