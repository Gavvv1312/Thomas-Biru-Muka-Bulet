import { Prisma } from '@prisma/client';
import { ValuationResult } from './valuationService';
export declare class DeviceService {
    createDevice(userId: string, data: {
        kategori: string;
        merek: string;
        tipe: string;
        tahunRilis: number;
        estimatedWeightGrams: number;
        components: {
            namaKomponen: string;
            kondisi: string;
        }[];
    }): Promise<{
        components: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            kondisi: import(".prisma/client").$Enums.ComponentCondition;
            namaKomponen: string;
            deviceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        kategori: string;
        merek: string;
        tipe: string;
        tahunRilis: number;
        estimatedWeightGrams: number;
    }>;
    getDeviceById(deviceId: string, userId: string, role: string): Promise<{
        valuation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deviceId: string;
            estimasiNilaiMin: number;
            estimasiNilaiMax: number;
            jalurRekomendasi: import(".prisma/client").$Enums.ValuationChannel;
            breakdown: Prisma.JsonValue;
        } | null;
        components: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            kondisi: import(".prisma/client").$Enums.ComponentCondition;
            namaKomponen: string;
            deviceId: string;
        }[];
        transactions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.TransactionStatus;
            jalur: import(".prisma/client").$Enums.TransactionChannel;
            deviceId: string;
            partnerId: string;
            hargaTawar: number | null;
            hargaFinal: number | null;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            verifiedWeightGrams: number | null;
            verificationNotes: string | null;
            certificateData: Prisma.JsonValue | null;
            completedAt: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        kategori: string;
        merek: string;
        tipe: string;
        tahunRilis: number;
        estimatedWeightGrams: number;
    }>;
    getDevicesByUser(userId: string): Promise<({
        valuation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deviceId: string;
            estimasiNilaiMin: number;
            estimasiNilaiMax: number;
            jalurRekomendasi: import(".prisma/client").$Enums.ValuationChannel;
            breakdown: Prisma.JsonValue;
        } | null;
        components: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            kondisi: import(".prisma/client").$Enums.ComponentCondition;
            namaKomponen: string;
            deviceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        kategori: string;
        merek: string;
        tipe: string;
        tahunRilis: number;
        estimatedWeightGrams: number;
    })[]>;
    createOrGetValuation(deviceId: string, userId: string): Promise<ValuationResult>;
    getValuation(deviceId: string, userId: string): Promise<{
        estimasiNilaiMin: number;
        estimasiNilaiMax: number;
        jalurRekomendasi: import(".prisma/client").$Enums.ValuationChannel;
        usableComponents: any[];
        breakdown: Prisma.JsonValue;
        disclaimer: string;
    }>;
}
export declare const deviceService: DeviceService;
//# sourceMappingURL=deviceService.d.ts.map