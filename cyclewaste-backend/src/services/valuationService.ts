import { Prisma } from '@prisma/client';
import {
  getConditionFactor,
  getComponentBaseValue,
  getAgeDepreciationPerYear,
  getMaxAgeDepreciation,
  getRangeMargin,
} from '../config/valuationRules';

export interface ComponentValuation {
  namaKomponen: string;
  kondisi: string;
  nilaiDasar: number;
  faktorKondisi: number;
  nilaiKomponen: number;
}

export interface ValuationResult {
  estimasiNilaiMin: number;
  estimasiNilaiMax: number;
  jalurRekomendasi: 'buyback' | 'recycle';
  usableComponents: string[];
  breakdown: ComponentValuation[];
  disclaimer: string;
}

export class ValuationService {
  calculate(device: {
    kategori: string;
    tahunRilis: number;
    components: { namaKomponen: string; kondisi: string }[];
  }): ValuationResult {
    const currentYear = new Date().getFullYear();
    const age = currentYear - device.tahunRilis;
    const ageDepreciation = Math.min(
      age * getAgeDepreciationPerYear(),
      getMaxAgeDepreciation()
    );

    const breakdown: ComponentValuation[] = [];
    let subtotal = 0;
    let hasUsableComponent = false;
    const usableComponents: string[] = [];

    for (const comp of device.components) {
      const nilaiDasar = getComponentBaseValue(device.kategori, comp.namaKomponen);
      const faktorKondisi = getConditionFactor(comp.kondisi);
      const nilaiKomponen = nilaiDasar * faktorKondisi;

      breakdown.push({
        namaKomponen: comp.namaKomponen,
        kondisi: comp.kondisi,
        nilaiDasar,
        faktorKondisi,
        nilaiKomponen,
      });

      subtotal += nilaiKomponen;

      if (comp.kondisi === 'baik' || comp.kondisi === 'rusak_ringan') {
        hasUsableComponent = true;
        usableComponents.push(comp.namaKomponen);
      }
    }

    const adjustedValue = subtotal * (1 - ageDepreciation);
    const rangeMargin = getRangeMargin();

    const estimasiNilaiMin = Math.round(adjustedValue * (1 - rangeMargin));
    const estimasiNilaiMax = Math.round(adjustedValue * (1 + rangeMargin));

    const jalurRekomendasi: 'buyback' | 'recycle' = hasUsableComponent ? 'buyback' : 'recycle';

    return {
      estimasiNilaiMin,
      estimasiNilaiMax,
      jalurRekomendasi,
      usableComponents,
      breakdown,
      disclaimer: 'Nilai di atas adalah estimasi. Harga final diverifikasi teknisi setelah pemeriksaan fisik.',
    };
  }

  formatBreakdownForStorage(breakdown: ComponentValuation[]): Prisma.JsonValue {
    return breakdown.map((b) => ({
      nama_komponen: b.namaKomponen,
      kondisi: b.kondisi,
      nilai_dasar: b.nilaiDasar,
      faktor_kondisi: b.faktorKondisi,
      nilai_komponen: b.nilaiKomponen,
    }));
  }
}

export const valuationService = new ValuationService();