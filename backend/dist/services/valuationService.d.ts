import { Prisma } from '@prisma/client';
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
export declare class ValuationService {
    calculate(device: {
        kategori: string;
        tahunRilis: number;
        components: {
            namaKomponen: string;
            kondisi: string;
        }[];
    }): ValuationResult;
    formatBreakdownForStorage(breakdown: ComponentValuation[]): Prisma.JsonValue;
}
export declare const valuationService: ValuationService;
//# sourceMappingURL=valuationService.d.ts.map