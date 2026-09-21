"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.dropOffPointQuerySchema = exports.dropOffPointCreateSchema = exports.completeBuybackSchema = exports.verificationSchema = exports.technicianOfferSchema = exports.transactionCreateSchema = exports.deviceCreateSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        nama: zod_1.z.string().min(2, 'Nama minimal 2 karakter'),
        email: zod_1.z.string().email('Email tidak valid'),
        password: zod_1.z.string().min(6, 'Password minimal 6 karakter'),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Email tidak valid'),
        password: zod_1.z.string().min(1, 'Password wajib diisi'),
    }),
});
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, 'Refresh token wajib diisi'),
    }),
});
exports.deviceCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        kategori: zod_1.z.string().min(1, 'Kategori wajib diisi'),
        merek: zod_1.z.string().min(1, 'Merek wajib diisi'),
        tipe: zod_1.z.string().min(1, 'Tipe wajib diisi'),
        tahun_rilis: zod_1.z.number().int().min(1990).max(new Date().getFullYear() + 1),
        estimated_weight_grams: zod_1.z.number().int().positive('Berat estimasi harus positif'),
        components: zod_1.z.array(zod_1.z.object({
            nama_komponen: zod_1.z.string().min(1, 'Nama komponen wajib diisi'),
            kondisi: zod_1.z.enum(['baik', 'rusak_ringan', 'rusak_berat', 'mati']),
        })).min(1, 'Minimal 1 komponen'),
    }),
});
exports.transactionCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        device_id: zod_1.z.string().cuid('Device ID tidak valid'),
        partner_id: zod_1.z.string().cuid('Partner ID tidak valid'),
        jalur: zod_1.z.enum(['buyback', 'recycle']),
    }),
});
exports.technicianOfferSchema = zod_1.z.object({
    body: zod_1.z.object({
        harga_tawar: zod_1.z.number().min(0, 'Harga tawar tidak boleh negatif'),
    }),
});
exports.verificationSchema = zod_1.z.object({
    body: zod_1.z.object({
        verified_weight_grams: zod_1.z.number().int().positive('Berat verifikasi harus positif'),
        verification_notes: zod_1.z.string().optional(),
    }),
});
exports.completeBuybackSchema = zod_1.z.object({
    body: zod_1.z.object({
        harga_final: zod_1.z.number().positive('Harga final harus positif'),
    }),
});
exports.dropOffPointCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        nama_lokasi: zod_1.z.string().min(1, 'Nama lokasi wajib diisi'),
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180),
        tipe: zod_1.z.enum(['repair_shop', 'recycling_center']),
    }),
});
exports.dropOffPointQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        tipe: zod_1.z.enum(['repair_shop', 'recycling_center']).optional(),
        partner_id: zod_1.z.string().cuid().optional(),
    }),
});
exports.idParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().cuid('ID tidak valid'),
    }),
});
//# sourceMappingURL=schemas.js.map