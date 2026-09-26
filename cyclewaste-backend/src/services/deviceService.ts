import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { valuationService, ValuationResult } from './valuationService';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';

export class DeviceService {
  async createDevice(userId: string, data: {
    kategori: string;
    merek: string;
    tipe: string;
    tahunRilis: number;
    estimatedWeightGrams: number;
    components: { namaKomponen: string; kondisi: string }[];
  }) {
    return prisma.$transaction(async (tx) => {
      const device = await tx.device.create({
        data: {
          userId,
          kategori: data.kategori,
          merek: data.merek,
          tipe: data.tipe,
          tahunRilis: data.tahunRilis,
          estimatedWeightGrams: data.estimatedWeightGrams,
          components: {
            create: data.components.map((c) => ({
              namaKomponen: c.namaKomponen,
              kondisi: c.kondisi as Prisma.DeviceComponentCreateInput['kondisi'],
            })),
          },
        },
        include: { components: true },
      });

      return device;
    });
  }

  async getDeviceById(deviceId: string, userId: string, role: string) {
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      include: { components: true, valuation: true, transactions: true },
    });

    if (!device) throw new NotFoundError('Device tidak ditemukan');

    const isOwner = device.userId === userId;
    const isAdmin = role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('Tidak berhak mengakses device ini');
    }

    return device;
  }

  async getDevicesByUser(userId: string) {
    return prisma.device.findMany({
      where: { userId },
      include: { components: true, valuation: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createOrGetValuation(deviceId: string, userId: string): Promise<ValuationResult> {
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      include: { components: true, valuation: true },
    });

    if (!device) throw new NotFoundError('Device tidak ditemukan');
    if (device.userId !== userId) throw new ForbiddenError('Device bukan milik Anda');

    if (device.valuation) {
      return {
        estimasiNilaiMin: device.valuation.estimasiNilaiMin,
        estimasiNilaiMax: device.valuation.estimasiNilaiMax,
        jalurRekomendasi: device.valuation.jalurRekomendasi,
        usableComponents: (device.valuation.breakdown as any[])
          .filter((b: any) => b.faktor_kondisi > 0)
          .map((b: any) => b.nama_komponen),
        breakdown: (device.valuation.breakdown as any[]).map((b: any) => ({
          namaKomponen: b.nama_komponen,
          kondisi: b.kondisi,
          nilaiDasar: b.nilai_dasar,
          faktorKondisi: b.faktor_kondisi,
          nilaiKomponen: b.nilai_komponen,
        })),
        disclaimer: 'Nilai di atas adalah estimasi. Harga final diverifikasi teknisi setelah pemeriksaan fisik.',
      };
    }

    const result = valuationService.calculate({
      kategori: device.kategori,
      tahunRilis: device.tahunRilis,
      components: device.components.map((c) => ({
        namaKomponen: c.namaKomponen,
        kondisi: c.kondisi,
      })),
    });

    await prisma.valuation.create({
      data: {
        deviceId,
        estimasiNilaiMin: result.estimasiNilaiMin,
        estimasiNilaiMax: result.estimasiNilaiMax,
        jalurRekomendasi: result.jalurRekomendasi,
        breakdown: valuationService.formatBreakdownForStorage(result.breakdown) as Prisma.InputJsonValue,
      },
    });

    return result;
  }

  async getValuation(deviceId: string, userId: string) {
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      include: { valuation: true },
    });

    if (!device) throw new NotFoundError('Device tidak ditemukan');
    if (device.userId !== userId) throw new ForbiddenError('Device bukan milik Anda');
    if (!device.valuation) throw new NotFoundError('Valuasi belum dibuat');

    return {
      estimasiNilaiMin: device.valuation.estimasiNilaiMin,
      estimasiNilaiMax: device.valuation.estimasiNilaiMax,
      jalurRekomendasi: device.valuation.jalurRekomendasi,
      usableComponents: (device.valuation.breakdown as any[])
        .filter((b: any) => b.faktor_kondisi > 0)
        .map((b: any) => b.nama_komponen),
      breakdown: device.valuation.breakdown,
      disclaimer: 'Nilai di atas adalah estimasi. Harga final diverifikasi teknisi setelah pemeriksaan fisik.',
    };
  }
}

export const deviceService = new DeviceService();