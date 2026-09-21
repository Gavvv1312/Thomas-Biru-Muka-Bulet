import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
export declare const pointsController: {
    getPoints: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getPointsHistory: (req: AuthenticatedRequest, res: Response) => Promise<void>;
};
//# sourceMappingURL=pointsController.d.ts.map