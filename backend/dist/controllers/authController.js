"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authService_1 = require("../services/authService");
const response_1 = require("../utils/response");
exports.authController = {
    register: async (req, res) => {
        const result = await authService_1.authService.register(req.body);
        res.status(201).json((0, response_1.successResponse)(result, 'Registrasi berhasil'));
    },
    login: async (req, res) => {
        const result = await authService_1.authService.login(req.body.email, req.body.password);
        res.json((0, response_1.successResponse)(result, 'Login berhasil'));
    },
    refresh: async (req, res) => {
        const result = await authService_1.authService.refresh(req.body.refreshToken);
        res.json((0, response_1.successResponse)(result, 'Token berhasil diperbarui'));
    },
    logout: async (req, res) => {
        await authService_1.authService.logout(req.body.refreshToken);
        res.json((0, response_1.successResponse)(null, 'Logout berhasil'));
    },
    me: async (req, res) => {
        const user = await authService_1.authService.me(req.user.userId);
        res.json((0, response_1.successResponse)(user, 'Data user berhasil diambil'));
    },
};
//# sourceMappingURL=authController.js.map