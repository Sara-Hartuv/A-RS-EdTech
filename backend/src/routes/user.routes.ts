import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

// GET routes
router.get('/', userController.getAllUsers);
router.get('/active', userController.getActiveUsers);
router.get('/:id', userController.getUserById);

// POST routes
router.post('/', userController.createUser);

// PUT routes
router.put('/:id', userController.updateUser);

// DELETE routes
router.delete('/:id', userController.deleteUser);
router.delete('/:id/hard', userController.hardDeleteUser);

export default router;
