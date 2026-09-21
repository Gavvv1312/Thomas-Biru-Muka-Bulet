export interface RegisterData {
    nama: string;
    email: string;
    password: string;
    role?: 'owner';
}
export interface LoginResult {
    user: {
        id: string;
        nama: string;
        email: string;
        role: string;
        poinHijau: number;
    };
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    register(data: RegisterData): Promise<LoginResult>;
    login(email: string, password: string): Promise<LoginResult>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    me(userId: string): Promise<{
        id: string;
        email: string;
        nama: string;
        role: import(".prisma/client").$Enums.UserRole;
        poinHijau: number;
        createdAt: Date;
    }>;
    private storeRefreshToken;
    createAdminUser(data: {
        nama: string;
        email: string;
        password: string;
    }): Promise<{
        id: string;
        email: string;
        nama: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        poinHijau: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createTechnician(data: {
        nama: string;
        email: string;
        password: string;
    }): Promise<{
        id: string;
        email: string;
        nama: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        poinHijau: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createRecycler(data: {
        nama: string;
        email: string;
        password: string;
    }): Promise<{
        id: string;
        email: string;
        nama: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        poinHijau: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map