import { Router } from 'express';
import * as voucherController from '../controllers/voucher.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Get all vouchers (admin/teacher only)
router.get(
  '/',
  authenticate,
  authorize('admin', 'teacher'),
  voucherController.getAllVouchers
);

// Get voucher by ID (admin/teacher only)
router.get(
  '/:id',
  authenticate,
  authorize('admin', 'teacher'),
  voucherController.getVoucherById
);

// Get vouchers by student ID (admin/teacher only)
router.get(
  '/student/:studentId',
  authenticate,
  authorize('admin', 'teacher'),
  voucherController.getVouchersByStudent
);

// Get unredeemed vouchers by student ID (admin/teacher only)
router.get(
  '/student/:studentId/unredeemed',
  authenticate,
  authorize('admin', 'teacher'),
  voucherController.getUnredeemedVouchersByStudent
);

// Get vouchers by issuer (admin/teacher only)
router.get(
  '/issued-by/:teacherId',
  authenticate,
  authorize('admin', 'teacher'),
  voucherController.getVouchersByIssuedBy
);

// Get my vouchers as a student
router.get(
  '/my/vouchers',
  authenticate,
  authorize('student'),
  voucherController.getMyVouchers
);

// Get my unredeemed vouchers as a student
router.get(
  '/my/unredeemed',
  authenticate,
  authorize('student'),
  voucherController.getMyUnredeemedVouchers
);

// Issue new voucher (teacher/admin only)
router.post(
  '/',
  authenticate,
  authorize('teacher', 'admin'),
  voucherController.issueVoucher
);

// Approve voucher (teacher of student or admin)
router.post(
  '/:id/approve',
  authenticate,
  authorize('teacher', 'admin'),
  voucherController.approveVoucher
);

// Reject voucher (teacher of student or admin)
router.post(
  '/:id/reject',
  authenticate,
  authorize('teacher', 'admin'),
  voucherController.rejectVoucher
);

// Delete voucher (admin only - can only delete unredeemed vouchers)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  voucherController.deleteVoucher
);

export default router;
