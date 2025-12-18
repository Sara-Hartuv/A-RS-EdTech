import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getCurrentUser);

router.get('/', authorize('admin'), userController.getAllUsers);
router.get('/active', authorize('admin', 'teacher'), userController.getActiveUsers);
router.post('/', authorize('admin'), userController.createUser); // יצירת יוזר ע"י אדמין

router.get('/:id', authorize('admin'), userController.getUserById);
router.put('/:id', authorize('admin', 'teacher'), userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);

export default router;