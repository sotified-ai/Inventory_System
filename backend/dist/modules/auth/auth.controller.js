"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.login = void 0;
const auth_service_1 = require("./auth.service");
const authService = new auth_service_1.AuthService();
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refresh(refreshToken);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.refresh = refresh;
