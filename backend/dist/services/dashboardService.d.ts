export declare class DashboardService {
    getUserDashboard(userId: string, requestingUserId: string, role: string): Promise<{
        poinHijau: number;
        totalDevices: number;
        totalCompletedTransactions: number;
        totalBuyback: number;
        totalRecycle: number;
        totalVerifiedEwasteWeightGrams: number;
        latestTransactions: {
            id: string;
            device: {
                kategori: string;
                merek: string;
                tipe: string;
            };
            jalur: import(".prisma/client").$Enums.TransactionChannel;
            status: import(".prisma/client").$Enums.TransactionStatus;
            hargaFinal: number | null;
            verifiedWeightGrams: number | null;
            createdAt: Date;
            completedAt: Date | null;
        }[];
        latestPointsHistory: {
            id: string;
            amount: number;
            source: string;
            referenceId: string | null;
            createdAt: Date;
        }[];
    }>;
}
export declare const dashboardService: DashboardService;
//# sourceMappingURL=dashboardService.d.ts.map