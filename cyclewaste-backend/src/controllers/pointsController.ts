import { Response } from 'express';
import { pointsService } from '../services/pointsService';
import { AuthenticatedRequest } from '../middlewares/auth';
import { successResponse } from '../utils/response';

export const pointsController = {
  getPoints: async (req: AuthenticatedRequest, res: Response) => {
    const targetUserId = req.params.id;
    const result = await pointsService.getUserPoints(targetUserId, req.user!.userId, req.user!.role);
    res.json(successResponse(result, 'Poin berhasil diambil'));
  },

  getPointsHistory: async (req: AuthenticatedRequest, res: Response) => {
    const targetUserId = req.params.id;
    const history = await pointsService.getPointsHistory(targetUserId, req.user!.userId, req.user!.role);
    res.json(successResponse(history, 'Riwayat poin berhasil diambil'));
  },
};