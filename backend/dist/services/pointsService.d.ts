export declare class PointsService {
    getUserPoints(userId: string, requestingUserId: string, role: string): Promise<{
        poinHijau: number;
        history: {
            id: string;
            createdAt: Date;
            userId: string;
            amount: number;
            source: string;
            referenceId: string | null;
        }[];
    }>;
    getPointsHistory(userId: string, requestingUserId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        amount: number;
        source: string;
        referenceId: string | null;
    }[]>;
}
export declare const pointsService: PointsService;
//# sourceMappingURL=pointsService.d.ts.map