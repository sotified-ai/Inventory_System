import { Router } from 'express';
import * as invoiceController from './invoice.controller';
import { authMiddleware } from '../../core/authMiddleware';
import { requireRole } from '../../core/roleMiddleware';

const router = Router();

router.get('/', authMiddleware, invoiceController.getAll);
router.get('/:id', authMiddleware, invoiceController.getById);
router.post('/', authMiddleware, requireRole(['Admin', 'Manager', 'Order Taker']), invoiceController.create);

export default router;
