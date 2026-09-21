export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T | null;
    message: string;
}
export declare function successResponse<T>(data: T, message?: string): ApiResponse<T>;
export declare function errorResponse(message: string): ApiResponse<null>;
//# sourceMappingURL=response.d.ts.map