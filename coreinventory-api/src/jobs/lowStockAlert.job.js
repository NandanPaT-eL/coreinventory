import Product from '../models/Product.model.js';
import logger from '../config/logger.js';

// This would typically send emails or create notifications
// For now, it just logs to console/logger

export const checkLowStock = async () => {
  try {
    logger.info('Running low stock alert check...');

    const products = await Product.find({ isActive: true })
      .populate('stock.warehouseId', 'name code');

    const lowStockItems = [];

    products.forEach(product => {
      const totalStock = product.stock?.reduce((sum, s) => sum + s.quantity, 0) || 0;
      const reorderPoint = product.reorderPoint || 10;

      if (totalStock > 0 && totalStock <= reorderPoint) {
        lowStockItems.push({
          product: product.name,
          sku: product.sku,
          currentStock: totalStock,
          reorderPoint,
          stockByWarehouse: product.stock.map(s => ({
            warehouse: s.warehouseId?.name,
            quantity: s.quantity
          }))
        });
      } else if (totalStock === 0) {
        lowStockItems.push({
          product: product.name,
          sku: product.sku,
          currentStock: 0,
          reorderPoint,
          stockByWarehouse: [],
          status: 'OUT_OF_STOCK'
        });
      }
    });

    if (lowStockItems.length > 0) {
      logger.warn(`Low stock alert: ${lowStockItems.length} products need attention`);
      
      // Here you would send emails or create notifications
      // For now, just log the items
      lowStockItems.forEach(item => {
        if (item.status === 'OUT_OF_STOCK') {
          logger.error(`OUT OF STOCK: ${item.product} (${item.sku})`);
        } else {
          logger.warn(`LOW STOCK: ${item.product} (${item.sku}) - Current: ${item.currentStock}, Reorder at: ${item.reorderPoint}`);
        }
      });
    } else {
      logger.info('Low stock check completed: All products have sufficient stock');
    }

    return lowStockItems;
  } catch (error) {
    logger.error('Low stock alert job failed:', error);
    throw error;
  }
};
