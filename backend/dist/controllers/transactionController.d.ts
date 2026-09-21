import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
export declare const transactionController: {
    createTransaction: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getTransactions: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getTransactionById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    makeOffer: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    verify: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    complete: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    cancel: (req: AuthenticatedRequest, res: Response) => Promise<void>;
};
//# sourceMappingURL=transactionController.d.ts.map