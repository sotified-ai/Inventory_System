"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSummary = exports.getSummary = void 0;
const summary_service_1 = require("./summary.service");
const summaryService = new summary_service_1.SummaryService();
const getSummary = async (req, res, next) => {
    try {
        const { date, deliveryManId } = req.query;
        if (!date || !deliveryManId) {
            return res.status(400).json({ message: 'Missing date or deliveryManId' });
        }
        const summary = await summaryService.getByDateAndDeliveryMan(date, parseInt(deliveryManId));
        res.json(summary);
    }
    catch (error) {
        next(error);
    }
};
exports.getSummary = getSummary;
const saveSummary = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        const summary = await summaryService.createOrUpdate(req.body, user.id);
        res.json(summary);
    }
    catch (error) {
        next(error);
    }
};
exports.saveSummary = saveSummary;
