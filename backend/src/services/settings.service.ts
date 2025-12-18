import { ISettings } from '../models/settings.model';
import * as settingsRepository from '../repositories/settings.repository';

// GET - get system settings
export const getSettings = async (): Promise<ISettings | null> => {
  let settings = await settingsRepository.findSettings();
  
  // If no settings exist, create default settings
  if (!settings) {
    settings = await settingsRepository.createSettings({
      isRedeemOpen: true,
      kioskInfo: '',
      purchaseRules: [],
      pointsPerVoucher: 100
    });
  }
  
  return settings;
};

// PUT - update system settings
export const updateSettings = async (updateData: Partial<ISettings>): Promise<ISettings | null> => {
  // Validate dates
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

// PUT - toggle store open/close for redemption
export const toggleRedeemStatus = async (isOpen: boolean): Promise<ISettings | null> => {
  const updatedSettings = await settingsRepository.updateSettings({ isRedeemOpen: isOpen });
  
  if (!updatedSettings) {
    throw new Error('Failed to update redeem status');
  }

  return updatedSettings;
};

// PUT - update kiosk info
export const updateKioskInfo = async (kioskInfo: string): Promise<ISettings | null> => {
  const updatedSettings = await settingsRepository.updateSettings({ kioskInfo });
  
  if (!updatedSettings) {
    throw new Error('Failed to update kiosk info');
  }

  return updatedSettings;
};

// PUT - update purchase rules
export const updatePurchaseRules = async (rules: string[]): Promise<ISettings | null> => {
  const updatedSettings = await settingsRepository.updateSettings({ purchaseRules: rules });
  
  if (!updatedSettings) {
    throw new Error('Failed to update purchase rules');
  }

  return updatedSettings;
};
