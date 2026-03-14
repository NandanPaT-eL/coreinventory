import { Router } from 'express';
import { 
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse
} from '../controllers/warehouse.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import validate from '../middleware/validateZod.middleware.js';
import {
  createWarehouseSchema,
  updateWarehouseSchema,
  getWarehouseSchema,
  getWarehousesSchema
} from '../validators/warehouse.validator.js';

const router = Router();

// All warehouse routes require authentication
router.use(protect);

router.route('/')
  .post(adminOnly, validate(createWarehouseSchema), createWarehouse)
  .get(validate(getWarehousesSchema), getWarehouses);

router.route('/:id')
  .get(validate(getWarehouseSchema), getWarehouseById)
  .put(adminOnly, validate(updateWarehouseSchema), updateWarehouse)
  .delete(adminOnly, validate(getWarehouseSchema), deleteWarehouse);

export default router;
