import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export interface AuthUser {
    id: number;
    role: string;
}

export function authMiddleware(
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = header.substring(7);
    try {
        const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthUser;
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
