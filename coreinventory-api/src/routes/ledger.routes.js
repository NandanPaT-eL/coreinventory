import { Router } from 'express';
import { 
  getLedger,
  getProductLedger,
  getStockValuation,
  getDailySummary
} from '../controllers/ledger.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validateZod.middleware.js';
import {
  getLedgerSchema,
  getProductLedgerSchema,
  getStockValuationSchema,
  getDailySummarySchema
} from '../validators/ledger.validator.js';

const router = Router();

// All ledger routes require authentication
router.use(protect);

router.get('/', validate(getLedgerSchema), getLedger);
router.get('/product/:productId', validate(getProductLedgerSchema), getProductLedger);
router.get('/valuation', validate(getStockValuationSchema), getStockValuation);
router.get('/summary/daily', validate(getDailySummarySchema), getDailySummary);

export default router;
