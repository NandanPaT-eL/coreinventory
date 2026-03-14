import { Router } from 'express';
import { 
  createAdjustment,
  getAdjustments,
  getAdjustmentById,
  updateAdjustment,
  validateAdjustment,
  cancelAdjustment
} from '../controllers/adjustment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validateZod.middleware.js';
import {
  createAdjustmentSchema,
  updateAdjustmentSchema,
  validateAdjustmentSchema,
  cancelAdjustmentSchema,
  getAdjustmentSchema,
  getAdjustmentsSchema
} from '../validators/adjustment.validator.js';

const router = Router();

// All adjustment routes require authentication
router.use(protect);

router.route('/')
  .post(validate(createAdjustmentSchema), createAdjustment)
  .get(validate(getAdjustmentsSchema), getAdjustments);

router.route('/:id')
  .get(validate(getAdjustmentSchema), getAdjustmentById)
  .put(validate(updateAdjustmentSchema), updateAdjustment)
  .delete(validate(cancelAdjustmentSchema), cancelAdjustment);

router.post('/:id/validate', validate(validateAdjustmentSchema), validateAdjustment);

export default router;
