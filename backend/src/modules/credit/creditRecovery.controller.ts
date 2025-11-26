import { Request, Response, NextFunction } from 'express';
import { CreditRecoveryService } from './creditRecovery.service';
import { AuthUser } from '../../core/authMiddleware';

const creditService = new CreditRecoveryService();

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as Request & { user?: AuthUser }).user;
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const recovery = await creditService.create(req.body, user.id);
        res.status(201).json(recovery);
    } catch (error) {
        next(error);
    }
};

export const getByCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerId = parseInt(req.params.customerId);
        const recoveries = await creditService.getByCustomer(customerId);
        res.json(recoveries);
    } catch (error) {
        next(error);
    }
};
