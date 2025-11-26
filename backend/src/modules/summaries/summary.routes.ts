import { Router } from 'express';
import * as summaryController from './summary.controller';
import { authMiddleware } from '../../core/authMiddleware';
import { requireRole } from '../../core/roleMiddleware';

const router = Router();

router.get('/', authMiddleware, summaryController.getSummary);
router.post('/', authMiddleware, requireRole(['Admin', 'Manager']), summaryController.saveSummary);

export default router;
