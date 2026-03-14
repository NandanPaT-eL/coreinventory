import { z } from 'zod';

// Create product schema
export const createProductSchema = {
  body: z.object({
    name: z.string().min(2, 'Product name must be at least 2 characters'),
    sku: z.string().min(2, 'SKU must be at least 2 characters'),
    category: z.string().optional(),
    description: z.string().optional(),
    unitOfMeasure: z.string().default('pcs'),
    costPrice: z.number().min(0).default(0),
    sellingPrice: z.number().min(0).default(0),
    reorderPoint: z.number().min(0).default(10),
    isActive: z.boolean().optional().default(true)
  })
};

// Update product schema
export const updateProductSchema = {
  params: z.object({
    id: z.string().min(1, 'Product ID is required')
  }),
  body: z.object({
    name: z.string().min(2, 'Product name must be at least 2 characters').optional(),
    sku: z.string().min(2, 'SKU must be at least 2 characters').optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    unitOfMeasure: z.string().optional(),
    costPrice: z.number().min(0).optional(),
    sellingPrice: z.number().min(0).optional(),
    reorderPoint: z.number().min(0).optional(),
    isActive: z.boolean().optional()
  })
};

// Get single product schema
export const getProductSchema = {
  params: z.object({
    id: z.string().min(1, 'Product ID is required')
  })
};

// Get products list schema
export const getProductsSchema = {
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    search: z.string().optional(),
    category: z.string().optional(),
    isActive: z.enum(['true', 'false']).optional(),
    lowStock: z.enum(['true', 'false']).optional(),
    sortBy: z.enum(['name', 'sku', 'createdAt', 'sellingPrice']).optional().default('name'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
  })
};

// Get product stock schema
export const getProductStockSchema = {
  params: z.object({
    id: z.string().min(1, 'Product ID is required')
  }),
  query: z.object({
    warehouseId: z.string().optional()
  })
};

// Delete product schema
export const deleteProductSchema = {
  params: z.object({
    id: z.string().min(1, 'Product ID is required')
  })
};

export default {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  getProductsSchema,
  getProductStockSchema,
  deleteProductSchema
};
