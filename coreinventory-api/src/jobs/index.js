import cron from 'node-cron';
import { checkLowStock } from './lowStockAlert.job.js';
import logger from '../config/logger.js';

// Schedule jobs
export const initJobs = () => {
  // Run low stock check every day at 8 AM
  cron.schedule('0 8 * * *', async () => {
    logger.info('Running scheduled low stock check...');
    try {
      await checkLowStock();
    } catch (error) {
      logger.error('Scheduled low stock check failed:', error);
    }
  });

  // Run low stock check every hour during business hours (optional)
  // cron.schedule('0 9-17 * * *', checkLowStock);

  logger.info('Background jobs initialized');
};
