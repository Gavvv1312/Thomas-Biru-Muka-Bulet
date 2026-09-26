import { describe, it, expect } from 'vitest';
import { ValuationService } from '../src/services/valuationService';

describe('ValuationService', () => {
  const service = new ValuationService();

  describe('buyback recommendation', () => {
    it('rekomendasikan buyback jika ada komponen baik', () => {
      const result = service.calculate({
        kategori: 'smartphone',
        tahunRilis: 2021,
        components: [
          { namaKomponen: 'layar', kondisi: 'rusak_berat' },
          { namaKomponen: 'baterai', kondisi: 'baik' },
          { namaKomponen: 'motherboard', kondisi: 'baik' },
        ],
      });

      expect(result.jalurRekomendasi).toBe('buyback');
      expect(result.usableComponents).toContain('baterai');
      expect(result.usableComponents).toContain('motherboard');
      expect(result.usableComponents).not.toContain('layar');
    });

    it('rekomendasikan buyback jika ada komponen rusak_ringan', () => {
      const result = service.calculate({
        kategori: 'laptop',
        tahunRilis: 2022,
        components: [
          { namaKomponen: 'motherboard', kondisi: 'rusak_berat' },
          { namaKomponen: 'ram', kondisi: 'rusak_ringan' },
          { namaKomponen: 'storage', kondisi: 'mati' },
        ],
      });

      expect(result.jalurRekomendasi).toBe('buyback');
      expect(result.usableComponents).toContain('ram');
    });

    it('cakup komponen baik TIDAK memakai threshold persentase', () => {
      // Semua nilai sangat kecil, tapi tetap ada komponen baik -> tetap buyback
      const result = service.calculate({
        kategori: 'smartphone',
        tahunRilis: 2000,
        components: [
          { namaKomponen: 'speaker', kondisi: 'baik' },
          { namaKomponen: 'layar', kondisi: 'mati' },
          { namaKomponen: 'baterai', kondisi: 'mati' },
        ],
      });
      expect(result.jalurRekomendasi).toBe('buyback');
    });
  });

  describe('recycle recommendation', () => {
    it('rekomendasikan recycle jika semua komponen rusak_berat/mati', () => {
      const result = service.calculate({
        kategori: 'smartphone',
        tahunRilis: 2019,
        components: [
          { namaKomponen: 'layar', kondisi: 'mati' },
          { namaKomponen: 'baterai', kondisi: 'rusak_berat' },
          { namaKomponen: 'motherboard', kondisi: 'rusak_berat' },
        ],
      });

      expect(result.jalurRekomendasi).toBe('recycle');
      expect(result.usableComponents).toHaveLength(0);
    });

    it('rekomendasikan recycle jika semua komponen mati', () => {
      const result = service.calculate({
        kategori: 'laptop',
        tahunRilis: 2015,
        components: [
          { namaKomponen: 'motherboard', kondisi: 'mati' },
          { namaKomponen: 'ram', kondisi: 'mati' },
          { namaKomponen: 'screen', kondisi: 'mati' },
        ],
      });

      expect(result.jalurRekomendasi).toBe('recycle');
      expect(result.usableComponents).toHaveLength(0);
    });
  });

  describe('perhitungan nilai', () => {
    it('hitung nilai komponen = nilai_dasar x faktor_kondisi', () => {
      const result = service.calculate({
        kategori: 'smartphone',
        tahunRilis: new Date().getFullYear(),
        components: [{ namaKomponen: 'motherboard', kondisi: 'baik' }],
      });

      // motherboard smartphone = 250000, faktor baik = 1.0, umur 0 tahun
      // nilai = 250000 * 1.0 = 250000, tanpa depresiasi (umur 0)
      const expected = 250000;
      expect(result.breakdown[0].nilaiKomponen).toBe(250000);
      // range margin 15%
      expect(result.estimasiNilaiMin).toBe(Math.round(expected * 0.85));
      expect(result.estimasiNilaiMax).toBe(Math.round(expected * 1.15));
    });

    it('terapkan depresiasi umur (max 60%)', () => {
      const result = service.calculate({
        kategori: 'smartphone',
        tahunRilis: 1990, // umur sangat besar
        components: [{ namaKomponen: 'motherboard', kondisi: 'baik' }],
      });

      // usia > 12 tahun => depresiasi max 0.6
      // nilai = 250000 * (1 - 0.6) = 100000
      expect(result.estimasiNilaiMin).toBe(Math.round(100000 * 0.85));
      expect(result.estimasiNilaiMax).toBe(Math.round(100000 * 1.15));
    });

    it('komponen mati bernilai 0', () => {
      const result = service.calculate({
        kategori: 'smartphone',
        tahunRilis: new Date().getFullYear(),
        components: [{ namaKomponen: 'motherboard', kondisi: 'mati' }],
      });

      expect(result.breakdown[0].nilaiKomponen).toBe(0);
      expect(result.estimasiNilaiMin).toBe(0);
      expect(result.estimasiNilaiMax).toBe(0);
    });

    it('kategori tidak dikenal menghasilkan nilai 0', () => {
      const result = service.calculate({
        kategori: 'kulkas', // tidak ada di rules
        tahunRilis: new Date().getFullYear(),
        components: [{ namaKomponen: 'kompresor', kondisi: 'baik' }],
      });

      expect(result.breakdown[0].nilaiDasar).toBe(0);
      expect(result.breakdown[0].nilaiKomponen).toBe(0);
    });

    it('selalu menghasilkan range (min <= max)', () => {
      const result = service.calculate({
        kategori: 'laptop',
        tahunRilis: 2020,
        components: [
          { namaKomponen: 'ram', kondisi: 'baik' },
          { namaKomponen: 'storage', kondisi: 'rusak_ringan' },
        ],
      });

      expect(result.estimasiNilaiMin).toBeLessThanOrEqual(result.estimasiNilaiMax);
      expect(typeof result.estimasiNilaiMin).toBe('number');
      expect(typeof result.estimasiNilaiMax).toBe('number');
    });
  });

  describe('disclaimer', () => {
    it('selalu menyertakan disclaimer estimasi', () => {
      const result = service.calculate({
        kategori: 'smartphone',
        tahunRilis: 2021,
        components: [{ namaKomponen: 'layar', kondisi: 'baik' }],
      });

      expect(result.disclaimer).toContain('estimasi');
      expect(result.disclaimer).toContain('diverifikasi');
    });
  });
});