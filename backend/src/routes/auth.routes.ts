import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Public routes (לא דורשים טוקן)
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/register-student', authController.registerStudent);
router.post('/register-teacher', authController.registerTeacher);
router.post('/logout', authController.logout);

export default router;