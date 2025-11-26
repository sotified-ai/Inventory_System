"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByCustomer = exports.create = void 0;
const creditRecovery_service_1 = require("./creditRecovery.service");
const creditService = new creditRecovery_service_1.CreditRecoveryService();
const create = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        const recovery = await creditService.create(req.body, user.id);
        res.status(201).json(recovery);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const getByCustomer = async (req, res, next) => {
    try {
        const customerId = parseInt(req.params.customerId);
        const recoveries = await creditService.getByCustomer(customerId);
        res.json(recoveries);
    }
    catch (error) {
        next(error);
    }
};
exports.getByCustomer = getByCustomer;
