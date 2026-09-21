import { Router } from 'express';
import { deviceController } from '../controllers/deviceController';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { deviceCreateSchema, idParamSchema } from '../validators/schemas';

const router = Router();

router.use(authenticate);

router.post('/', validate(deviceCreateSchema), deviceController.createDevice);
router.get('/', deviceController.getMyDevices);
router.get('/:id', validate(idParamSchema), deviceController.getDeviceById);
router.post('/:id/valuation', validate(idParamSchema), deviceController.createValuation);
router.get('/:id/valuation', validate(idParamSchema), deviceController.getValuation);

export default router;