"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionController = void 0;
const transactionService_1 = require("../services/transactionService");
const response_1 = require("../utils/response");
exports.transactionController = {
    createTransaction: async (req, res) => {
        const transaction = await transactionService_1.transactionService.createTransaction({
            deviceId: req.body.device_id,
            partnerId: req.body.partner_id,
            jalur: req.body.jalur,
            userId: req.user.userId,
        });
        res.status(201).json((0, response_1.successResponse)(transaction, 'Transaksi berhasil dibuat'));
    },
    getTransactions: async (req, res) => {
        const { status } = req.query;
        const transactions = await transactionService_1.transactionService.getTransactions(req.user.userId, req.user.role, status ? { status: status } : undefined);
        res.json((0, response_1.successResponse)(transactions, 'Daftar transaksi berhasil diambil'));
    },
    getTransactionById: async (req, res) => {
        const transaction = await transactionService_1.transactionService.getTransactionById(req.params.id, req.user.userId, req.user.role);
        res.json((0, response_1.successResponse)(transaction, 'Transaksi berhasil diambil'));
    },
    makeOffer: async (req, res) => {
        const transaction = await transactionService_1.transactionService.makeOffer(req.params.id, req.user.userId, req.body.harga_tawar);
        res.json((0, response_1.successResponse)(transaction, 'Tawaran harga berhasil dikirim'));
    },
    verify: async (req, res) => {
        const transaction = await transactionService_1.transactionService.verify(req.params.id, req.user.userId, {
            verifiedWeightGrams: req.body.verified_weight_grams,
            verificationNotes: req.body.verification_notes,
        });
        res.json((0, response_1.successResponse)(transaction, 'Verifikasi fisik berhasil'));
    },
    complete: async (req, res) => {
        const result = await transactionService_1.transactionService.complete(req.params.id, req.user.userId, {
            hargaFinal: req.body.harga_final,
        });
        res.json((0, response_1.successResponse)(result, 'Transaksi berhasil diselesaikan'));
    },
    cancel: async (req, res) => {
        const transaction = await transactionService_1.transactionService.cancel(req.params.id, req.user.userId);
        res.json((0, response_1.successResponse)(transaction, 'Transaksi dibatalkan'));
    },
};
//# sourceMappingURL=transactionController.js.map