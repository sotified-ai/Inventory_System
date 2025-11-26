import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';

const dashboardService = new DashboardService();

export const getOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const overview = await dashboardService.getOverview();
        res.json(overview);
    } catch (error) {
        next(error);
    }
};
