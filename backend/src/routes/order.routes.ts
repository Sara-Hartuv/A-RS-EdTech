import { Router } from 'express';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.get('/', orderController.getAllOrders);
router.get('/pending', orderController.getPendingOrders);
router.get('/status/:status', orderController.getOrdersByStatus);
router.get('/student/:studentId', orderController.getOrdersByStudent);
router.get('/:id', orderController.getOrderById);

router.post('/', orderController.createOrder);

router.put('/:id', orderController.updateOrder);
router.put('/:id/status', orderController.updateOrderStatus);
router.put('/:id/delivered', orderController.markOrderAsDelivered);

export default router;
