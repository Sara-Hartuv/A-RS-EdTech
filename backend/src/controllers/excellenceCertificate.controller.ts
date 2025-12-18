import { Request, Response } from 'express';
import * as excellenceCertificateService from '../services/excellenceCertificate.service';

export const getExcellenceCertificateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const certificate = await excellenceCertificateService.getExcellenceCertificateById(id);
    res.status(200).json(certificate);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllExcellenceCertificates = async (req: Request, res: Response): Promise<void> => {
  try {
    const certificates = await excellenceCertificateService.getAllExcellenceCertificates();
    res.status(200).json(certificates);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExcellenceCertificatesByStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const certificates = await excellenceCertificateService.getExcellenceCertificatesByStudent(studentId);
    res.status(200).json(certificates);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyCertificates = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const certificates = await excellenceCertificateService.getExcellenceCertificatesByStudent(
      req.user.userId
    );
    res.status(200).json(certificates);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getExcellenceCertificatesByIssuedBy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { issuerId } = req.params;
    const certificates = await excellenceCertificateService.getExcellenceCertificatesByIssuedBy(issuerId);
    res.status(200).json(certificates);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const issueExcellenceCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { student, periodStart, periodEnd } = req.body;

    if (!student || !periodStart || !periodEnd) {
      res.status(400).json({ message: 'Student, period start, and period end are required' });
      return;
    }

    const certificateData = {
      student,
      issuedBy: req.user.userId,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
    };

    const newCertificate = await excellenceCertificateService.issueExcellenceCertificate(certificateData);
    res.status(201).json(newCertificate);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateExcellenceCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { periodStart, periodEnd } = req.body;

    const updateData: any = {};
    if (periodStart) updateData.periodStart = new Date(periodStart);
    if (periodEnd) updateData.periodEnd = new Date(periodEnd);

    const updatedCertificate = await excellenceCertificateService.updateExcellenceCertificate(
      id,
      updateData
    );
    res.status(200).json(updatedCertificate);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteExcellenceCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedCertificate = await excellenceCertificateService.deleteExcellenceCertificate(id);
    res.status(200).json({
      message: 'Excellence certificate deleted successfully',
      certificate: deletedCertificate,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
