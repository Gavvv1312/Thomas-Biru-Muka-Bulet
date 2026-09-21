import { Response } from 'express';
import { dropOffService } from '../services/dropOffService';
import { AuthenticatedRequest } from '../middlewares/auth';
import { successResponse } from '../utils/response';

export const dropOffController = {
  getDropOffPoints: async (req: AuthenticatedRequest, res: Response) => {
    const { tipe, partner_id } = req.query;
    const points = await dropOffService.getDropOffPoints({
      tipe: tipe as string,
      partnerId: partner_id as string,
    });
    res.json(successResponse(points, 'Daftar drop-off point berhasil diambil'));
  },

  createDropOffPoint: async (req: AuthenticatedRequest, res: Response) => {
    const point = await dropOffService.createDropOffPoint(req.user!.userId, req.body);
    res.status(201).json(successResponse(point, 'Drop-off point berhasil dibuat'));
  },

  updateDropOffPoint: async (req: AuthenticatedRequest, res: Response) => {
    const point = await dropOffService.updateDropOffPoint(req.params.id, req.user!.userId, req.body);
    res.json(successResponse(point, 'Drop-off point berhasil diperbarui'));
  },

  deleteDropOffPoint: async (req: AuthenticatedRequest, res: Response) => {
    const result = await dropOffService.deleteDropOffPoint(req.params.id, req.user!.userId);
    res.json(successResponse(result, 'Drop-off point berhasil dihapus'));
  },
};