import { Router } from 'express';
import { pointsController } from '../controllers/pointsController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { idParamSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

router.get('/:id', validate(idParamSchema), pointsController.getPoints);
router.get('/:id/history', validate(idParamSchema), pointsController.getPointsHistory);

export default router;