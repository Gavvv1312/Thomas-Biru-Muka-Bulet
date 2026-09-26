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
    const { nama_lokasi, latitude, longitude, tipe, alamat } = req.body;
    const point = await dropOffService.createDropOffPoint(req.user!.userId, {
      namaLokasi: nama_lokasi,
      latitude,
      longitude,
      tipe,
      alamat,
    });
    res.status(201).json(successResponse(point, 'Drop-off point berhasil dibuat'));
  },

  updateDropOffPoint: async (req: AuthenticatedRequest, res: Response) => {
    const { nama_lokasi, latitude, longitude, tipe, alamat } = req.body;
    const patch: Record<string, unknown> = {};
    if (nama_lokasi !== undefined) patch.namaLokasi = nama_lokasi;
    if (latitude !== undefined) patch.latitude = latitude;
    if (longitude !== undefined) patch.longitude = longitude;
    if (tipe !== undefined) patch.tipe = tipe;
    if (alamat !== undefined) patch.alamat = alamat;

    const point = await dropOffService.updateDropOffPoint(req.params.id, req.user!.userId, patch);
    res.json(successResponse(point, 'Drop-off point berhasil diperbarui'));
  },

  deleteDropOffPoint: async (req: AuthenticatedRequest, res: Response) => {
    const result = await dropOffService.deleteDropOffPoint(req.params.id, req.user!.userId);
    res.json(successResponse(result, 'Drop-off point berhasil dihapus'));
  },
};