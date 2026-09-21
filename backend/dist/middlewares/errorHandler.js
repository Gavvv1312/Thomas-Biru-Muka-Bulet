"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof zod_1.ZodError) {
        const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        return res.status(400).json((0, response_1.errorResponse)(messages));
    }
    if (err instanceof errors_1.AppError) {
        return res.status(err.statusCode).json((0, response_1.errorResponse)(err.message));
    }
    return res.status(500).json((0, response_1.errorResponse)('Terjadi kesalahan server'));
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json((0, response_1.errorResponse)(`Route ${req.method} ${req.path} tidak ditemukan`));
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map