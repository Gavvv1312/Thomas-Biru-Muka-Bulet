import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { idParamSchema } from '../validators/schemas';

const router = Router();

router.get('/:id', authenticate, validate(idParamSchema), dashboardController.getDashboard);

export default router;