import { Response } from 'express';
import { TransactionStatus, UserRole } from '@prisma/client';
import { transactionService } from '../services/transactionService';
import { AuthenticatedRequest } from '../middlewares/auth';
import { successResponse } from '../utils/response';

export const transactionController = {
  createTransaction: async (req: AuthenticatedRequest, res: Response) => {
    const transaction = await transactionService.createTransaction({
      deviceId: req.body.device_id,
      partnerId: req.body.partner_id,
      jalur: req.body.jalur,
      userId: req.user!.userId,
    });
    res.status(201).json(successResponse(transaction, 'Transaksi berhasil dibuat'));
  },

  getTransactions: async (req: AuthenticatedRequest, res: Response) => {
    const { status } = req.query;
    const transactions = await transactionService.getTransactions(
      req.user!.userId,
      req.user!.role as UserRole,
      status ? { status: status as TransactionStatus } : undefined
    );
    res.json(successResponse(transactions, 'Daftar transaksi berhasil diambil'));
  },

  getTransactionById: async (req: AuthenticatedRequest, res: Response) => {
    const transaction = await transactionService.getTransactionById(req.params.id, req.user!.userId, req.user!.role as UserRole);
    res.json(successResponse(transaction, 'Transaksi berhasil diambil'));
  },

  makeOffer: async (req: AuthenticatedRequest, res: Response) => {
    const transaction = await transactionService.makeOffer(req.params.id, req.user!.userId, req.body.harga_tawar);
    res.json(successResponse(transaction, 'Tawaran harga berhasil dikirim'));
  },

  verify: async (req: AuthenticatedRequest, res: Response) => {
    const transaction = await transactionService.verify(req.params.id, req.user!.userId, {
      verifiedWeightGrams: req.body.verified_weight_grams,
      verificationNotes: req.body.verification_notes,
    });
    res.json(successResponse(transaction, 'Verifikasi fisik berhasil'));
  },

  complete: async (req: AuthenticatedRequest, res: Response) => {
    const result = await transactionService.complete(req.params.id, req.user!.userId, {
      hargaFinal: req.body.harga_final,
    });
    res.json(successResponse(result, 'Transaksi berhasil diselesaikan'));
  },

  cancel: async (req: AuthenticatedRequest, res: Response) => {
    const transaction = await transactionService.cancel(req.params.id, req.user!.userId);
    res.json(successResponse(transaction, 'Transaksi dibatalkan'));
  },
};