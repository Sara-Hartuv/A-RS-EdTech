import ExcellenceCertificate, { IExcellenceCertificate } from '../models/excellenceCertificate.model';
import mongoose from 'mongoose';

export const findExcellenceCertificateById = async (
  certificateId: string
): Promise<IExcellenceCertificate | null> => {
  return await ExcellenceCertificate.findById(certificateId)
    .populate('student', 'name phone role')
    .populate('issuedBy', 'name phone role');
};

export const findAllExcellenceCertificates = async (): Promise<IExcellenceCertificate[]> => {
  return await ExcellenceCertificate.find()
    .populate('student', 'name phone role')
    .populate('issuedBy', 'name phone role')
    .sort({ createdAt: -1 });
};

export const findExcellenceCertificatesByQuery = async (
  query: any
): Promise<IExcellenceCertificate[]> => {
  return await ExcellenceCertificate.find(query)
    .populate('student', 'name phone role')
    .populate('issuedBy', 'name phone role')
    .sort({ createdAt: -1 });
};

export const findExcellenceCertificatesByStudent = async (
  studentId: string
): Promise<IExcellenceCertificate[]> => {
  return await ExcellenceCertificate.find({ student: studentId })
    .populate('issuedBy', 'name phone role')
    .sort({ createdAt: -1 });
};

export const findExcellenceCertificatesByIssuedBy = async (
  issuerId: string
): Promise<IExcellenceCertificate[]> => {
  return await ExcellenceCertificate.find({ issuedBy: issuerId })
    .populate('student', 'name phone role')
    .sort({ createdAt: -1 });
};

export const createExcellenceCertificate = async (
  certificateData: Partial<IExcellenceCertificate>
): Promise<IExcellenceCertificate> => {
  const newCertificate = new ExcellenceCertificate(certificateData);
  return await newCertificate.save();
};

export const updateExcellenceCertificateById = async (
  certificateId: string,
  updateData: Partial<IExcellenceCertificate>
): Promise<IExcellenceCertificate | null> => {
  return await ExcellenceCertificate.findByIdAndUpdate(
    certificateId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('student', 'name phone role')
    .populate('issuedBy', 'name phone role');
};

export const deleteExcellenceCertificateById = async (
  certificateId: string
): Promise<IExcellenceCertificate | null> => {
  return await ExcellenceCertificate.findByIdAndDelete(certificateId);
};
