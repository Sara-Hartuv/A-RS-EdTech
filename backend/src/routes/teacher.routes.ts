import { Router } from 'express';
import * as teacherController from '../controllers/teacher.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('teacher')); 

// שליפת התלמידים של המורה המחובר
router.get('/my-students', teacherController.getMyStudents);

// הוספת תלמיד לכיתה
router.post('/class', teacherController.addStudentToClass);

export default router;