import { IVoucher } from '../models/voucher.model';
import mongoose from 'mongoose';
import * as voucherRepository from '../repositories/voucher.repository';
import * as userRepository from '../repositories/user.repository';
import * as studentRepository from '../repositories/student.repository';
import * as certificatePeriodService from '../services/certificatePeriod.service';
import { ITeacher } from '../models/teacher.model'; 
import { IStudent } from '../models/student.model';

export const getVoucherById = async (voucherId: string): Promise<IVoucher | null> => {
  if (!mongoose.Types.ObjectId.isValid(voucherId)) {
    throw new Error('Invalid voucher ID');
  }

  const voucher = await voucherRepository.findVoucherById(voucherId);

  if (!voucher) {
    throw new Error('Voucher not found');
  }

  return voucher;
};

export const getAllVouchers = async (): Promise<IVoucher[]> => {
  const vouchers = await voucherRepository.findAllVouchers();
  return vouchers;
};

export const getVouchersByStudent = async (studentId: string): Promise<IVoucher[]> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  const vouchers = await voucherRepository.findVouchersByStudent(studentId);
  return vouchers;
};

export const getUnredeemedVouchersByStudent = async (studentId: string): Promise<IVoucher[]> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  const vouchers = await voucherRepository.findUnredeemedVouchersByStudent(studentId);
  return vouchers;
};

export const getVouchersByIssuedBy = async (teacherId: string): Promise<IVoucher[]> => {
  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    throw new Error('Invalid teacher ID');
  }

  const vouchers = await voucherRepository.findVouchersByIssuedBy(teacherId);
  return vouchers;
};

export const issueVoucher = async (voucherData: {
  student: string;
  issuedBy: string;
}): Promise<IVoucher> => {
  if (!mongoose.Types.ObjectId.isValid(voucherData.student)) {
    throw new Error('Invalid student ID');
  }

  if (!mongoose.Types.ObjectId.isValid(voucherData.issuedBy)) {
    throw new Error('Invalid teacher ID');
  }

  // Verify student exists
  const student = await userRepository.findUserById(voucherData.student);
  if (!student) throw new Error('Student not found');
  if (student.role !== 'student') throw new Error('Vouchers can only be issued to students');
  if (!student.status) throw new Error('Cannot issue voucher to inactive student');

  // Verify issuer exists
  const issuer = await userRepository.findUserById(voucherData.issuedBy);
  if (!issuer) throw new Error('Issuer not found');

  if (issuer.role !== 'teacher' && issuer.role !== 'admin') {
    throw new Error('Only teachers and admins can issue vouchers');
  }

  const now = new Date();
  const period = await certificatePeriodService.findPeriodForDate(now);
  if (!period) throw new Error('No active certificate period found for voucher issuance');

  let status: 'pending' | 'approved' | 'rejected' = 'pending';
  let approvedBy: mongoose.Types.ObjectId | null = null;
  let approvedAt: Date | null = null;

  // --- התיקון כאן ---
  // אנחנו בודקים אם הוא מורה, ואם כן, אנחנו עושים לו המרה (Casting) ל-ITeacher
  // כדי שנוכל לגשת למערך התלמידים שלו
  let issuerIsTeacherOfStudent = false;

  if (issuer.role === 'teacher') {
      const teacher = issuer as ITeacher; // המרה בטוחה כי בדקנו את ה-role
      // בדיקה שהמערך קיים ושהתלמיד נמצא בתוכו
      if (teacher.students && teacher.students.some((s: any) => s.toString() === voucherData.student)) {
          issuerIsTeacherOfStudent = true;
      }
  }

  if (issuerIsTeacherOfStudent) {
    status = 'approved';
    approvedBy = new mongoose.Types.ObjectId(voucherData.issuedBy);
    approvedAt = new Date();
  }

  const newVoucher = await voucherRepository.createVoucher({
    student: new mongoose.Types.ObjectId(voucherData.student),
    issuedBy: new mongoose.Types.ObjectId(voucherData.issuedBy),
    order: null,
    period: (period._id as mongoose.Types.ObjectId),
    status,
    approvedBy,
    approvedAt,
  });

  if (status === 'approved') {
    await studentRepository.updateStudentExcellenceVouchers(voucherData.student, true);
  }

  return newVoucher;
};

export const approveVoucher = async (voucherId: string, approverId: string): Promise<IVoucher | null> => {
  if (!mongoose.Types.ObjectId.isValid(voucherId)) throw new Error('Invalid voucher ID');
  if (!mongoose.Types.ObjectId.isValid(approverId)) throw new Error('Invalid approver ID');

  const voucher = await voucherRepository.findVoucherById(voucherId);
  if (!voucher) throw new Error('Voucher not found');
  if (voucher.status === 'approved') throw new Error('Voucher is already approved');

  const approver = await userRepository.findUserById(approverId);
  if (!approver) throw new Error('Approver not found');

  // --- התיקון כאן ---
  let isAuthorized = false;

  if (approver.role === 'admin') {
      isAuthorized = true;
  } else if (approver.role === 'teacher') {
      const teacher = approver as ITeacher; // Casting ל-ITeacher
      // בדיקה שהמערך קיים ושהתלמיד נמצא בתוכו
      if (teacher.students && teacher.students.some((s: any) => s.toString() === voucher.student.toString())) {
          isAuthorized = true;
      }
  }

  if (!isAuthorized) {
    throw new Error('Only the student\'s teacher or admin can approve this voucher');
  }

  const updated = await voucherRepository.updateVoucherById(voucherId, {
    status: 'approved',
    approvedBy: new mongoose.Types.ObjectId(approverId),
    approvedAt: new Date(),
  } as any);

  await studentRepository.updateStudentExcellenceVouchers(voucher.student.toString(), true);

  return updated;
};

export const rejectVoucher = async (voucherId: string, approverId: string): Promise<IVoucher | null> => {
  if (!mongoose.Types.ObjectId.isValid(voucherId)) throw new Error('Invalid voucher ID');
  if (!mongoose.Types.ObjectId.isValid(approverId)) throw new Error('Invalid approver ID');

  const voucher = await voucherRepository.findVoucherById(voucherId);
  if (!voucher) throw new Error('Voucher not found');
  if (voucher.status === 'rejected') throw new Error('Voucher is already rejected');

  const approver = await userRepository.findUserById(approverId);
  if (!approver) throw new Error('Approver not found');

  // --- התיקון כאן (אותו לוגיקה כמו ב-approve) ---
  let isAuthorized = false;

  if (approver.role === 'admin') {
      isAuthorized = true;
  } else if (approver.role === 'teacher') {
      const teacher = approver as ITeacher;
      if (teacher.students && teacher.students.some((s: any) => s.toString() === voucher.student.toString())) {
          isAuthorized = true;
      }
  }

  if (!isAuthorized) {
    throw new Error('Only the student\'s teacher or admin can reject this voucher');
  }

  const updated = await voucherRepository.updateVoucherById(voucherId, {
    status: 'rejected',
    approvedBy: new mongoose.Types.ObjectId(approverId),
    approvedAt: new Date(),
  } as any);

  return updated;
};

export const redeemVoucher = async (
  voucherId: string,
  orderId: string
): Promise<IVoucher | null> => {
  if (!mongoose.Types.ObjectId.isValid(voucherId)) {
    throw new Error('Invalid voucher ID');
  }

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error('Invalid order ID');
  }

  const voucher = await voucherRepository.findVoucherById(voucherId);

  if (!voucher) {
    throw new Error('Voucher not found');
  }
  if (voucher.order) {
    throw new Error('Voucher has already been redeemed');
  }

  if (voucher.status !== 'approved') {
    throw new Error('Only approved vouchers can be redeemed');
  }

  const redeemedVoucher = await voucherRepository.markVoucherAsRedeemed(
    voucherId,
    new mongoose.Types.ObjectId(orderId)
  );

  return redeemedVoucher;
};

export const deleteVoucher = async (voucherId: string): Promise<IVoucher | null> => {
  if (!mongoose.Types.ObjectId.isValid(voucherId)) {
    throw new Error('Invalid voucher ID');
  }

  const voucher = await voucherRepository.findVoucherById(voucherId);

  if (!voucher) {
    throw new Error('Voucher not found');
  }

  if (voucher.order) {
    throw new Error('Cannot delete a redeemed voucher');
  }

  // Decrease student's excellenceVouchers count only if voucher was approved
  if (voucher.status === 'approved') {
    await studentRepository.updateStudentExcellenceVouchers(voucher.student.toString(), false);
  }

  const deletedVoucher = await voucherRepository.deleteVoucherById(voucherId);

  return deletedVoucher;
};