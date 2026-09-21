import { Router } from 'express';
import { pointsController } from '../controllers/pointsController';
import { dashboardController } from '../controllers/dashboardController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { idParamSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

// GET /api/users/:id/points
router.get('/:id/points', validate(idParamSchema), pointsController.getPoints);

// GET /api/users/:id/points/history
router.get('/:id/points/history', validate(idParamSchema), pointsController.getPointsHistory);

// GET /api/users/:id/dashboard
router.get('/:id/dashboard', validate(idParamSchema), dashboardController.getDashboard);

export default router;