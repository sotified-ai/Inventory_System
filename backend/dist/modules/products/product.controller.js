"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = exports.getById = exports.getAll = void 0;
const product_service_1 = require("./product.service");
const productService = new product_service_1.ProductService();
const getAll = async (req, res, next) => {
    try {
        const products = await productService.getAll();
        res.json(products);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const product = await productService.getById(id);
        res.json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const create = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        const product = await productService.create(req.body, user.id);
        res.status(201).json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const product = await productService.update(id, req.body);
        res.json(product);
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
