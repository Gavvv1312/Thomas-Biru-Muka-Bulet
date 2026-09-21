import { Response } from 'express';
import { authService } from '../services/authService';
import { AuthenticatedRequest } from '../middlewares/auth';
import { successResponse } from '../utils/response';

export const authController = {
  register: async (req: AuthenticatedRequest, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json(successResponse(result, 'Registrasi berhasil'));
  },

  login: async (req: AuthenticatedRequest, res: Response) => {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(successResponse(result, 'Login berhasil'));
  },

  refresh: async (req: AuthenticatedRequest, res: Response) => {
    const result = await authService.refresh(req.body.refreshToken);
    res.json(successResponse(result, 'Token berhasil diperbarui'));
  },

  logout: async (req: AuthenticatedRequest, res: Response) => {
    await authService.logout(req.body.refreshToken);
    res.json(successResponse(null, 'Logout berhasil'));
  },

  me: async (req: AuthenticatedRequest, res: Response) => {
    const user = await authService.me(req.user!.userId);
    res.json(successResponse(user, 'Data user berhasil diambil'));
  },
};