import { z } from 'zod';

// Get ledger schema
export const getLedgerSchema = {
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('20'),
    type: z.enum(['receipt', 'delivery', 'transfer', 'adjustment']).optional(),
    productId: z.string().optional(),
    warehouseId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    referenceNumber: z.string().optional()
  })
};

// Get product ledger schema
export const getProductLedgerSchema = {
  params: z.object({
    productId: z.string().min(1, 'Product ID is required')
  }),
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    warehouseId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
};

// Get stock valuation schema
export const getStockValuationSchema = {
  query: z.object({
    productId: z.string().optional(),
    warehouseId: z.string().optional()
  })
};

// Get daily summary schema
export const getDailySummarySchema = {
  query: z.object({
    date: z.string().optional()
  })
};

// Get stock balance schema
export const getStockBalanceSchema = {
  query: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    warehouseId: z.string().min(1, 'Warehouse ID is required')
  })
};

export default {
  getLedgerSchema,
  getProductLedgerSchema,
  getStockValuationSchema,
  getDailySummarySchema,
  getStockBalanceSchema
};
