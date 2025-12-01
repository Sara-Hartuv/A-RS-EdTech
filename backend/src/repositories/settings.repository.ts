import Settings, { ISettings } from '../models/settings.model';

export const findSettings = async (): Promise<ISettings | null> => {
  return await Settings.findOne();
};

export const createSettings = async (settingsData: Partial<ISettings>): Promise<ISettings> => {
  const newSettings = new Settings(settingsData);
  return await newSettings.save();
};

// עדכון הגדרות
export const updateSettings = async (updateData: Partial<ISettings>): Promise<ISettings | null> => {
  return await Settings.findOneAndUpdate(
    {},
    { $set: updateData },
    { new: true, runValidators: true, upsert: true }
  );
};

// מחיקת הגדרות (בדרך כלל לא נעשה שימוש)
export const deleteSettings = async (): Promise<ISettings | null> => {
  return await Settings.findOneAndDelete();
};
