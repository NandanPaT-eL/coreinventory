import { z } from 'zod';

const adjustmentItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  expectedQuantity: z.number().min(0, 'Expected quantity must be 0 or more'),
  countedQuantity: z.number().min(0, 'Counted quantity must be 0 or more'),
  reason: z.enum(['damage', 'loss', 'theft', 'found', 'correction', 'other']).default('correction'),
  notes: z.string().optional().default('')
});

// Create adjustment schema
export const createAdjustmentSchema = {
  body: z.object({
    warehouseId: z.string().min(1, 'Warehouse is required'),
    items: z.array(adjustmentItemSchema).min(1, 'At least one item is required'),
    notes: z.string().optional().default('')
  })
};

// Update adjustment schema
export const updateAdjustmentSchema = {
  params: z.object({
    id: z.string().min(1, 'Adjustment ID is required')
  }),
  body: z.object({
    warehouseId: z.string().min(1, 'Warehouse is required').optional(),
    items: z.array(adjustmentItemSchema).min(1, 'At least one item is required').optional(),
    notes: z.string().optional()
  })
};

// Validate adjustment schema
export const validateAdjustmentSchema = {
  params: z.object({
    id: z.string().min(1, 'Adjustment ID is required')
  }),
  body: z.object({
    items: z.array(z.object({
      productId: z.string().min(1, 'Product ID is required'),
      countedQuantity: z.number().min(0, 'Counted quantity must be 0 or more'),
      reason: z.enum(['damage', 'loss', 'theft', 'found', 'correction', 'other']),
      notes: z.string().optional()
    })).optional(),
    notes: z.string().optional().default('')
  })
};

// Cancel adjustment schema
export const cancelAdjustmentSchema = {
  params: z.object({
    id: z.string().min(1, 'Adjustment ID is required')
  }),
  body: z.object({
    reason: z.string().optional().default('')
  })
};

// Get single adjustment schema
export const getAdjustmentSchema = {
  params: z.object({
    id: z.string().min(1, 'Adjustment ID is required')
  })
};

// Get adjustments list schema
export const getAdjustmentsSchema = {
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    status: z.enum(['Draft', 'Done', 'Canceled']).optional(),
    warehouseId: z.string().optional(),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
};

export default {
  createAdjustmentSchema,
  updateAdjustmentSchema,
  validateAdjustmentSchema,
  cancelAdjustmentSchema,
  getAdjustmentSchema,
  getAdjustmentsSchema
};
