import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
export declare const deviceController: {
    createDevice: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getDeviceById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getMyDevices: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    createValuation: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getValuation: (req: AuthenticatedRequest, res: Response) => Promise<void>;
};
//# sourceMappingURL=deviceController.d.ts.map