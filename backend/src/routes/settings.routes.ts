import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller';

const router = Router();

// GET routes
router.get('/', settingsController.getSettings);

// PUT routes
router.put('/', settingsController.updateSettings);
router.put('/redeem', settingsController.toggleRedeemStatus);
router.put('/kiosk', settingsController.updateKioskInfo);
router.put('/rules', settingsController.updatePurchaseRules);

export default router;
