import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/user.routes';

import productRoutes from '../modules/products/product.routes';
import customerRoutes from '../modules/customers/customer.routes';
import warehouseRoutes from '../modules/warehouse/warehouse.routes';
import invoiceRoutes from '../modules/invoices/invoice.routes';
import summaryRoutes from '../modules/summaries/summary.routes';
import creditRoutes from '../modules/credit/creditRecovery.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/customers', customerRoutes);
router.use('/warehouse', warehouseRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/sales-summaries', summaryRoutes);
router.use('/credit-recoveries', creditRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
