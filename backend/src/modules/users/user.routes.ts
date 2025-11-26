import { Router } from 'express';
import * as userController from './user.controller';
import { authMiddleware } from '../../core/authMiddleware';
import { requireRole } from '../../core/roleMiddleware';

const router = Router();

router.get('/', authMiddleware, requireRole(['Admin']), userController.getAll);
router.post('/', authMiddleware, requireRole(['Admin']), userController.create);

export default router;
