import { z } from 'zod';

const receiptItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  expectedQuantity: z.number().min(1, 'Quantity must be at least 1'),
  unitCost: z.number().min(0, 'Unit cost must be 0 or more'),
  batchNumber: z.string().optional().default(''),
  expiryDate: z.string().optional(),
  location: z.string().optional().default('')
});

// Create receipt schema
export const createReceiptSchema = {
  body: z.object({
    supplier: z.object({
      name: z.string().min(1, 'Supplier name is required'),
      email: z.string().email('Invalid email').optional(),
      phone: z.string().optional(),
      address: z.string().optional()
    }),
    warehouseId: z.string().min(1, 'Warehouse ID is required'),
    items: z.array(receiptItemSchema).min(1, 'At least one item is required'),
    expectedDeliveryDate: z.string().optional(),
    referenceNumber: z.string().optional(),
    notes: z.string().optional().default('')
  })
};

// Update receipt schema
export const updateReceiptSchema = {
  params: z.object({
    id: z.string().min(1, 'Receipt ID is required')
  }),
  body: z.object({
    supplier: z.object({
      name: z.string().min(1, 'Supplier name is required').optional(),
      email: z.string().email('Invalid email').optional(),
      phone: z.string().optional(),
      address: z.string().optional()
    }).optional(),
    warehouseId: z.string().min(1, 'Warehouse ID is required').optional(),
    items: z.array(receiptItemSchema).min(1, 'At least one item is required').optional(),
    expectedDeliveryDate: z.string().optional(),
    referenceNumber: z.string().optional(),
    notes: z.string().optional()
  })
};

// Validate receipt schema
export const validateReceiptSchema = {
  params: z.object({
    id: z.string().min(1, 'Receipt ID is required')
  }),
  body: z.object({
    items: z.array(z.object({
      productId: z.string().min(1, 'Product ID is required'),
      receivedQuantity: z.number().min(0, 'Received quantity must be 0 or more'),
      batchNumber: z.string().optional(),
      location: z.string().optional()
    })).optional(),
    notes: z.string().optional().default('')
  })
};

// Cancel receipt schema
export const cancelReceiptSchema = {
  params: z.object({
    id: z.string().min(1, 'Receipt ID is required')
  }),
  body: z.object({
    reason: z.string().optional().default('')
  })
};

// Get single receipt schema
export const getReceiptSchema = {
  params: z.object({
    id: z.string().min(1, 'Receipt ID is required')
  })
};

// Get receipts list schema
export const getReceiptsSchema = {
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    status: z.enum(['Draft', 'Waiting', 'Ready', 'Done', 'Canceled']).optional(),
    warehouseId: z.string().optional(),
    supplierId: z.string().optional(),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
};

export default {
  createReceiptSchema,
  updateReceiptSchema,
  validateReceiptSchema,
  cancelReceiptSchema,
  getReceiptSchema,
  getReceiptsSchema
};
