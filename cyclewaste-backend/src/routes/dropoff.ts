import { Router } from 'express';
import { dropOffController } from '../controllers/dropOffController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { dropOffPointCreateSchema, dropOffPointUpdateSchema, idParamSchema } from '../validators/schemas';

const router = Router();

// GET is public for partners, but let's keep it authenticated
router.get('/', authenticate, dropOffController.getDropOffPoints);

// POST only for partner creating their own location
router.post('/', authenticate, validate(dropOffPointCreateSchema), dropOffController.createDropOffPoint);

// PATCH/DELETE for partner who owns the location
router.patch('/:id', authenticate, validate(idParamSchema), validate(dropOffPointUpdateSchema), dropOffController.updateDropOffPoint);
router.delete('/:id', authenticate, validate(idParamSchema), dropOffController.deleteDropOffPoint);

export default router;