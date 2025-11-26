import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { AuthUser } from '../../core/authMiddleware';

const productService = new ProductService();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productService.getAll();
        res.json(products);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const product = await productService.getById(id);
        res.json(product);
    } catch (error) {
        next(error);
    }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as Request & { user?: AuthUser }).user;
        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        const product = await productService.create(req.body, user.id);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const product = await productService.update(id, req.body);
        res.json(product);
    } catch (error) {
        next(error);
    }
};
