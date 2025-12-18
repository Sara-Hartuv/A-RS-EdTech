import { ICertificatePeriod } from '../models/certificatePeriod.model';
import * as certificatePeriodRepository from '../repositories/certificatePeriod.repository';
import mongoose from 'mongoose';

export const createPeriod = async (periodData: {
  name: string;
  startDate: Date;
  endDate: Date;
  maxVouchers?: number;
  requiredForCertificate?: number;
  isActive?: boolean;
}): Promise<ICertificatePeriod> => {
  const { name, startDate, endDate, maxVouchers = 6, requiredForCertificate = 5, isActive = false } = periodData;

  if (startDate >= endDate) {
    throw new Error('endDate must be after startDate');
  }

  // Check overlaps
  const overlaps = await certificatePeriodRepository.findOverlappingPeriods(startDate, endDate);
  if (overlaps.length > 0) {
    throw new Error('Given period overlaps with existing period(s)');
  }

  // If activating this period, ensure no other active period exists
  if (isActive) {
    const active = await certificatePeriodRepository.findActivePeriod();
    if (active) {
      throw new Error('Only one active period is allowed');
    }
  }

  const newPeriod = await certificatePeriodRepository.createPeriod({
    name,
    startDate,
    endDate,
    maxVouchers,
    requiredForCertificate,
    isActive,
  });

  return newPeriod;
};

export const getAllPeriods = async (): Promise<ICertificatePeriod[]> => {
  return await certificatePeriodRepository.findAllPeriods();
};

export const getActivePeriod = async (): Promise<ICertificatePeriod | null> => {
  return await certificatePeriodRepository.findActivePeriod();
};

export const getPeriodById = async (id: string): Promise<ICertificatePeriod | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid period ID');
  }
  const p = await certificatePeriodRepository.findPeriodById(id);
  if (!p) throw new Error('Certificate period not found');
  return p;
};

export const updatePeriod = async (id: string, updateData: Partial<ICertificatePeriod>): Promise<ICertificatePeriod | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid period ID');
  }

  if (updateData.startDate && updateData.endDate && updateData.startDate >= updateData.endDate) {
    throw new Error('endDate must be after startDate');
  }

  // If dates changed, check overlaps
  const existing = await certificatePeriodRepository.findPeriodById(id);
  if (!existing) throw new Error('Certificate period not found');

  const newStart = updateData.startDate || existing.startDate;
  const newEnd = updateData.endDate || existing.endDate;

  const overlaps = await certificatePeriodRepository.findOverlappingPeriods(newStart, newEnd, id);
  if (overlaps.length > 0) {
    throw new Error('Given period overlaps with existing period(s)');
  }

  // If activating, ensure uniqueness
  if (updateData.isActive) {
    const active = await certificatePeriodRepository.findActivePeriod();
    if (active && (active._id as any).toString() !== id) {
      throw new Error('Only one active period is allowed');
    }
  }

  const updated = await certificatePeriodRepository.updatePeriodById(id, updateData);
  return updated;
};

export const deletePeriod = async (id: string): Promise<ICertificatePeriod | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid period ID');
  }

  // Soft delete — deactivate
  const updated = await certificatePeriodRepository.deactivatePeriodById(id);
  return updated;
};

export const findPeriodForDate = async (date: Date) : Promise<ICertificatePeriod | null> => {
  return await certificatePeriodRepository.findPeriodForDate(date);
};
