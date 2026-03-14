import { z } from 'zod';

const transferItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  fromLocation: z.string().optional().default(''),
  toLocation: z.string().optional().default(''),
  batchNumber: z.string().optional().default(''),
  notes: z.string().optional().default('')
});

// Create transfer schema
export const createTransferSchema = {
  body: z.object({
    fromWarehouseId: z.string().min(1, 'Source warehouse is required'),
    toWarehouseId: z.string().min(1, 'Destination warehouse is required'),
    items: z.array(transferItemSchema).min(1, 'At least one item is required'),
    scheduledDate: z.string().optional(),
    notes: z.string().optional().default('')
  })
};

// Update transfer schema
export const updateTransferSchema = {
  params: z.object({
    id: z.string().min(1, 'Transfer ID is required')
  }),
  body: z.object({
    fromWarehouseId: z.string().min(1, 'Source warehouse is required').optional(),
    toWarehouseId: z.string().min(1, 'Destination warehouse is required').optional(),
    items: z.array(transferItemSchema).min(1, 'At least one item is required').optional(),
    scheduledDate: z.string().optional(),
    notes: z.string().optional()
  })
};

// Validate transfer schema
export const validateTransferSchema = {
  params: z.object({
    id: z.string().min(1, 'Transfer ID is required')
  }),
  body: z.object({
    items: z.array(z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().min(0, 'Quantity must be 0 or more'),
      fromLocation: z.string().optional(),
      toLocation: z.string().optional(),
      batchNumber: z.string().optional(),
      notes: z.string().optional()
    })).optional(),
    notes: z.string().optional().default('')
  })
};

// Cancel transfer schema
export const cancelTransferSchema = {
  params: z.object({
    id: z.string().min(1, 'Transfer ID is required')
  }),
  body: z.object({
    reason: z.string().optional().default('')
  })
};

// Get single transfer schema
export const getTransferSchema = {
  params: z.object({
    id: z.string().min(1, 'Transfer ID is required')
  })
};

// Get transfers list schema
export const getTransfersSchema = {
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    status: z.enum(['Draft', 'Done', 'Canceled']).optional(),
    fromWarehouse: z.string().optional(),
    toWarehouse: z.string().optional(),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
};

export default {
  createTransferSchema,
  updateTransferSchema,
  validateTransferSchema,
  cancelTransferSchema,
  getTransferSchema,
  getTransfersSchema
};
