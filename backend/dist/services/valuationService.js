"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valuationService = exports.ValuationService = void 0;
const valuationRules_1 = require("../config/valuationRules");
class ValuationService {
    calculate(device) {
        const currentYear = new Date().getFullYear();
        const age = currentYear - device.tahunRilis;
        const ageDepreciation = Math.min(age * (0, valuationRules_1.getAgeDepreciationPerYear)(), (0, valuationRules_1.getMaxAgeDepreciation)());
        const breakdown = [];
        let subtotal = 0;
        let hasUsableComponent = false;
        const usableComponents = [];
        for (const comp of device.components) {
            const nilaiDasar = (0, valuationRules_1.getComponentBaseValue)(device.kategori, comp.namaKomponen);
            const faktorKondisi = (0, valuationRules_1.getConditionFactor)(comp.kondisi);
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
        const rangeMargin = (0, valuationRules_1.getRangeMargin)();
        const estimasiNilaiMin = Math.round(adjustedValue * (1 - rangeMargin));
        const estimasiNilaiMax = Math.round(adjustedValue * (1 + rangeMargin));
        const jalurRekomendasi = hasUsableComponent ? 'buyback' : 'recycle';
        return {
            estimasiNilaiMin,
            estimasiNilaiMax,
            jalurRekomendasi,
            usableComponents,
            breakdown,
            disclaimer: 'Nilai di atas adalah estimasi. Harga final diverifikasi teknisi setelah pemeriksaan fisik.',
        };
    }
    formatBreakdownForStorage(breakdown) {
        return breakdown.map((b) => ({
            nama_komponen: b.namaKomponen,
            kondisi: b.kondisi,
            nilai_dasar: b.nilaiDasar,
            faktor_kondisi: b.faktorKondisi,
            nilai_komponen: b.nilaiKomponen,
        }));
    }
}
exports.ValuationService = ValuationService;
exports.valuationService = new ValuationService();
//# sourceMappingURL=valuationService.js.map