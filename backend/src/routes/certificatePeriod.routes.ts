import { Router } from 'express';
import * as certificatePeriodController from '../controllers/certificatePeriod.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Admin only: create, update, delete
router.post('/', authenticate, authorize('admin'), certificatePeriodController.createPeriod);
router.put('/:id', authenticate, authorize('admin'), certificatePeriodController.updatePeriod);
router.delete('/:id', authenticate, authorize('admin'), certificatePeriodController.deletePeriod);

// Teachers and admins can view periods
router.get('/', authenticate, authorize('teacher', 'admin'), certificatePeriodController.getAllPeriods);
router.get('/active', authenticate, authorize('teacher', 'admin'), certificatePeriodController.getActivePeriod);
router.get('/:id', authenticate, authorize('teacher', 'admin'), certificatePeriodController.getPeriodById);

export default router;
