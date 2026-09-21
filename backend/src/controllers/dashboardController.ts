import { Response } from 'express';
import { dashboardService } from '../services/dashboardService';
import { AuthenticatedRequest } from '../middlewares/auth';
import { successResponse } from '../utils/response';

export const dashboardController = {
  getDashboard: async (req: AuthenticatedRequest, res: Response) => {
    const dashboard = await dashboardService.getUserDashboard(req.params.id, req.user!.userId, req.user!.role);
    res.json(successResponse(dashboard, 'Dashboard berhasil diambil'));
  },
};