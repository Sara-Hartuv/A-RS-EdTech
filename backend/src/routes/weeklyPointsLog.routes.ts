import { Router } from 'express';
import * as weeklyPointsLogController from '../controllers/weeklyPointsLog.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('admin', 'teacher'),
  weeklyPointsLogController.getAllWeeklyPointsLogs
);

router.get(
  '/:id',
  authenticate,
  authorize('admin', 'teacher'),
  weeklyPointsLogController.getWeeklyPointsLogById
);

router.get(
  '/student/:studentId',
  authenticate,
  authorize('admin', 'teacher'),
  weeklyPointsLogController.getWeeklyPointsLogsByStudent
);

router.get(
  '/student/:studentId/current-week',
  authenticate,
  authorize('admin', 'teacher'),
  weeklyPointsLogController.getCurrentWeekPointsForStudent
);

router.get(
  '/student/:studentId/has-current-week',
  authenticate,
  authorize('admin', 'teacher'),
  weeklyPointsLogController.hasCurrentWeekPoints
);

router.get(
  '/approver/:approverId',
  authenticate,
  authorize('admin', 'teacher'),
  weeklyPointsLogController.getWeeklyPointsLogsByApprover
);

router.get(
  '/my/logs',
  authenticate,
  authorize('student'),
  weeklyPointsLogController.getMyWeeklyPointsLogs
);

router.post(
  '/',
  authenticate,
  authorize('teacher', 'admin'),
  weeklyPointsLogController.createWeeklyPointsLog
);

router.put(
  '/:id',
  authenticate,
  authorize('teacher', 'admin'),
  weeklyPointsLogController.updateWeeklyPointsLog
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  weeklyPointsLogController.deleteWeeklyPointsLog
);

export default router;
