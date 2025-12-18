import { Router } from 'express';
import * as weeklyPointsLogController from '../controllers/weeklyPointsLog.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Get all weekly points logs (admin/teacher only)
router.get(
  '/',
  authenticate,
  authorize('admin', 'teacher'),
  weeklyPointsLogController.getAllWeeklyPointsLogs
);

// Get weekly points log by ID (admin/teacher only)
router.get(
  '/:id',
  authenticate,
  authorize('admin', 'teacher'),
  weeklyPointsLogController.getWeeklyPointsLogById
);

// Get weekly points logs by student ID (admin/teacher only)
router.get(
  '/student/:studentId',
  authenticate,
  authorize('admin', 'teacher'),
  weeklyPointsLogController.getWeeklyPointsLogsByStudent
);

// Get current week points for a student (admin/teacher only)
router.get(
  '/student/:studentId/current-week',
  authenticate,
  authorize('admin', 'teacher'),
  weeklyPointsLogController.getCurrentWeekPointsForStudent
);

// Check if student has current week points (admin/teacher only)
router.get(
  '/student/:studentId/has-current-week',
  authenticate,
  authorize('admin', 'teacher'),
  weeklyPointsLogController.hasCurrentWeekPoints
);

// Get weekly points logs by approver ID (admin/teacher only)
router.get(
  '/approver/:approverId',
  authenticate,
  authorize('admin', 'teacher'),
  weeklyPointsLogController.getWeeklyPointsLogsByApprover
);

// Get my weekly points logs as a student
router.get(
  '/my/logs',
  authenticate,
  authorize('student'),
  weeklyPointsLogController.getMyWeeklyPointsLogs
);

// Create new weekly points log (teacher/admin only)
router.post(
  '/',
  authenticate,
  authorize('teacher', 'admin'),
  weeklyPointsLogController.createWeeklyPointsLog
);

// Update weekly points log (teacher/admin only)
router.put(
  '/:id',
  authenticate,
  authorize('teacher', 'admin'),
  weeklyPointsLogController.updateWeeklyPointsLog
);

// Delete weekly points log (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  weeklyPointsLogController.deleteWeeklyPointsLog
);

export default router;
