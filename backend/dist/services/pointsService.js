"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointsService = exports.PointsService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
class PointsService {
    async getUserPoints(userId, requestingUserId, role) {
        if (role !== 'admin' && userId !== requestingUserId) {
            throw new errors_1.NotFoundError('Tidak berhak mengakses poin user lain');
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { poinHijau: true },
        });
        if (!user)
            throw new errors_1.NotFoundError('User tidak ditemukan');
        const history = await prisma_1.prisma.pointsTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return {
            poinHijau: user.poinHijau,
            history,
        };
    }
    async getPointsHistory(userId, requestingUserId, role) {
        if (role !== 'admin' && userId !== requestingUserId) {
            throw new errors_1.NotFoundError('Tidak berhak mengakses riwayat poin user lain');
        }
        return prisma_1.prisma.pointsTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.PointsService = PointsService;
exports.pointsService = new PointsService();
//# sourceMappingURL=pointsService.js.map