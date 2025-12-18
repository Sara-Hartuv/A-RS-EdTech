import { Router } from 'express';
import * as excellenceCertificateController from '../controllers/excellenceCertificate.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Get all excellence certificates (admin/teacher only)
router.get(
  '/',
  authenticate,
  authorize('admin', 'teacher'),
  excellenceCertificateController.getAllExcellenceCertificates
);

// Get excellence certificate by ID (admin/teacher only)
router.get(
  '/:id',
  authenticate,
  authorize('admin', 'teacher'),
  excellenceCertificateController.getExcellenceCertificateById
);

// Get excellence certificates by student ID (admin/teacher only)
router.get(
  '/student/:studentId',
  authenticate,
  authorize('admin', 'teacher'),
  excellenceCertificateController.getExcellenceCertificatesByStudent
);

// Get excellence certificates by issuer ID (admin/teacher only)
router.get(
  '/issued-by/:issuerId',
  authenticate,
  authorize('admin', 'teacher'),
  excellenceCertificateController.getExcellenceCertificatesByIssuedBy
);

// Get my excellence certificates as a student
router.get(
  '/my/certificates',
  authenticate,
  authorize('student'),
  excellenceCertificateController.getMyCertificates
);

// Issue new excellence certificate (teacher/admin only)
router.post(
  '/',
  authenticate,
  authorize('teacher', 'admin'),
  excellenceCertificateController.issueExcellenceCertificate
);

// Update excellence certificate (teacher/admin only)
router.put(
  '/:id',
  authenticate,
  authorize('teacher', 'admin'),
  excellenceCertificateController.updateExcellenceCertificate
);

// Delete excellence certificate (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  excellenceCertificateController.deleteExcellenceCertificate
);

export default router;
