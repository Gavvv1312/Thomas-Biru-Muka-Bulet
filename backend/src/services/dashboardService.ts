import { prisma } from '../utils/prisma';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class DashboardService {
  async getUserDashboard(userId: string, requestingUserId: string, role: string) {
    if (role !== 'admin' && userId !== requestingUserId) {
      throw new ForbiddenError('Tidak berhak mengakses dashboard user lain');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { poinHijau: true },
    });

    if (!user) throw new NotFoundError('User tidak ditemukan');

    const [
      totalDevices,
      completedTransactions,
      buybackTransactions,
      recycleTransactions,
      latestTransactions,
      latestPointsHistory,
    ] = await Promise.all([
      prisma.device.count({ where: { userId } }),
      prisma.transaction.count({ where: { userId, status: 'selesai' } }),
      prisma.transaction.count({ where: { userId, status: 'selesai', jalur: 'buyback' } }),
      prisma.transaction.count({ where: { userId, status: 'selesai', jalur: 'recycle' } }),
      prisma.transaction.findMany({
        where: { userId },
        include: { device: { select: { kategori: true, merek: true, tipe: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.pointsTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    const verifiedWeightResult = await prisma.transaction.aggregate({
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

export const dashboardService = new DashboardService();