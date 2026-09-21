"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceService = exports.DeviceService = void 0;
const prisma_1 = require("../utils/prisma");
const valuationService_1 = require("./valuationService");
const errors_1 = require("../utils/errors");
class DeviceService {
    async createDevice(userId, data) {
        return prisma_1.prisma.$transaction(async (tx) => {
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
                            kondisi: c.kondisi,
                        })),
                    },
                },
                include: { components: true },
            });
            return device;
        });
    }
    async getDeviceById(deviceId, userId, role) {
        const device = await prisma_1.prisma.device.findUnique({
            where: { id: deviceId },
            include: { components: true, valuation: true, transactions: true },
        });
        if (!device)
            throw new errors_1.NotFoundError('Device tidak ditemukan');
        const isOwner = device.userId === userId;
        const isAdmin = role === 'admin';
        if (!isOwner && !isAdmin) {
            throw new errors_1.ForbiddenError('Tidak berhak mengakses device ini');
        }
        return device;
    }
    async getDevicesByUser(userId) {
        return prisma_1.prisma.device.findMany({
            where: { userId },
            include: { components: true, valuation: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createOrGetValuation(deviceId, userId) {
        const device = await prisma_1.prisma.device.findUnique({
            where: { id: deviceId },
            include: { components: true, valuation: true },
        });
        if (!device)
            throw new errors_1.NotFoundError('Device tidak ditemukan');
        if (device.userId !== userId)
            throw new errors_1.ForbiddenError('Device bukan milik Anda');
        if (device.valuation) {
            return {
                estimasiNilaiMin: device.valuation.estimasiNilaiMin,
                estimasiNilaiMax: device.valuation.estimasiNilaiMax,
                jalurRekomendasi: device.valuation.jalurRekomendasi,
                usableComponents: device.valuation.breakdown
                    .filter((b) => b.faktor_kondisi > 0)
                    .map((b) => b.nama_komponen),
                breakdown: device.valuation.breakdown.map((b) => ({
                    namaKomponen: b.nama_komponen,
                    kondisi: b.kondisi,
                    nilaiDasar: b.nilai_dasar,
                    faktorKondisi: b.faktor_kondisi,
                    nilaiKomponen: b.nilai_komponen,
                })),
                disclaimer: 'Nilai di atas adalah estimasi. Harga final diverifikasi teknisi setelah pemeriksaan fisik.',
            };
        }
        const result = valuationService_1.valuationService.calculate({
            kategori: device.kategori,
            tahunRilis: device.tahunRilis,
            components: device.components.map((c) => ({
                namaKomponen: c.namaKomponen,
                kondisi: c.kondisi,
            })),
        });
        await prisma_1.prisma.valuation.create({
            data: {
                deviceId,
                estimasiNilaiMin: result.estimasiNilaiMin,
                estimasiNilaiMax: result.estimasiNilaiMax,
                jalurRekomendasi: result.jalurRekomendasi,
                breakdown: valuationService_1.valuationService.formatBreakdownForStorage(result.breakdown),
            },
        });
        return result;
    }
    async getValuation(deviceId, userId) {
        const device = await prisma_1.prisma.device.findUnique({
            where: { id: deviceId },
            include: { valuation: true },
        });
        if (!device)
            throw new errors_1.NotFoundError('Device tidak ditemukan');
        if (device.userId !== userId)
            throw new errors_1.ForbiddenError('Device bukan milik Anda');
        if (!device.valuation)
            throw new errors_1.NotFoundError('Valuasi belum dibuat');
        return {
            estimasiNilaiMin: device.valuation.estimasiNilaiMin,
            estimasiNilaiMax: device.valuation.estimasiNilaiMax,
            jalurRekomendasi: device.valuation.jalurRekomendasi,
            usableComponents: device.valuation.breakdown
                .filter((b) => b.faktor_kondisi > 0)
                .map((b) => b.nama_komponen),
            breakdown: device.valuation.breakdown,
            disclaimer: 'Nilai di atas adalah estimasi. Harga final diverifikasi teknisi setelah pemeriksaan fisik.',
        };
    }
}
exports.DeviceService = DeviceService;
exports.deviceService = new DeviceService();
//# sourceMappingURL=deviceService.js.map