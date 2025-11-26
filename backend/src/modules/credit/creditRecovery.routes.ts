import { Router } from 'express';
import * as creditController from './creditRecovery.controller';
import { authMiddleware } from '../../core/authMiddleware';
import { requireRole } from '../../core/roleMiddleware';

const router = Router();

router.post('/', authMiddleware, requireRole(['Admin', 'Manager', 'Delivery Man']), creditController.create);
router.get('/customer/:customerId', authMiddleware, creditController.getByCustomer);

export default router;
