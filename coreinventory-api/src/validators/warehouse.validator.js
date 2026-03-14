import { z } from 'zod';

// Create warehouse schema
export const createWarehouseSchema = {
  body: z.object({
    name: z.string().min(2, 'Warehouse name must be at least 2 characters'),
    code: z.string().min(2, 'Warehouse code must be at least 2 characters').max(10),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    pincode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    manager: z.string().optional(),
    isActive: z.boolean().optional().default(true)
  })
};

// Update warehouse schema
export const updateWarehouseSchema = {
  params: z.object({
    id: z.string().min(1, 'Warehouse ID is required')
  }),
  body: z.object({
    name: z.string().min(2, 'Warehouse name must be at least 2 characters').optional(),
    code: z.string().min(2, 'Warehouse code must be at least 2 characters').max(10).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    pincode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    manager: z.string().optional(),
    isActive: z.boolean().optional()
  })
};

// Get single warehouse schema
export const getWarehouseSchema = {
  params: z.object({
    id: z.string().min(1, 'Warehouse ID is required')
  })
};

// Get warehouses list schema
export const getWarehousesSchema = {
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    search: z.string().optional(),
    isActive: z.enum(['true', 'false']).optional(),
    sortBy: z.enum(['name', 'code', 'createdAt']).optional().default('name'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
  })
};

// Delete warehouse schema
export const deleteWarehouseSchema = {
  params: z.object({
    id: z.string().min(1, 'Warehouse ID is required')
  })
};

// Also export as default for backward compatibility
export default {
  createWarehouseSchema,
  updateWarehouseSchema,
  getWarehouseSchema,
  getWarehousesSchema,
  deleteWarehouseSchema
};
