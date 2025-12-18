import CertificatePeriod, { ICertificatePeriod } from '../models/certificatePeriod.model';
import mongoose from 'mongoose';

export const createPeriod = async (periodData: Partial<ICertificatePeriod>): Promise<ICertificatePeriod> => {
  const p = new CertificatePeriod(periodData);
  return await p.save();
};

export const findAllPeriods = async (): Promise<ICertificatePeriod[]> => {
  return await CertificatePeriod.find().sort({ startDate: -1 });
};

export const findPeriodById = async (id: string): Promise<ICertificatePeriod | null> => {
  return await CertificatePeriod.findById(id);
};

export const findActivePeriod = async (): Promise<ICertificatePeriod | null> => {
  return await CertificatePeriod.findOne({ isActive: true });
};

export const findPeriodForDate = async (date: Date): Promise<ICertificatePeriod | null> => {
  return await CertificatePeriod.findOne({ startDate: { $lte: date }, endDate: { $gte: date } });
};

export const findOverlappingPeriods = async (startDate: Date, endDate: Date, excludeId?: string): Promise<ICertificatePeriod[]> => {
  const query: any = {
    $or: [
      { startDate: { $lte: endDate, $gte: startDate } },
      { endDate: { $lte: endDate, $gte: startDate } },
      { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
    ]
  };

  if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
    query._id = { $ne: excludeId };
  }

  return await CertificatePeriod.find(query);
};

export const updatePeriodById = async (id: string, updateData: Partial<ICertificatePeriod>): Promise<ICertificatePeriod | null> => {
  return await CertificatePeriod.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
};

export const deactivatePeriodById = async (id: string): Promise<ICertificatePeriod | null> => {
  return await CertificatePeriod.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
};


