import { IExcellenceCertificate } from '../models/excellenceCertificate.model';
import mongoose from 'mongoose';
import * as excellenceCertificateRepository from '../repositories/excellenceCertificate.repository';
import * as voucherRepository from '../repositories/voucher.repository';
import * as userRepository from '../repositories/user.repository';

export const getExcellenceCertificateById = async (
  certificateId: string
): Promise<IExcellenceCertificate | null> => {
  if (!mongoose.Types.ObjectId.isValid(certificateId)) {
    throw new Error('Invalid certificate ID');
  }

  const certificate = await excellenceCertificateRepository.findExcellenceCertificateById(certificateId);

  if (!certificate) {
    throw new Error('Excellence certificate not found');
  }

  return certificate;
};

export const getAllExcellenceCertificates = async (): Promise<IExcellenceCertificate[]> => {
  const certificates = await excellenceCertificateRepository.findAllExcellenceCertificates();
  return certificates;
};

export const getExcellenceCertificatesByStudent = async (
  studentId: string
): Promise<IExcellenceCertificate[]> => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  const certificates = await excellenceCertificateRepository.findExcellenceCertificatesByStudent(studentId);
  return certificates;
};

export const getExcellenceCertificatesByIssuedBy = async (
  issuerId: string
): Promise<IExcellenceCertificate[]> => {
  if (!mongoose.Types.ObjectId.isValid(issuerId)) {
    throw new Error('Invalid issuer ID');
  }

  const certificates = await excellenceCertificateRepository.findExcellenceCertificatesByIssuedBy(issuerId);
  return certificates;
};

export const issueExcellenceCertificate = async (certificateData: {
  student: string;
  issuedBy: string;
  periodStart: Date;
  periodEnd: Date;
}): Promise<IExcellenceCertificate> => {
  if (!mongoose.Types.ObjectId.isValid(certificateData.student)) {
    throw new Error('Invalid student ID');
  }

  if (!mongoose.Types.ObjectId.isValid(certificateData.issuedBy)) {
    throw new Error('Invalid issuer ID');
  }

  if (!certificateData.periodStart || !certificateData.periodEnd) {
    throw new Error('Period start and end dates are required');
  }

  if (certificateData.periodStart >= certificateData.periodEnd) {
    throw new Error('Period end date must be after period start date');
  }

  // Verify student exists
  const student = await userRepository.findUserById(certificateData.student);
  if (!student) {
    throw new Error('Student not found');
  }

  if (student.role !== 'student') {
    throw new Error('Excellence certificates can only be issued to students');
  }

  if (!student.status) {
    throw new Error('Cannot issue certificate to inactive student');
  }

  // Verify issuer exists
  const issuer = await userRepository.findUserById(certificateData.issuedBy);
  if (!issuer) {
    throw new Error('Issuer not found');
  }

  if (issuer.role !== 'teacher' && issuer.role !== 'admin') {
    throw new Error('Only teachers and admins can issue excellence certificates');
  }

  // Check if student has at least 5 vouchers in the specified period
  const vouchersInPeriod = await voucherRepository.findVouchersInPeriod(
    certificateData.student,
    certificateData.periodStart,
    certificateData.periodEnd
  );

  if (vouchersInPeriod.length < 5) {
    throw new Error(
      `Student must have at least 5 vouchers in the specified period. Found: ${vouchersInPeriod.length}`
    );
  }

  // Create certificate
  const newCertificate = await excellenceCertificateRepository.createExcellenceCertificate({
    student: new mongoose.Types.ObjectId(certificateData.student),
    issuedBy: new mongoose.Types.ObjectId(certificateData.issuedBy),
    periodStart: certificateData.periodStart,
    periodEnd: certificateData.periodEnd,
  });

  return newCertificate;
};

export const updateExcellenceCertificate = async (
  certificateId: string,
  updateData: {
    periodStart?: Date;
    periodEnd?: Date;
  }
): Promise<IExcellenceCertificate | null> => {
  if (!mongoose.Types.ObjectId.isValid(certificateId)) {
    throw new Error('Invalid certificate ID');
  }

  if (updateData.periodStart && updateData.periodEnd) {
    if (updateData.periodStart >= updateData.periodEnd) {
      throw new Error('Period end date must be after period start date');
    }
  }

  const updatedCertificate = await excellenceCertificateRepository.updateExcellenceCertificateById(
    certificateId,
    updateData
  );

  if (!updatedCertificate) {
    throw new Error('Excellence certificate not found');
  }

  return updatedCertificate;
};

export const deleteExcellenceCertificate = async (
  certificateId: string
): Promise<IExcellenceCertificate | null> => {
  if (!mongoose.Types.ObjectId.isValid(certificateId)) {
    throw new Error('Invalid certificate ID');
  }

  const certificate = await excellenceCertificateRepository.findExcellenceCertificateById(certificateId);

  if (!certificate) {
    throw new Error('Excellence certificate not found');
  }

  const deletedCertificate = await excellenceCertificateRepository.deleteExcellenceCertificateById(
    certificateId
  );

  return deletedCertificate;
};
