import { Request, Response, NextFunction } from 'express';
import { WarehouseService } from './warehouse.service';
import { AuthUser } from '../../core/authMiddleware';

const warehouseService = new WarehouseService();

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as Request & { user?: AuthUser }).user;
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const sheet = await warehouseService.createLoadSheet(req.body, user.id);
        res.status(201).json(sheet);
    } catch (error) {
        next(error);
    }
};

export const issue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as Request & { user?: AuthUser }).user;
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const id = parseInt(req.params.id);
        const sheet = await warehouseService.issueLoadSheet(id, user.id);
        res.json(sheet);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sheets = await warehouseService.getAll();
        res.json(sheets);
    } catch (error) {
        next(error);
    }
};
