"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionService = exports.TransactionService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const valuationRules_1 = require("../config/valuationRules");
class TransactionService {
    async createTransaction(data) {
        const device = await prisma_1.prisma.device.findUnique({
            where: { id: data.deviceId },
            include: { valuation: true },
        });
        if (!device)
            throw new errors_1.NotFoundError('Device tidak ditemukan');
        if (device.userId !== data.userId)
            throw new errors_1.ForbiddenError('Device bukan milik Anda');
        if (!device.valuation)
            throw new errors_1.BadRequestError('Device belum memiliki valuasi');
        if (device.valuation.jalurRekomendasi !== data.jalur) {
            throw new errors_1.BadRequestError(`Jalur transaksi harus mengikuti rekomendasi: ${device.valuation.jalurRekomendasi}`);
        }
        const partner = await prisma_1.prisma.user.findUnique({ where: { id: data.partnerId } });
        if (!partner)
            throw new errors_1.NotFoundError('Partner tidak ditemukan');
        if (data.jalur === 'buyback' && partner.role !== 'teknisi') {
            throw new errors_1.BadRequestError('Jalur buyback hanya bisa dengan partner teknisi');
        }
        if (data.jalur === 'recycle' && partner.role !== 'recycler') {
            throw new errors_1.BadRequestError('Jalur recycle hanya bisa dengan partner recycler');
        }
        const activeStatuses = ['diajukan', 'ditawar', 'diverifikasi'];
        const existingTransaction = await prisma_1.prisma.transaction.findFirst({
            where: { deviceId: data.deviceId, status: { in: activeStatuses } },
        });
        if (existingTransaction) {
            throw new errors_1.BadRequestError('Device sudah memiliki transaksi aktif');
        }
        return prisma_1.prisma.transaction.create({
            data: {
                deviceId: data.deviceId,
                userId: data.userId,
                partnerId: data.partnerId,
                jalur: data.jalur,
                status: 'diajukan',
                paymentStatus: 'unpaid',
            },
            include: { device: true, user: true, partner: true },
        });
    }
    async makeOffer(transactionId, partnerId, hargaTawar) {
        const transaction = await prisma_1.prisma.transaction.findUnique({ where: { id: transactionId } });
        if (!transaction)
            throw new errors_1.NotFoundError('Transaksi tidak ditemukan');
        if (transaction.partnerId !== partnerId)
            throw new errors_1.ForbiddenError('Bukan partner yang ditugaskan');
        if (transaction.jalur !== 'buyback')
            throw new errors_1.BadRequestError('Tawaran harga hanya untuk jalur buyback');
        if (transaction.status !== 'diajukan')
            throw new errors_1.BadRequestError('Transaksi harus berstatus diajukan');
        if (hargaTawar < 0)
            throw new errors_1.BadRequestError('Harga tawar tidak boleh negatif');
        return prisma_1.prisma.transaction.update({
            where: { id: transactionId },
            data: { hargaTawar, status: 'ditawar' },
            include: { device: true, user: true, partner: true },
        });
    }
    async verify(transactionId, partnerId, data) {
        const transaction = await prisma_1.prisma.transaction.findUnique({ where: { id: transactionId } });
        if (!transaction)
            throw new errors_1.NotFoundError('Transaksi tidak ditemukan');
        if (transaction.partnerId !== partnerId)
            throw new errors_1.ForbiddenError('Bukan partner yang ditugaskan');
        if (transaction.status !== 'diajukan' && transaction.status !== 'ditawar') {
            throw new errors_1.BadRequestError('Transaksi harus berstatus diajukan atau ditawar untuk diverifikasi');
        }
        if (data.verifiedWeightGrams <= 0)
            throw new errors_1.BadRequestError('Berat verifikasi harus lebih dari 0');
        return prisma_1.prisma.transaction.update({
            where: { id: transactionId },
            data: {
                verifiedWeightGrams: data.verifiedWeightGrams,
                verificationNotes: data.verificationNotes,
                status: 'diverifikasi',
            },
            include: { device: true, user: true, partner: true },
        });
    }
    async complete(transactionId, partnerId, body = {}) {
        const transaction = await prisma_1.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { user: true, device: true },
        });
        if (!transaction)
            throw new errors_1.NotFoundError('Transaksi tidak ditemukan');
        if (transaction.partnerId !== partnerId)
            throw new errors_1.ForbiddenError('Bukan partner yang ditugaskan');
        if (transaction.status !== 'diverifikasi')
            throw new errors_1.BadRequestError('Transaksi harus berstatus diverifikasi');
        if (transaction.jalur === 'buyback') {
            return this._completeBuyback(transaction, body.hargaFinal);
        }
        return this._completeRecycle(transaction);
    }
    async _completeBuyback(transaction, hargaFinal) {
        if (!hargaFinal || hargaFinal <= 0) {
            throw new errors_1.BadRequestError('Harga final wajib diisi untuk penyelesaian buyback');
        }
        // Idempotency guard: only transition if still diverifikasi
        const updated = await prisma_1.prisma.transaction.updateMany({
            where: { id: transaction.id, status: 'diverifikasi' },
            data: {
                hargaFinal,
                paymentStatus: 'paid',
                status: 'selesai',
                completedAt: new Date(),
            },
        });
        if (updated.count === 0) {
            throw new errors_1.BadRequestError('Transaksi tidak dapat diselesaikan');
        }
        return prisma_1.prisma.transaction.findUnique({
            where: { id: transaction.id },
            include: { device: true, user: true, partner: true },
        });
    }
    async _completeRecycle(transaction) {
        if (!transaction.verifiedWeightGrams || transaction.verifiedWeightGrams <= 0) {
            throw new errors_1.BadRequestError('Berat verifikasi wajib ada untuk penyelesaian recycle');
        }
        const pointsPer100g = (0, valuationRules_1.getRecyclePointsPer100g)();
        const pointsAwarded = Math.floor(transaction.verifiedWeightGrams / 100) * pointsPer100g;
        const certificateNumber = `ECH-${new Date().getFullYear()}-${transaction.id.slice(-5).toUpperCase()}`;
        const certificateData = {
            certificate_number: certificateNumber,
            recipient_name: transaction.user.nama,
            device_category: transaction.device.kategori,
            verified_weight_grams: transaction.verifiedWeightGrams,
            points_awarded: pointsAwarded,
            issued_at: new Date().toISOString(),
        };
        // Atomically update transaction, award points, and increment user balance.
        // Idempotency: the where clause on status='diverifikasi' prevents double-award.
        return prisma_1.prisma.$transaction(async (tx) => {
            const updated = await tx.transaction.updateMany({
                where: { id: transaction.id, status: 'diverifikasi' },
                data: {
                    status: 'selesai',
                    completedAt: new Date(),
                    certificateData: certificateData,
                },
            });
            if (updated.count === 0) {
                // Already completed or state changed -> prevent duplicate E-Points
                throw new errors_1.BadRequestError('Transaksi sudah selesai, E-Points tidak diberikan dua kali');
            }
            await tx.pointsTransaction.create({
                data: {
                    userId: transaction.userId,
                    amount: pointsAwarded,
                    source: 'recycle',
                    referenceId: transaction.id,
                },
            });
            await tx.user.update({
                where: { id: transaction.userId },
                data: { poinHijau: { increment: pointsAwarded } },
            });
            const finalTransaction = await tx.transaction.findUnique({
                where: { id: transaction.id },
                include: { device: true, user: true, partner: true },
            });
            return {
                transaction: finalTransaction,
                pointsAwarded,
                certificateData,
            };
        });
    }
    async cancel(transactionId, userId) {
        const transaction = await prisma_1.prisma.transaction.findUnique({ where: { id: transactionId } });
        if (!transaction)
            throw new errors_1.NotFoundError('Transaksi tidak ditemukan');
        const isOwner = transaction.userId === userId;
        const isAssignedPartner = transaction.partnerId === userId;
        if (!isOwner && !isAssignedPartner) {
            throw new errors_1.ForbiddenError('Tidak berhak membatalkan transaksi ini');
        }
        const cancellableStatuses = ['diajukan', 'ditawar', 'diverifikasi'];
        if (!cancellableStatuses.includes(transaction.status)) {
            throw new errors_1.BadRequestError(`Transaksi berstatus ${transaction.status} tidak dapat dibatalkan`);
        }
        return prisma_1.prisma.transaction.update({
            where: { id: transactionId },
            data: { status: 'dibatalkan' },
            include: { device: true, user: true, partner: true },
        });
    }
    async getTransactions(userId, role, filters) {
        const where = {};
        if (role === 'owner')
            where.userId = userId;
        else if (role === 'teknisi' || role === 'recycler')
            where.partnerId = userId;
        // admin sees all
        if (filters?.status)
            where.status = filters.status;
        return prisma_1.prisma.transaction.findMany({
            where,
            include: { device: true, user: true, partner: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getTransactionById(transactionId, userId, role) {
        const transaction = await prisma_1.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { device: true, user: true, partner: true },
        });
        if (!transaction)
            throw new errors_1.NotFoundError('Transaksi tidak ditemukan');
        const isOwner = transaction.userId === userId;
        const isPartner = transaction.partnerId === userId;
        const isAdmin = role === 'admin';
        if (!isOwner && !isPartner && !isAdmin) {
            throw new errors_1.ForbiddenError('Tidak berhak mengakses transaksi ini');
        }
        return transaction;
    }
}
exports.TransactionService = TransactionService;
exports.transactionService = new TransactionService();
//# sourceMappingURL=transactionService.js.map