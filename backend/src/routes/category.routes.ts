import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';

const router = Router();

// GET routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// POST routes
router.post('/', categoryController.createCategory);

// PUT routes
router.put('/:id', categoryController.updateCategory);

// DELETE routes
router.delete('/:id', categoryController.deleteCategory);

export default router;
