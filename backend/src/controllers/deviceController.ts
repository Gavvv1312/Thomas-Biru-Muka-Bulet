import { Response } from 'express';
import { deviceService } from '../services/deviceService';
import { AuthenticatedRequest } from '../middlewares/auth';
import { successResponse } from '../utils/response';

export const deviceController = {
  createDevice: async (req: AuthenticatedRequest, res: Response) => {
    const device = await deviceService.createDevice(req.user!.userId, req.body);
    res.status(201).json(successResponse(device, 'Device berhasil dibuat'));
  },

  getDeviceById: async (req: AuthenticatedRequest, res: Response) => {
    const device = await deviceService.getDeviceById(req.params.id, req.user!.userId, req.user!.role);
    res.json(successResponse(device, 'Device berhasil diambil'));
  },

  getMyDevices: async (req: AuthenticatedRequest, res: Response) => {
    const devices = await deviceService.getDevicesByUser(req.user!.userId);
    res.json(successResponse(devices, 'Daftar device berhasil diambil'));
  },

  createValuation: async (req: AuthenticatedRequest, res: Response) => {
    const result = await deviceService.createOrGetValuation(req.params.id, req.user!.userId);
    res.json(successResponse(result, 'Valuasi berhasil dihitung'));
  },

  getValuation: async (req: AuthenticatedRequest, res: Response) => {
    const result = await deviceService.getValuation(req.params.id, req.user!.userId);
    res.json(successResponse(result, 'Valuasi berhasil diambil'));
  },
};