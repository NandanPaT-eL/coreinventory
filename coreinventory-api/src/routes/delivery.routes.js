import { Router } from 'express';
import { 
  createDelivery,
  getDeliveries,
  getDeliveryById,
  updateDelivery,
  validateDelivery,
  cancelDelivery
} from '../controllers/delivery.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validateZod.middleware.js';
import {
  createDeliverySchema,
  updateDeliverySchema,
  validateDeliverySchema,
  cancelDeliverySchema,
  getDeliverySchema,
  getDeliveriesSchema
} from '../validators/delivery.validator.js';

const router = Router();

// All delivery routes require authentication
router.use(protect);

router.route('/')
  .post(validate(createDeliverySchema), createDelivery)
  .get(validate(getDeliveriesSchema), getDeliveries);

router.route('/:id')
  .get(validate(getDeliverySchema), getDeliveryById)
  .put(validate(updateDeliverySchema), updateDelivery)
  .delete(validate(cancelDeliverySchema), cancelDelivery);

router.post('/:id/validate', validate(validateDeliverySchema), validateDelivery);

export default router;
