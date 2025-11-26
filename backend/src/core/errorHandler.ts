import { Request, Response, NextFunction } from 'express';
import { HttpError } from './HttpError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
};
