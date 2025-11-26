"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.issue = exports.create = void 0;
const warehouse_service_1 = require("./warehouse.service");
const warehouseService = new warehouse_service_1.WarehouseService();
const create = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        const sheet = await warehouseService.createLoadSheet(req.body, user.id);
        res.status(201).json(sheet);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const issue = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        const id = parseInt(req.params.id);
        const sheet = await warehouseService.issueLoadSheet(id, user.id);
        res.json(sheet);
    }
    catch (error) {
        next(error);
    }
};
exports.issue = issue;
const getAll = async (req, res, next) => {
    try {
        const sheets = await warehouseService.getAll();
        res.json(sheets);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
