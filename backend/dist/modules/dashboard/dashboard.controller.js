"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverview = void 0;
const dashboard_service_1 = require("./dashboard.service");
const dashboardService = new dashboard_service_1.DashboardService();
const getOverview = async (req, res, next) => {
    try {
        const overview = await dashboardService.getOverview();
        res.json(overview);
    }
    catch (error) {
        next(error);
    }
};
exports.getOverview = getOverview;
