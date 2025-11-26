"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.getAll = void 0;
const user_service_1 = require("./user.service");
const userService = new user_service_1.UserService();
const getAll = async (req, res, next) => {
    try {
        const users = await userService.getAll();
        res.json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const create = async (req, res, next) => {
    try {
        const user = await userService.create(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
