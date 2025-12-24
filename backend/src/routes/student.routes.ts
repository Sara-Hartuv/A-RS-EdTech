import { Router } from 'express';
import * as studentController from '../controllers/student.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// Get my dashboard data (student only) - MUST BE BEFORE /:id route
router.get('/me/dashboard', authorize('student'), studentController.getMyDashboardData);

// צפייה בפרופיל תלמיד (פתוח למורה, אדמין ולתלמיד עצמו)
router.get('/:id', authorize('teacher', 'admin', 'student'), studentController.getStudentProfile);

// הוספת נקודות ושוברים (רק למורים ואדמינים)
router.put('/:id/points', authorize('teacher', 'admin'), studentController.addPoints);
router.put('/:id/vouchers', authorize('teacher', 'admin'), studentController.addVouchers);

export default router;