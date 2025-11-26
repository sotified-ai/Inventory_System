import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';

const categoryService = new CategoryService();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoryService.getAll();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const category = await categoryService.create(name);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;
        const category = await categoryService.update(id, name);
        res.json(category);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        await categoryService.delete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
