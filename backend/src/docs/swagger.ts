import { config } from '../config';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'E-Circuit Hub API',
    description: 'Backend API untuk platform reverse logistics e-waste E-Circuit Hub',
    version: '1.0.0',
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api`,
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          nama: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['owner', 'teknisi', 'recycler', 'admin'] },
          poinHijau: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Device: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          kategori: { type: 'string' },
          merek: { type: 'string' },
          tipe: { type: 'string' },
          tahunRilis: { type: 'number' },
          estimatedWeightGrams: { type: 'number' },
          components: { type: 'array', items: { type: 'object' } },
          valuation: { type: 'object', nullable: true },
        },
      },
      Valuation: {
        type: 'object',
        properties: {
          estimasiNilaiMin: { type: 'number' },
          estimasiNilaiMax: { type: 'number' },
          jalurRekomendasi: { type: 'string', enum: ['buyback', 'recycle'] },
          usableComponents: { type: 'array', items: { type: 'string' } },
          breakdown: { type: 'array', items: { type: 'object' } },
          disclaimer: { type: 'string' },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          deviceId: { type: 'string' },
          userId: { type: 'string' },
          partnerId: { type: 'string' },
          jalur: { type: 'string', enum: ['buyback', 'recycle'] },
          status: { type: 'string', enum: ['diajukan', 'ditawar', 'diverifikasi', 'selesai', 'dibatalkan'] },
          hargaTawar: { type: 'number', nullable: true },
          hargaFinal: { type: 'number', nullable: true },
          paymentStatus: { type: 'string', enum: ['unpaid', 'pending', 'paid'] },
          verifiedWeightGrams: { type: 'number', nullable: true },
          verificationNotes: { type: 'string', nullable: true },
          certificateData: { type: 'object', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          completedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      DropOffPoint: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          namaLokasi: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          tipe: { type: 'string', enum: ['repair_shop', 'recycling_center'] },
          partnerId: { type: 'string' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        security: [],
        responses: {
          200: {
            description: 'Server aktif',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrasi user baru (role: owner)',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nama', 'email', 'password'],
                properties: {
                  nama: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Registrasi berhasil' },
          400: { description: 'Validasi error' },
          409: { description: 'Email sudah terdaftar' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login berhasil' },
          401: { description: 'Kredensial salah' },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Token berhasil diperbarui' },
          401: { description: 'Refresh token tidak valid' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout (revoke refresh token)',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Logout berhasil' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Data user saat ini',
        responses: {
          200: { description: 'Data user' },
          401: { description: 'Unauthenticated' },
        },
      },
    },
    '/devices': {
      post: {
        tags: ['Devices'],
        summary: 'Buat device baru',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['kategori', 'merek', 'tipe', 'tahun_rilis', 'estimated_weight_grams', 'components'],
                properties: {
                  kategori: { type: 'string' },
                  merek: { type: 'string' },
                  tipe: { type: 'string' },
                  tahun_rilis: { type: 'number' },
                  estimated_weight_grams: { type: 'number' },
                  components: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['nama_komponen', 'kondisi'],
                      properties: {
                        nama_komponen: { type: 'string' },
                        kondisi: { type: 'string', enum: ['baik', 'rusak_ringan', 'rusak_berat', 'mati'] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Device berhasil dibuat' },
          401: { description: 'Unauthenticated' },
        },
      },
      get: {
        tags: ['Devices'],
        summary: 'Daftar device milik user',
        responses: {
          200: { description: 'Daftar device' },
          401: { description: 'Unauthenticated' },
        },
      },
    },
    '/devices/{id}': {
      get: {
        tags: ['Devices'],
        summary: 'Detail device',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Detail device' },
          401: { description: 'Unauthenticated' },
          403: { description: 'Forbidden' },
          404: { description: 'Not found' },
        },
      },
    },
    '/devices/{id}/valuation': {
      post: {
        tags: ['Valuation'],
        summary: 'Hitung valuasi device',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Valuasi berhasil dihitung' },
          401: { description: 'Unauthenticated' },
          404: { description: 'Not found' },
        },
      },
      get: {
        tags: ['Valuation'],
        summary: 'Ambil valuasi device',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Valuasi' },
          401: { description: 'Unauthenticated' },
          404: { description: 'Not found' },
        },
      },
    },
    '/transactions': {
      post: {
        tags: ['Transactions'],
        summary: 'Buat transaksi baru',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['device_id', 'partner_id', 'jalur'],
                properties: {
                  device_id: { type: 'string' },
                  partner_id: { type: 'string' },
                  jalur: { type: 'string', enum: ['buyback', 'recycle'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Transaksi berhasil dibuat' },
          400: { description: 'Validasi error' },
          401: { description: 'Unauthenticated' },
        },
      },
      get: {
        tags: ['Transactions'],
        summary: 'Daftar transaksi',
        responses: {
          200: { description: 'Daftar transaksi' },
          401: { description: 'Unauthenticated' },
        },
      },
    },
    '/transactions/{id}': {
      get: {
        tags: ['Transactions'],
        summary: 'Detail transaksi',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Detail transaksi' },
          401: { description: 'Unauthenticated' },
          403: { description: 'Forbidden' },
          404: { description: 'Not found' },
        },
      },
    },
    '/transactions/{id}/offer': {
      patch: {
        tags: ['Transactions'],
        summary: 'Teknisi kirim tawaran harga (buyback)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['harga_tawar'],
                properties: {
                  harga_tawar: { type: 'number' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Tawaran berhasil' },
          400: { description: 'Validasi error' },
          401: { description: 'Unauthenticated' },
        },
      },
    },
    '/transactions/{id}/verify': {
      patch: {
        tags: ['Transactions'],
        summary: 'Partner verifikasi fisik',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['verified_weight_grams'],
                properties: {
                  verified_weight_grams: { type: 'number' },
                  verification_notes: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Verifikasi berhasil' },
          400: { description: 'Validasi error' },
          401: { description: 'Unauthenticated' },
        },
      },
    },
    '/transactions/{id}/complete': {
      patch: {
        tags: ['Transactions'],
        summary: 'Selesaikan transaksi',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  harga_final: { type: 'number', description: 'Wajib untuk buyback' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Transaksi selesai' },
          400: { description: 'Validasi error' },
          401: { description: 'Unauthenticated' },
        },
      },
    },
    '/transactions/{id}/cancel': {
      patch: {
        tags: ['Transactions'],
        summary: 'Batalkan transaksi',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Transaksi dibatalkan' },
          400: { description: 'Validasi error' },
          401: { description: 'Unauthenticated' },
        },
      },
    },
    '/users/{id}/points': {
      get: {
        tags: ['Points'],
        summary: 'Ambil poin hijau user',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Poin hijau' },
          401: { description: 'Unauthenticated' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/users/{id}/dashboard': {
      get: {
        tags: ['Dashboard'],
        summary: 'Dashboard user',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Dashboard' },
          401: { description: 'Unauthenticated' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/dropoff-points': {
      get: {
        tags: ['Drop-off Points'],
        summary: 'Daftar drop-off points',
        parameters: [
          { name: 'tipe', in: 'query', schema: { type: 'string', enum: ['repair_shop', 'recycling_center'] } },
          { name: 'partner_id', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Daftar drop-off points' },
          401: { description: 'Unauthenticated' },
        },
      },
      post: {
        tags: ['Drop-off Points'],
        summary: 'Buat drop-off point',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nama_lokasi', 'latitude', 'longitude', 'tipe'],
                properties: {
                  nama_lokasi: { type: 'string' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                  tipe: { type: 'string', enum: ['repair_shop', 'recycling_center'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Drop-off point berhasil dibuat' },
          400: { description: 'Validasi error' },
          401: { description: 'Unauthenticated' },
        },
      },
    },
  },
};