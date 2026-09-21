"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = exports.DashboardService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
class DashboardService {
    async getUserDashboard(userId, requestingUserId, role) {
        if (role !== 'admin' && userId !== requestingUserId) {
            throw new errors_1.ForbiddenError('Tidak berhak mengakses dashboard user lain');
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { poinHijau: true },
        });
        if (!user)
            throw new errors_1.NotFoundError('User tidak ditemukan');
        const [totalDevices, completedTransactions, buybackTransactions, recycleTransactions, latestTransactions, latestPointsHistory,] = await Promise.all([
            prisma_1.prisma.device.count({ where: { userId } }),
            prisma_1.prisma.transaction.count({ where: { userId, status: 'selesai' } }),
            prisma_1.prisma.transaction.count({ where: { userId, status: 'selesai', jalur: 'buyback' } }),
            prisma_1.prisma.transaction.count({ where: { userId, status: 'selesai', jalur: 'recycle' } }),
            prisma_1.prisma.transaction.findMany({
                where: { userId },
                include: { device: { select: { kategori: true, merek: true, tipe: true } } },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
            prisma_1.prisma.pointsTransaction.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
        ]);
        const verifiedWeightResult = await prisma_1.prisma.transaction.aggregate({
            where: { userId, status: 'selesai', verifiedWeightGrams: { not: null } },
            _sum: { verifiedWeightGrams: true },
        });
        const totalVerifiedWeight = verifiedWeightResult._sum.verifiedWeightGrams || 0;
        return {
            poinHijau: user.poinHijau,
            totalDevices,
            totalCompletedTransactions: completedTransactions,
            totalBuyback: buybackTransactions,
            totalRecycle: recycleTransactions,
            totalVerifiedEwasteWeightGrams: totalVerifiedWeight,
            latestTransactions: latestTransactions.map((t) => ({
                id: t.id,
                device: t.device,
                jalur: t.jalur,
                status: t.status,
                hargaFinal: t.hargaFinal,
                verifiedWeightGrams: t.verifiedWeightGrams,
                createdAt: t.createdAt,
                completedAt: t.completedAt,
            })),
            latestPointsHistory: latestPointsHistory.map((p) => ({
                id: p.id,
                amount: p.amount,
                source: p.source,
                referenceId: p.referenceId,
                createdAt: p.createdAt,
            })),
        };
    }
}
exports.DashboardService = DashboardService;
exports.dashboardService = new DashboardService();
//# sourceMappingURL=dashboardService.js.map