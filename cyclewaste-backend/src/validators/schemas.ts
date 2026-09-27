import { z } from 'zod';
import { TransactionStatus } from '@prisma/client';

export const registerSchema = z.object({
  body: z.object({
    nama: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(1, 'Password wajib diisi'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token wajib diisi'),
  }),
});

export const deviceCreateSchema = z.object({
  body: z.object({
    kategori: z.string().min(1, 'Kategori wajib diisi'),
    merek: z.string().min(1, 'Merek wajib diisi'),
    tipe: z.string().min(1, 'Tipe wajib diisi'),
    tahun_rilis: z.number().int().min(1990).max(new Date().getFullYear() + 1),
    estimated_weight_grams: z.number().int().positive('Berat estimasi harus positif'),
    components: z.array(
      z.object({
        nama_komponen: z.string().min(1, 'Nama komponen wajib diisi'),
        kondisi: z.enum(['baik', 'rusak_ringan', 'rusak_berat', 'mati']),
      })
    ).min(1, 'Minimal 1 komponen'),
  }),
});

export const transactionCreateSchema = z.object({
  body: z.object({
    device_id: z.string().cuid('Device ID tidak valid'),
    partner_id: z.string().cuid('Partner ID tidak valid'),
    jalur: z.enum(['buyback', 'recycle']),
  }),
});

export const technicianOfferSchema = z.object({
  body: z.object({
    harga_tawar: z.number().min(0, 'Harga tawar tidak boleh negatif'),
  }),
});

export const verificationSchema = z.object({
  body: z.object({
    verified_weight_grams: z.number().int().positive('Berat verifikasi harus positif'),
    verification_notes: z.string().optional(),
  }),
});

export const completeBuybackSchema = z.object({
  body: z.object({
    // Opsional agar jalur recycle (body kosong) tetap lolos;
    // kewajiban harga_final untuk buyback tetap ditegakkan di transactionService.
    harga_final: z.number().positive('Harga final harus positif').optional(),
  }),
});

export const transactionListQuerySchema = z.object({
  query: z.object({
    status: z.nativeEnum(TransactionStatus).optional(),
  }),
});

export const dropOffPointCreateSchema = z.object({
  body: z.object({
    nama_lokasi: z.string().min(1, 'Nama lokasi wajib diisi'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    tipe: z.enum(['repair_shop', 'recycling_center']),
    alamat: z.string().optional(),
  }),
});

export const dropOffPointUpdateSchema = z.object({
  body: z.object({
    nama_lokasi: z.string().min(1).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    tipe: z.enum(['repair_shop', 'recycling_center']).optional(),
    alamat: z.string().optional(),
  }),
});

export const dropOffPointQuerySchema = z.object({
  query: z.object({
    tipe: z.enum(['repair_shop', 'recycling_center']).optional(),
    partner_id: z.string().cuid().optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().cuid('ID tidak valid'),
  }),
});