import { Request, Response, NextFunction } from 'express';
import { SummaryService } from './summary.service';
import { AuthUser } from '../../core/authMiddleware';

const summaryService = new SummaryService();

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date, deliveryManId } = req.query;
        if (!date || !deliveryManId) {
            return res.status(400).json({ message: 'Missing date or deliveryManId' });
        }
        const summary = await summaryService.getByDateAndDeliveryMan(date as string, parseInt(deliveryManId as string));
        res.json(summary);
    } catch (error) {
        next(error);
    }
};

export const saveSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as Request & { user?: AuthUser }).user;
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const summary = await summaryService.createOrUpdate(req.body, user.id);
        res.json(summary);
    } catch (error) {
        next(error);
    }
};
