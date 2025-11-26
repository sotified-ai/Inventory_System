"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const HttpError_1 = require("./HttpError");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof HttpError_1.HttpError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
};
exports.errorHandler = errorHandler;
