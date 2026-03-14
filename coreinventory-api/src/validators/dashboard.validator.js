import { z } from 'zod';

export const getRecentMovementsSchema = {
  query: z.object({
    limit: z.string().optional().default('10')
  })
};

export const getChartDataSchema = {
  query: z.object({
    days: z.string().optional().default('7')
  })
};

export const getLowStockProductsSchema = {
  query: z.object({
    limit: z.string().optional().default('5')
  })
};

// Also export as named exports for flexibility
export default {
  getRecentMovementsSchema,
  getChartDataSchema,
  getLowStockProductsSchema
};
