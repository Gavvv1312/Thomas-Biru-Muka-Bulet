import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
export declare const dropOffController: {
    getDropOffPoints: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    createDropOffPoint: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateDropOffPoint: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteDropOffPoint: (req: AuthenticatedRequest, res: Response) => Promise<void>;
};
//# sourceMappingURL=dropOffController.d.ts.map