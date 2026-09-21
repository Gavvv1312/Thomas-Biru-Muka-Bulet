import { Prisma, TransactionStatus, TransactionChannel, UserRole } from '@prisma/client';
export declare class TransactionService {
    createTransaction(data: {
        deviceId: string;
        userId: string;
        partnerId: string;
        jalur: TransactionChannel;
    }): Promise<{
        user: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
        device: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            kategori: string;
            merek: string;
            tipe: string;
            tahunRilis: number;
            estimatedWeightGrams: number;
        };
        partner: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    }>;
    makeOffer(transactionId: string, partnerId: string, hargaTawar: number): Promise<{
        user: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
        device: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            kategori: string;
            merek: string;
            tipe: string;
            tahunRilis: number;
            estimatedWeightGrams: number;
        };
        partner: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    }>;
    verify(transactionId: string, partnerId: string, data: {
        verifiedWeightGrams: number;
        verificationNotes?: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
        device: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            kategori: string;
            merek: string;
            tipe: string;
            tahunRilis: number;
            estimatedWeightGrams: number;
        };
        partner: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    }>;
    complete(transactionId: string, partnerId: string, body?: {
        hargaFinal?: number;
    }): Promise<({
        user: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
        device: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            kategori: string;
            merek: string;
            tipe: string;
            tahunRilis: number;
            estimatedWeightGrams: number;
        };
        partner: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    }) | {
        transaction: ({
            user: {
                id: string;
                email: string;
                nama: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.UserRole;
                poinHijau: number;
                createdAt: Date;
                updatedAt: Date;
            };
            device: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                kategori: string;
                merek: string;
                tipe: string;
                tahunRilis: number;
                estimatedWeightGrams: number;
            };
            partner: {
                id: string;
                email: string;
                nama: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.UserRole;
                poinHijau: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
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
        }) | null;
        pointsAwarded: number;
        certificateData: {
            certificate_number: string;
            recipient_name: any;
            device_category: any;
            verified_weight_grams: any;
            points_awarded: number;
            issued_at: string;
        };
    } | null>;
    private _completeBuyback;
    private _completeRecycle;
    cancel(transactionId: string, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
        device: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            kategori: string;
            merek: string;
            tipe: string;
            tahunRilis: number;
            estimatedWeightGrams: number;
        };
        partner: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    }>;
    getTransactions(userId: string, role: UserRole, filters?: {
        status?: TransactionStatus;
    }): Promise<({
        user: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
        device: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            kategori: string;
            merek: string;
            tipe: string;
            tahunRilis: number;
            estimatedWeightGrams: number;
        };
        partner: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    })[]>;
    getTransactionById(transactionId: string, userId: string, role: UserRole): Promise<{
        user: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
        device: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            kategori: string;
            merek: string;
            tipe: string;
            tahunRilis: number;
            estimatedWeightGrams: number;
        };
        partner: {
            id: string;
            email: string;
            nama: string;
            passwordHash: string;
            role: import(".prisma/client").$Enums.UserRole;
            poinHijau: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    }>;
}
export declare const transactionService: TransactionService;
//# sourceMappingURL=transactionService.d.ts.map