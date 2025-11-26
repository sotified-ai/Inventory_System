import { Router } from 'express';
import * as warehouseController from './warehouse.controller';
import { authMiddleware } from '../../core/authMiddleware';
import { requireRole } from '../../core/roleMiddleware';

const router = Router();

router.get('/', authMiddleware, warehouseController.getAll);
router.post('/', authMiddleware, requireRole(['Admin', 'Manager', 'Warehouse']), warehouseController.create);
router.post('/:id/issue', authMiddleware, requireRole(['Admin', 'Manager', 'Warehouse']), warehouseController.issue);

export default router;
