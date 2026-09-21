"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeOwnerOrAdmin = exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
const prisma_1 = require("../utils/prisma");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.UnauthorizedError('Token tidak ditemukan');
        }
        const token = authHeader.split(' ')[1];
        const payload = (0, jwt_1.verifyAccessToken)(token);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, email: true, role: true },
        });
        if (!user) {
            throw new errors_1.UnauthorizedError('User tidak ditemukan');
        }
        req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof errors_1.UnauthorizedError) {
            throw error;
        }
        throw new errors_1.UnauthorizedError('Token tidak valid atau kadaluarsa');
    }
};
exports.authenticate = authenticate;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new errors_1.UnauthorizedError('Unauthenticated');
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw new errors_1.UnauthorizedError('Akses ditolak: role tidak diizinkan');
        }
        next();
    };
};
exports.authorize = authorize;
const authorizeOwnerOrAdmin = (resourceUserId) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new errors_1.UnauthorizedError('Unauthenticated');
        }
        if (req.user.role !== 'admin' && req.user.userId !== resourceUserId) {
            throw new errors_1.UnauthorizedError('Akses ditolak: bukan pemilik resource');
        }
        next();
    };
};
exports.authorizeOwnerOrAdmin = authorizeOwnerOrAdmin;
//# sourceMappingURL=auth.js.map