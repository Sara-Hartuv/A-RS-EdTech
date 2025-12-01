import { Router } from 'express';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import ideaRoutes from './idea.routes';
import orderRoutes from './order.routes';
import productRoutes from './product.routes';
import settingsRoutes from './settings.routes';

const router = Router();

// Register all routes
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/ideas', ideaRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/settings', settingsRoutes);

export default router;
