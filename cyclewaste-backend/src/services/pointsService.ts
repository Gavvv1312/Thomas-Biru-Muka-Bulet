import { prisma } from '../utils/prisma';
import { NotFoundError } from '../utils/errors';

export class PointsService {
  async getUserPoints(userId: string, requestingUserId: string, role: string) {
    if (role !== 'admin' && userId !== requestingUserId) {
      throw new NotFoundError('Tidak berhak mengakses poin user lain');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { poinHijau: true },
    });

    if (!user) throw new NotFoundError('User tidak ditemukan');

    const history = await prisma.pointsTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      poinHijau: user.poinHijau,
      history,
    };
  }

  async getPointsHistory(userId: string, requestingUserId: string, role: string) {
    if (role !== 'admin' && userId !== requestingUserId) {
      throw new NotFoundError('Tidak berhak mengakses riwayat poin user lain');
    }

    return prisma.pointsTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const pointsService = new PointsService();