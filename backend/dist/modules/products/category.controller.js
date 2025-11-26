"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getAll = void 0;
const category_service_1 = require("./category.service");
const categoryService = new category_service_1.CategoryService();
const getAll = async (req, res, next) => {
    try {
        const categories = await categoryService.getAll();
        res.json(categories);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const create = async (req, res, next) => {
    try {
        const { name } = req.body;
        const category = await categoryService.create(name);
        res.status(201).json(category);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;
        const category = await categoryService.update(id, name);
        res.json(category);
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await categoryService.delete(id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
