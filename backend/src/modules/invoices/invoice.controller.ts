import { Request, Response, NextFunction } from 'express';
import { InvoiceService } from './invoice.service';
import { AuthUser } from '../../core/authMiddleware';

const invoiceService = new InvoiceService();

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as Request & { user?: AuthUser }).user;
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const invoice = await invoiceService.create(req.body, user.id);
        res.status(201).json(invoice);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoices = await invoiceService.getAll();
        res.json(invoices);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const invoice = await invoiceService.getById(id);
        res.json(invoice);
    } catch (error) {
        next(error);
    }
};
