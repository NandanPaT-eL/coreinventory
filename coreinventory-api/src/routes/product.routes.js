import { Router } from 'express';
import { 
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductStock
} from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validateZod.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  getProductsSchema,
  getProductStockSchema
} from '../validators/product.validator.js';

const router = Router();

// All product routes require authentication
router.use(protect);

router.route('/')
  .post(validate(createProductSchema), createProduct)
  .get(validate(getProductsSchema), getProducts);

router.get('/:id/stock', validate(getProductStockSchema), getProductStock);

router.route('/:id')
  .get(validate(getProductSchema), getProductById)
  .put(validate(updateProductSchema), updateProduct)
  .delete(validate(getProductSchema), deleteProduct);

export default router;
