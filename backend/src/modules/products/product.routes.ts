import { Router } from 'express';
import * as productController from './product.controller';
import * as categoryController from './category.controller';
import { authMiddleware } from '../../core/authMiddleware';
import { requireRole } from '../../core/roleMiddleware';

const router = Router();

// Categories
router.get('/categories', authMiddleware, categoryController.getAll);
router.post('/categories', authMiddleware, requireRole(['Admin', 'Manager']), categoryController.create);
router.put('/categories/:id', authMiddleware, requireRole(['Admin', 'Manager']), categoryController.update);
router.delete('/categories/:id', authMiddleware, requireRole(['Admin', 'Manager']), categoryController.remove);

// Products
router.get('/', authMiddleware, productController.getAll);
router.get('/:id', authMiddleware, productController.getById);
router.post('/', authMiddleware, requireRole(['Admin', 'Manager']), productController.create);
router.put('/:id', authMiddleware, requireRole(['Admin', 'Manager']), productController.update);

export default router;
