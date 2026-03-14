import { z } from 'zod';

const deliveryItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  orderedQuantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be 0 or more'),
  batchNumber: z.string().optional().default(''),
  location: z.string().optional().default('')
});

// Create delivery schema
export const createDeliverySchema = {
  body: z.object({
    customer: z.object({
      name: z.string().min(1, 'Customer name is required'),
      email: z.string().email('Invalid email').optional(),
      phone: z.string().optional(),
      address: z.string().optional()
    }),
    warehouseId: z.string().min(1, 'Warehouse ID is required'),
    items: z.array(deliveryItemSchema).min(1, 'At least one item is required'),
    requestedDeliveryDate: z.string().optional(),
    carrier: z.string().optional(),
    trackingNumber: z.string().optional(),
    notes: z.string().optional().default('')
  })
};

// Update delivery schema
export const updateDeliverySchema = {
  params: z.object({
    id: z.string().min(1, 'Delivery ID is required')
  }),
  body: z.object({
    customer: z.object({
      name: z.string().min(1, 'Customer name is required').optional(),
      email: z.string().email('Invalid email').optional(),
      phone: z.string().optional(),
      address: z.string().optional()
    }).optional(),
    warehouseId: z.string().min(1, 'Warehouse ID is required').optional(),
    items: z.array(deliveryItemSchema).min(1, 'At least one item is required').optional(),
    requestedDeliveryDate: z.string().optional(),
    carrier: z.string().optional(),
    trackingNumber: z.string().optional(),
    notes: z.string().optional()
  })
};

// Validate delivery schema
export const validateDeliverySchema = {
  params: z.object({
    id: z.string().min(1, 'Delivery ID is required')
  }),
  body: z.object({
    items: z.array(z.object({
      productId: z.string().min(1, 'Product ID is required'),
      deliveredQuantity: z.number().min(0, 'Delivered quantity must be 0 or more'),
      batchNumber: z.string().optional(),
      location: z.string().optional()
    })).optional(),
    carrier: z.string().optional(),
    trackingNumber: z.string().optional(),
    notes: z.string().optional().default('')
  })
};

// Cancel delivery schema
export const cancelDeliverySchema = {
  params: z.object({
    id: z.string().min(1, 'Delivery ID is required')
  }),
  body: z.object({
    reason: z.string().optional().default('')
  })
};

// Get single delivery schema
export const getDeliverySchema = {
  params: z.object({
    id: z.string().min(1, 'Delivery ID is required')
  })
};

// Get deliveries list schema
export const getDeliveriesSchema = {
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    status: z.enum(['Draft', 'Ready', 'Done', 'Canceled']).optional(),
    warehouseId: z.string().optional(),
    customerId: z.string().optional(),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
};

export default {
  createDeliverySchema,
  updateDeliverySchema,
  validateDeliverySchema,
  cancelDeliverySchema,
  getDeliverySchema,
  getDeliveriesSchema
};
