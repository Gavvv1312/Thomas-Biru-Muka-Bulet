import { Router } from 'express';
import { transactionController } from '../controllers/transactionController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  transactionCreateSchema,
  idParamSchema,
  technicianOfferSchema,
  verificationSchema,
  completeBuybackSchema,
  transactionListQuerySchema,
} from '../validators/schemas';

const router = Router();

router.use(authenticate);

router.post('/', validate(transactionCreateSchema), transactionController.createTransaction);
router.get('/', validate(transactionListQuerySchema), transactionController.getTransactions);
router.get('/:id', validate(idParamSchema), transactionController.getTransactionById);
router.patch('/:id/offer', validate(idParamSchema), validate(technicianOfferSchema), transactionController.makeOffer);
router.patch('/:id/verify', validate(idParamSchema), validate(verificationSchema), transactionController.verify);
router.patch('/:id/complete', validate(idParamSchema), validate(completeBuybackSchema), transactionController.complete);
router.patch('/:id/cancel', validate(idParamSchema), transactionController.cancel);

export default router;