import Product from '../models/Product.model.js';
import Receipt from '../models/Receipt.model.js';
import Delivery from '../models/Delivery.model.js';
import Transfer from '../models/Transfer.model.js';
import StockLedger from '../models/StockLedger.model.js';

// @desc    Get dashboard KPIs
// @route   GET /api/v1/dashboard/kpis
// @access  Private
export const getDashboardKPIs = async (req, res) => {
  try {
    // Total products count
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Low stock products (stock <= reorderPoint)
    const products = await Product.find({ isActive: true });
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach(product => {
      const totalStock = product.stock?.reduce((sum, s) => sum + s.quantity, 0) || 0;
      const reorderPoint = product.reorderPoint || 10;
      
      if (totalStock === 0) {
        outOfStockCount++;
      } else if (totalStock <= reorderPoint) {
        lowStockCount++;
      }
    });

    // Pending receipts (Draft or Waiting)
    const pendingReceipts = await Receipt.countDocuments({
      status: { $in: ['Draft', 'Waiting'] }
    });

    // Pending deliveries (Draft or Ready)
    const pendingDeliveries = await Delivery.countDocuments({
      status: { $in: ['Draft', 'Ready'] }
    });

    // Pending transfers (Draft)
    const pendingTransfers = await Transfer.countDocuments({
      status: 'Draft'
    });

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStockCount,
        outOfStockCount,
        pendingReceipts,
        pendingDeliveries,
        pendingTransfers
      }
    });
  } catch (error) {
    console.error('Dashboard KPIs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard KPIs'
    });
  }
};

// @desc    Get recent movements
// @route   GET /api/v1/dashboard/recent
// @access  Private
export const getRecentMovements = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const movements = await StockLedger.find()
      .populate('productId', 'name sku')
      .populate('warehouseId', 'name code')
      .populate('performedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: movements
    });
  } catch (error) {
    console.error('Recent movements error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch recent movements'
    });
  }
};

// @desc    Get chart data
// @route   GET /api/v1/dashboard/charts
// @access  Private
export const getChartData = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    // Get date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get movements grouped by day and type
    const movements = await StockLedger.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$type'
          },
          totalQuantity: { $sum: '$delta' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    // Get stock by warehouse
    const products = await Product.find({ isActive: true });
    const stockByWarehouse = {};

    products.forEach(product => {
      product.stock?.forEach(stock => {
        const warehouseId = stock.warehouseId.toString();
        if (!stockByWarehouse[warehouseId]) {
          stockByWarehouse[warehouseId] = {
            warehouseId,
            totalStock: 0,
            products: 0
          };
        }
        stockByWarehouse[warehouseId].totalStock += stock.quantity;
        stockByWarehouse[warehouseId].products++;
      });
    });

    res.json({
      success: true,
      data: {
        movements,
        stockByWarehouse: Object.values(stockByWarehouse)
      }
    });
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch chart data'
    });
  }
};

// @desc    Get low stock products
// @route   GET /api/v1/dashboard/low-stock
// @access  Private
export const getLowStockProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const products = await Product.find({ isActive: true })
      .populate('stock.warehouseId', 'name code');

    const lowStockProducts = products
      .map(product => {
        const totalStock = product.stock?.reduce((sum, s) => sum + s.quantity, 0) || 0;
        const reorderPoint = product.reorderPoint || 10;
        
        return {
          _id: product._id,
          name: product.name,
          sku: product.sku,
          totalStock,
          reorderPoint,
          status: totalStock === 0 ? 'out' : (totalStock <= reorderPoint ? 'low' : 'ok'),
          stockByWarehouse: product.stock || []
        };
      })
      .filter(p => p.status !== 'ok')
      .sort((a, b) => a.totalStock - b.totalStock)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: lowStockProducts
    });
  } catch (error) {
    console.error('Low stock products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch low stock products'
    });
  }
};
