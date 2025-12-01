import { ISettings } from '../models/settings.model';
import * as settingsRepository from '../repositories/settings.repository';

// GET - קבלת הגדרות המערכת
export const getSettings = async (): Promise<ISettings | null> => {
  let settings = await settingsRepository.findSettings();
  
  // אם אין הגדרות, יצירת הגדרות ברירת מחדל
  if (!settings) {
    settings = await settingsRepository.createSettings({
      isRedeemOpen: true,
      kioskInfo: '',
      purchaseRules: [],
      maintenanceMode: false
    });
  }
  
  return settings;
};

// PUT - עדכון הגדרות המערכת
export const updateSettings = async (updateData: Partial<ISettings>): Promise<ISettings | null> => {
  // וולידציה על תאריכים
  if (updateData.siteActiveFrom && updateData.siteActiveTo) {
    if (new Date(updateData.siteActiveFrom) > new Date(updateData.siteActiveTo)) {
      throw new Error('Site active from date must be before site active to date');
    }
  }

  const updatedSettings = await settingsRepository.updateSettings(updateData);
  
  if (!updatedSettings) {
    throw new Error('Failed to update settings');
  }

  return updatedSettings;
};

// PUT - פתיחת/סגירת חנות לפדיון
export const toggleRedeemStatus = async (isOpen: boolean): Promise<ISettings | null> => {
  const updatedSettings = await settingsRepository.updateSettings({ isRedeemOpen: isOpen });
  
  if (!updatedSettings) {
    throw new Error('Failed to update redeem status');
  }

  return updatedSettings;
};

// PUT - הפעלת/כיבוי מצב תחזוקה
export const toggleMaintenanceMode = async (isActive: boolean): Promise<ISettings | null> => {
  const updatedSettings = await settingsRepository.updateSettings({ maintenanceMode: isActive });
  
  if (!updatedSettings) {
    throw new Error('Failed to update maintenance mode');
  }

  return updatedSettings;
};

// PUT - עדכון מידע קיוסק
export const updateKioskInfo = async (kioskInfo: string): Promise<ISettings | null> => {
  const updatedSettings = await settingsRepository.updateSettings({ kioskInfo });
  
  if (!updatedSettings) {
    throw new Error('Failed to update kiosk info');
  }

  return updatedSettings;
};

// PUT - עדכון חוקי רכישה
export const updatePurchaseRules = async (rules: string[]): Promise<ISettings | null> => {
  const updatedSettings = await settingsRepository.updateSettings({ purchaseRules: rules });
  
  if (!updatedSettings) {
    throw new Error('Failed to update purchase rules');
  }

  return updatedSettings;
};
