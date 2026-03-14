import { Router } from 'express';
import { 
  createReceipt,
  getReceipts,
  getReceiptById,
  updateReceipt,
  validateReceipt,
  cancelReceipt
} from '../controllers/receipt.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validateZod.middleware.js';
import {
  createReceiptSchema,
  updateReceiptSchema,
  validateReceiptSchema,
  cancelReceiptSchema,
  getReceiptSchema,
  getReceiptsSchema
} from '../validators/receipt.validator.js';

const router = Router();

// All receipt routes require authentication
router.use(protect);

router.route('/')
  .post(validate(createReceiptSchema), createReceipt)
  .get(validate(getReceiptsSchema), getReceipts);

router.route('/:id')
  .get(validate(getReceiptSchema), getReceiptById)
  .put(validate(updateReceiptSchema), updateReceipt)
  .delete(validate(cancelReceiptSchema), cancelReceipt);

router.post('/:id/validate', validate(validateReceiptSchema), validateReceipt);

export default router;
