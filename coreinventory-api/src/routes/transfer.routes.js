import { Router } from 'express';
import { 
  createTransfer,
  getTransfers,
  getTransferById,
  updateTransfer,
  validateTransfer,
  cancelTransfer
} from '../controllers/transfer.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validateZod.middleware.js';
import {
  createTransferSchema,
  updateTransferSchema,
  validateTransferSchema,
  cancelTransferSchema,
  getTransferSchema,
  getTransfersSchema
} from '../validators/transfer.validator.js';

const router = Router();

// All transfer routes require authentication
router.use(protect);

router.route('/')
  .post(validate(createTransferSchema), createTransfer)
  .get(validate(getTransfersSchema), getTransfers);

router.route('/:id')
  .get(validate(getTransferSchema), getTransferById)
  .put(validate(updateTransferSchema), updateTransfer)
  .delete(validate(cancelTransferSchema), cancelTransfer);

router.post('/:id/validate', validate(validateTransferSchema), validateTransfer);

export default router;
