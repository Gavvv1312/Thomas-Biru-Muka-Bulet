import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';

export class DropOffService {
  async getDropOffPoints(filters?: { tipe?: string; partnerId?: string }) {
    const where: Prisma.DropOffPointWhereInput = {};

    if (filters?.tipe) where.tipe = filters.tipe as Prisma.DropOffPointWhereInput['tipe'];
    if (filters?.partnerId) where.partnerId = filters.partnerId;

    return prisma.dropOffPoint.findMany({
      where,
      include: { partner: { select: { id: true, nama: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDropOffPoint(partnerId: string, data: {
    namaLokasi: string;
    latitude: number;
    longitude: number;
    tipe: 'repair_shop' | 'recycling_center';
  }) {
    const partner = await prisma.user.findUnique({ where: { id: partnerId } });
    if (!partner) throw new NotFoundError('Partner tidak ditemukan');
    if (partner.role !== 'teknisi' && partner.role !== 'recycler') {
      throw new BadRequestError('Hanya teknisi atau recycler yang bisa membuat drop-off point');
    }

    return prisma.dropOffPoint.create({
      data: {
        namaLokasi: data.namaLokasi,
        latitude: data.latitude,
        longitude: data.longitude,
        tipe: data.tipe,
        partnerId,
      },
      include: { partner: { select: { id: true, nama: true, role: true } } },
    });
  }

  async updateDropOffPoint(dropOffId: string, partnerId: string, data: {
    namaLokasi?: string;
    latitude?: number;
    longitude?: number;
    tipe?: 'repair_shop' | 'recycling_center';
  }) {
    const dropOff = await prisma.dropOffPoint.findUnique({ where: { id: dropOffId } });
    if (!dropOff) throw new NotFoundError('Drop-off point tidak ditemukan');
    if (dropOff.partnerId !== partnerId) throw new ForbiddenError('Bukan pemilik drop-off point ini');

    return prisma.dropOffPoint.update({
      where: { id: dropOffId },
      data,
      include: { partner: { select: { id: true, nama: true, role: true } } },
    });
  }

  async deleteDropOffPoint(dropOffId: string, partnerId: string) {
    const dropOff = await prisma.dropOffPoint.findUnique({ where: { id: dropOffId } });
    if (!dropOff) throw new NotFoundError('Drop-off point tidak ditemukan');
    if (dropOff.partnerId !== partnerId) throw new ForbiddenError('Bukan pemilik drop-off point ini');

    await prisma.dropOffPoint.delete({ where: { id: dropOffId } });
    return { message: 'Drop-off point berhasil dihapus' };
  }
}

export const dropOffService = new DropOffService();