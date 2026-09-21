import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
export declare const authController: {
    register: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    login: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    refresh: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    logout: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    me: (req: AuthenticatedRequest, res: Response) => Promise<void>;
};
//# sourceMappingURL=authController.d.ts.map