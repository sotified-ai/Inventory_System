"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = exports.getById = exports.getAll = void 0;
const customer_service_1 = require("./customer.service");
const customerService = new customer_service_1.CustomerService();
const getAll = async (req, res, next) => {
    try {
        const customers = await customerService.getAll();
        res.json(customers);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const customer = await customerService.getById(id);
        res.json(customer);
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const create = async (req, res, next) => {
    try {
        const customer = await customerService.create(req.body);
        res.status(201).json(customer);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const customer = await customerService.update(id, req.body);
        res.json(customer);
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
