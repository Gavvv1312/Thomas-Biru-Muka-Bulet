"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropOffService = exports.DropOffService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
class DropOffService {
    async getDropOffPoints(filters) {
        const where = {};
        if (filters?.tipe)
            where.tipe = filters.tipe;
        if (filters?.partnerId)
            where.partnerId = filters.partnerId;
        return prisma_1.prisma.dropOffPoint.findMany({
            where,
            include: { partner: { select: { id: true, nama: true, role: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createDropOffPoint(partnerId, data) {
        const partner = await prisma_1.prisma.user.findUnique({ where: { id: partnerId } });
        if (!partner)
            throw new errors_1.NotFoundError('Partner tidak ditemukan');
        if (partner.role !== 'teknisi' && partner.role !== 'recycler') {
            throw new errors_1.BadRequestError('Hanya teknisi atau recycler yang bisa membuat drop-off point');
        }
        return prisma_1.prisma.dropOffPoint.create({
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
    async updateDropOffPoint(dropOffId, partnerId, data) {
        const dropOff = await prisma_1.prisma.dropOffPoint.findUnique({ where: { id: dropOffId } });
        if (!dropOff)
            throw new errors_1.NotFoundError('Drop-off point tidak ditemukan');
        if (dropOff.partnerId !== partnerId)
            throw new errors_1.ForbiddenError('Bukan pemilik drop-off point ini');
        return prisma_1.prisma.dropOffPoint.update({
            where: { id: dropOffId },
            data,
            include: { partner: { select: { id: true, nama: true, role: true } } },
        });
    }
    async deleteDropOffPoint(dropOffId, partnerId) {
        const dropOff = await prisma_1.prisma.dropOffPoint.findUnique({ where: { id: dropOffId } });
        if (!dropOff)
            throw new errors_1.NotFoundError('Drop-off point tidak ditemukan');
        if (dropOff.partnerId !== partnerId)
            throw new errors_1.ForbiddenError('Bukan pemilik drop-off point ini');
        await prisma_1.prisma.dropOffPoint.delete({ where: { id: dropOffId } });
        return { message: 'Drop-off point berhasil dihapus' };
    }
}
exports.DropOffService = DropOffService;
exports.dropOffService = new DropOffService();
//# sourceMappingURL=dropOffService.js.map