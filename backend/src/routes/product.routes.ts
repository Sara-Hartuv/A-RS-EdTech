import { Router } from 'express';
import * as productController from '../controllers/product.controller';

const router = Router();

// GET routes
router.get('/', productController.getAllProducts);
router.get('/available', productController.getAvailableProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);

// POST routes
router.post('/', productController.createProduct);

// PUT routes
router.put('/:id', productController.updateProduct);
router.put('/:id/stock', productController.updateProductStock);

// DELETE routes
router.delete('/:id', productController.deleteProduct);

export default router;
