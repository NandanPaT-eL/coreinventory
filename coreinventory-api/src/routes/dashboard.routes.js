import { Router } from 'express';
import { 
  getDashboardKPIs,
  getRecentMovements,
  getChartData,
  getLowStockProducts
} from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validateZod.middleware.js';
import {
  getRecentMovementsSchema,
  getChartDataSchema,
  getLowStockProductsSchema
} from '../validators/dashboard.validator.js';

const router = Router();

// All dashboard routes require authentication
router.use(protect);

router.get('/kpis', getDashboardKPIs);
router.get('/recent', validate(getRecentMovementsSchema), getRecentMovements);
router.get('/charts', validate(getChartDataSchema), getChartData);
router.get('/low-stock', validate(getLowStockProductsSchema), getLowStockProducts);

export default router;
