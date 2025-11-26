"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getById = exports.getAll = exports.create = void 0;
const invoice_service_1 = require("./invoice.service");
const invoiceService = new invoice_service_1.InvoiceService();
const create = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        const invoice = await invoiceService.create(req.body, user.id);
        res.status(201).json(invoice);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const getAll = async (req, res, next) => {
    try {
        const invoices = await invoiceService.getAll();
        res.json(invoices);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const invoice = await invoiceService.getById(id);
        res.json(invoice);
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
