"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../utils/prisma");
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
class AuthService {
    async register(data) {
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser)
            throw new errors_1.ConflictError('Email sudah terdaftar');
        const role = data.role === 'owner' ? 'owner' : 'owner'; // force owner for public registration
        const passwordHash = await bcryptjs_1.default.hash(data.password, 12);
        const user = await prisma_1.prisma.user.create({
            data: {
                nama: data.nama,
                email: data.email,
                passwordHash,
                role,
            },
        });
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, jwt_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
        await this.storeRefreshToken(user.id, refreshToken);
        return {
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role,
                poinHijau: user.poinHijau,
            },
            accessToken,
            refreshToken,
        };
    }
    async login(email, password) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new errors_1.UnauthorizedError('Email atau password salah');
        const isValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValid)
            throw new errors_1.UnauthorizedError('Email atau password salah');
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, jwt_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
        await this.storeRefreshToken(user.id, refreshToken);
        return {
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role,
                poinHijau: user.poinHijau,
            },
            accessToken,
            refreshToken,
        };
    }
    async refresh(refreshToken) {
        let payload;
        try {
            payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        }
        catch {
            throw new errors_1.UnauthorizedError('Refresh token tidak valid atau kadaluarsa');
        }
        const storedToken = await prisma_1.prisma.refreshToken.findFirst({
            where: { userId: payload.userId },
            orderBy: { createdAt: 'desc' },
        });
        if (!storedToken)
            throw new errors_1.UnauthorizedError('Refresh token tidak ditemukan');
        if (storedToken.revokedAt)
            throw new errors_1.UnauthorizedError('Refresh token sudah dicabut');
        if (storedToken.expiresAt < new Date())
            throw new errors_1.UnauthorizedError('Refresh token kadaluarsa');
        const tokenMatch = await bcryptjs_1.default.compare(refreshToken, storedToken.tokenHash);
        if (!tokenMatch)
            throw new errors_1.UnauthorizedError('Refresh token tidak valid');
        await prisma_1.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revokedAt: new Date() },
        });
        const newPayload = { userId: payload.userId, email: payload.email, role: payload.role };
        const newAccessToken = (0, jwt_1.generateAccessToken)(newPayload);
        const newRefreshToken = (0, jwt_1.generateRefreshToken)(newPayload);
        await this.storeRefreshToken(payload.userId, newRefreshToken);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    async logout(refreshToken) {
        try {
            const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
            await prisma_1.prisma.refreshToken.updateMany({
                where: { userId: payload.userId, revokedAt: null },
                data: { revokedAt: new Date() },
            });
        }
        catch {
            // ignore invalid tokens on logout
        }
    }
    async me(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, nama: true, email: true, role: true, poinHijau: true, createdAt: true },
        });
        if (!user)
            throw new errors_1.UnauthorizedError('User tidak ditemukan');
        return user;
    }
    async storeRefreshToken(userId, refreshToken) {
        const tokenHash = await bcryptjs_1.default.hash(refreshToken, 10);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await prisma_1.prisma.refreshToken.create({
            data: { userId, tokenHash, expiresAt },
        });
    }
    async createAdminUser(data) {
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser)
            throw new errors_1.ConflictError('Email sudah terdaftar');
        const passwordHash = await bcryptjs_1.default.hash(data.password, 12);
        return prisma_1.prisma.user.create({
            data: {
                nama: data.nama,
                email: data.email,
                passwordHash,
                role: 'admin',
            },
        });
    }
    async createTechnician(data) {
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser)
            throw new errors_1.ConflictError('Email sudah terdaftar');
        const passwordHash = await bcryptjs_1.default.hash(data.password, 12);
        return prisma_1.prisma.user.create({
            data: {
                nama: data.nama,
                email: data.email,
                passwordHash,
                role: 'teknisi',
            },
        });
    }
    async createRecycler(data) {
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser)
            throw new errors_1.ConflictError('Email sudah terdaftar');
        const passwordHash = await bcryptjs_1.default.hash(data.password, 12);
        return prisma_1.prisma.user.create({
            data: {
                nama: data.nama,
                email: data.email,
                passwordHash,
                role: 'recycler',
            },
        });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=authService.js.map