import { Router } from 'express';
import * as customerController from './customer.controller';
import { authMiddleware } from '../../core/authMiddleware';
import { requireRole } from '../../core/roleMiddleware';

const router = Router();

router.get('/', authMiddleware, customerController.getAll);
router.get('/:id', authMiddleware, customerController.getById);
router.post('/', authMiddleware, requireRole(['Admin', 'Manager', 'Order Taker']), customerController.create);
router.put('/:id', authMiddleware, requireRole(['Admin', 'Manager']), customerController.update);

export default router;
