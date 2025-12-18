import { Router } from 'express';

// ייבוא הראוטים הקיימים שלך
import categoryRoutes from './category.routes';
import ideaRoutes from './idea.routes';
import orderRoutes from './order.routes';
import productRoutes from './product.routes';
import settingsRoutes from './settings.routes';
import noteRoutes from './note.routes';
import voucherRoutes from './voucher.routes';
import weeklyPointsLogRoutes from './weeklyPointsLog.routes';
import excellenceCertificateRoutes from './excellenceCertificate.routes';
import certificatePeriodRoutes from './certificatePeriod.routes';

// ייבוא הראוטים החדשים שיצרנו הרגע
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import teacherRoutes from './teacher.routes';
import studentRoutes from './student.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);        
router.use('/teachers', teacherRoutes);  
router.use('/students', studentRoutes);  

router.use('/categories', categoryRoutes);
router.use('/ideas', ideaRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/settings', settingsRoutes);
router.use('/notes', noteRoutes);
router.use('/vouchers', voucherRoutes); 
router.use('/weekly-points-logs', weeklyPointsLogRoutes);
router.use('/excellence-certificates', excellenceCertificateRoutes);
router.use('/certificate-periods', certificatePeriodRoutes);

export default router;