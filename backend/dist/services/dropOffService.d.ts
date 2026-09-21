export declare class DropOffService {
    getDropOffPoints(filters?: {
        tipe?: string;
        partnerId?: string;
    }): Promise<({
        partner: {
            id: string;
            nama: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tipe: import(".prisma/client").$Enums.DropOffType;
        latitude: number;
        longitude: number;
        partnerId: string;
        namaLokasi: string;
    })[]>;
    createDropOffPoint(partnerId: string, data: {
        namaLokasi: string;
        latitude: number;
        longitude: number;
        tipe: 'repair_shop' | 'recycling_center';
    }): Promise<{
        partner: {
            id: string;
            nama: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tipe: import(".prisma/client").$Enums.DropOffType;
        latitude: number;
        longitude: number;
        partnerId: string;
        namaLokasi: string;
    }>;
    updateDropOffPoint(dropOffId: string, partnerId: string, data: {
        namaLokasi?: string;
        latitude?: number;
        longitude?: number;
        tipe?: 'repair_shop' | 'recycling_center';
    }): Promise<{
        partner: {
            id: string;
            nama: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tipe: import(".prisma/client").$Enums.DropOffType;
        latitude: number;
        longitude: number;
        partnerId: string;
        namaLokasi: string;
    }>;
    deleteDropOffPoint(dropOffId: string, partnerId: string): Promise<{
        message: string;
    }>;
}
export declare const dropOffService: DropOffService;
//# sourceMappingURL=dropOffService.d.ts.map