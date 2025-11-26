import { Request, Response, NextFunction } from 'express';
import { AuthUser } from './authMiddleware';

export const requireRole =
    (roles: string[]) =>
        (req: Request & { user?: AuthUser }, res: Response, next: NextFunction) => {
            if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
            if (!roles.includes(req.user.role))
                return res.status(403).json({ message: 'Forbidden' });
            next();
        };
