import Voucher, { IVoucher } from '../models/voucher.model';
import mongoose from 'mongoose';

export const findVoucherById = async (voucherId: string): Promise<IVoucher | null> => {
  return await Voucher.findById(voucherId)
    .populate('student', 'name phone role')
    .populate('issuedBy', 'name phone role')
    .populate('order')
    .populate('period')
    .populate('approvedBy', 'name phone role');
};

export const findAllVouchers = async (): Promise<IVoucher[]> => {
  return await Voucher.find()
    .populate('student', 'name phone role')
    .populate('issuedBy', 'name phone role')
    .populate('order')
    .populate('period')
    .populate('approvedBy', 'name phone role')
    .sort({ createdAt: -1 });
};

export const findVouchersByQuery = async (query: any): Promise<IVoucher[]> => {
  return await Voucher.find(query)
    .populate('student', 'name phone role')
    .populate('issuedBy', 'name phone role')
    .populate('order')
    .populate('period')
    .populate('approvedBy', 'name phone role')
    .sort({ createdAt: -1 });
};

export const findVouchersByStudent = async (studentId: string): Promise<IVoucher[]> => {
  return await Voucher.find({ student: studentId })
    .populate('issuedBy', 'name phone role')
    .populate('order')
    .populate('period')
    .populate('approvedBy', 'name phone role')
    .sort({ createdAt: -1 });
};

export const findUnredeemedVouchersByStudent = async (studentId: string): Promise<IVoucher[]> => {
  return await Voucher.find({ student: studentId, order: null })
    .populate('issuedBy', 'name phone role')
    .populate('period')
    .populate('approvedBy', 'name phone role')
    .sort({ createdAt: -1 });
};

export const findVouchersByIssuedBy = async (teacherId: string): Promise<IVoucher[]> => {
  return await Voucher.find({ issuedBy: teacherId })
    .populate('student', 'name phone role')
    .populate('order')
    .populate('period')
    .populate('approvedBy', 'name phone role')
    .sort({ createdAt: -1 });
};

export const countUnredeemedVouchersByStudent = async (studentId: string): Promise<number> => {
  return await Voucher.countDocuments({ student: studentId, order: null });
};

export const findVouchersInPeriod = async (
  studentId: string,
  startDate: Date,
  endDate: Date
): Promise<IVoucher[]> => {
  return await Voucher.find({
    student: studentId,
    createdAt: { $gte: startDate, $lte: endDate }
  }).sort({ createdAt: -1 });
};

export const createVoucher = async (voucherData: Partial<IVoucher>): Promise<IVoucher> => {
  const newVoucher = new Voucher(voucherData);
  return await newVoucher.save();
};

export const updateVoucherById = async (
  voucherId: string,
  updateData: Partial<IVoucher>
): Promise<IVoucher | null> => {
  return await Voucher.findByIdAndUpdate(
    voucherId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('student', 'name phone role')
    .populate('issuedBy', 'name phone role')
    .populate('order')
    .populate('period')
    .populate('approvedBy', 'name phone role');
};

export const markVoucherAsRedeemed = async (
  voucherId: string,
  orderId: mongoose.Types.ObjectId
): Promise<IVoucher | null> => {
  return await Voucher.findByIdAndUpdate(
    voucherId,
    { order: orderId },
    { new: true }
  )
    .populate('student', 'name phone role')
    .populate('issuedBy', 'name phone role')
    .populate('order')
    .populate('period')
    .populate('approvedBy', 'name phone role');
};

export const deleteVoucherById = async (voucherId: string): Promise<IVoucher | null> => {
  return await Voucher.findByIdAndDelete(voucherId);
};

export const findVoucherByStudentAndWeek = async (
  studentId: string,
  weekStartDate: Date,
  weekEndDate: Date
): Promise<IVoucher | null> => {
  return await Voucher.findOne({
    student: studentId,
    createdAt: { $gte: weekStartDate, $lt: weekEndDate }
  })
    .populate('issuedBy', 'name phone role')
    .populate('period')
    .populate('approvedBy', 'name phone role')
    .sort({ createdAt: -1 });
};
