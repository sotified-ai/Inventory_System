import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { authMiddleware } from '../../core/authMiddleware';
import { requireRole } from '../../core/roleMiddleware';

const router = Router();

router.get('/overview', authMiddleware, requireRole(['Admin', 'Manager']), dashboardController.getOverview);

export default router;
