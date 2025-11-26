import { Request, Response, NextFunction } from 'express';
import { CustomerService } from './customer.service';

const customerService = new CustomerService();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customers = await customerService.getAll();
        res.json(customers);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const customer = await customerService.getById(id);
        res.json(customer);
    } catch (error) {
        next(error);
    }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = await customerService.create(req.body);
        res.status(201).json(customer);
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const customer = await customerService.update(id, req.body);
        res.json(customer);
    } catch (error) {
        next(error);
    }
};
