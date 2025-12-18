import Settings, { ISettings } from '../models/settings.model';

export const findSettings = async (): Promise<ISettings | null> => {
  return await Settings.findOne();
};

export const createSettings = async (settingsData: Partial<ISettings>): Promise<ISettings> => {
  const newSettings = new Settings(settingsData);
  return await newSettings.save();
};

// Update settings
export const updateSettings = async (updateData: Partial<ISettings>): Promise<ISettings | null> => {
  return await Settings.findOneAndUpdate(
    {},
    { $set: updateData },
    { new: true, runValidators: true, upsert: true }
  );
};

// Delete settings (usually not used)
export const deleteSettings = async (): Promise<ISettings | null> => {
  return await Settings.findOneAndDelete();
};
