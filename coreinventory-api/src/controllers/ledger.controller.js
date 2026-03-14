import StockLedger from '../models/StockLedger.model.js';
import Product from '../models/Product.model.js';
import Warehouse from '../models/Warehouse.model.js';
import mongoose from 'mongoose';

// @desc    Get full movement history with filters
// @route   GET /api/v1/ledger
// @access  Private
export const getLedger = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      type, 
      productId, 
      warehouseId,
      startDate,
      endDate,
      referenceNumber
    } = req.query;

    const query = {};

    if (type) query.type = type;
    if (productId) query.productId = productId;
    if (warehouseId) query.warehouseId = warehouseId;
    if (referenceNumber) query.referenceNumber = { $regex: referenceNumber, $options: 'i' };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [ledger, total] = await Promise.all([
      StockLedger.find(query)
        .populate('productId', 'name sku unitOfMeasure')
        .populate('warehouseId', 'name code')
        .populate('performedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      StockLedger.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: ledger,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get ledger error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch ledger'
    });
  }
};

// @desc    Get movements for a specific product
// @route   GET /api/v1/ledger/product/:productId
// @access  Private
export const getProductLedger = async (req, res) => {
  try {
    const { productId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      warehouseId,
      startDate,
      endDate 
    } = req.query;

    const query = { productId };

    if (warehouseId) query.warehouseId = warehouseId;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [ledger, total] = await Promise.all([
      StockLedger.find(query)
        .populate('warehouseId', 'name code')
        .populate('performedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      StockLedger.countDocuments(query)
    ]);

    // Get product details
    const product = await Product.findById(productId).select('name sku unitOfMeasure');

    res.json({
      success: true,
      data: {
        product,
        movements: ledger
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get product ledger error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch product ledger'
    });
  }
};

// @desc    Get stock valuation
// @route   GET /api/v1/ledger/valuation
// @access  Private
export const getStockValuation = async (req, res) => {
  try {
    const { productId, warehouseId } = req.query;

    // Get all products with their stock
    const productQuery = { isActive: true };
    if (productId) productQuery._id = productId;

    const products = await Product.find(productQuery)
      .populate('stock.warehouseId', 'name code');

    let valuation = [];

    products.forEach(product => {
      if (!product.stock || product.stock.length === 0) return;

      product.stock.forEach(stock => {
        // Filter by warehouse if specified
        if (warehouseId && stock.warehouseId?._id.toString() !== warehouseId) return;

        valuation.push({
          product: {
            _id: product._id,
            name: product.name,
            sku: product.sku,
            unitOfMeasure: product.unitOfMeasure
          },
          warehouse: stock.warehouseId,
          quantity: stock.quantity,
          unitCost: product.costPrice || 0,
          totalValue: (stock.quantity * (product.costPrice || 0)),
          lastUpdated: stock.lastUpdated
        });
      });
    });

    // Calculate totals
    const totalValue = valuation.reduce((sum, item) => sum + item.totalValue, 0);
    const totalItems = valuation.length;
    const totalQuantity = valuation.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      data: {
        items: valuation,
        summary: {
          totalValue,
          totalItems,
          totalQuantity,
          averageItemValue: totalItems > 0 ? totalValue / totalItems : 0
        }
      }
    });
  } catch (error) {
    console.error('Get stock valuation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch stock valuation'
    });
  }
};

// @desc    Get daily summary
// @route   GET /api/v1/ledger/summary/daily
// @access  Private
export const getDailySummary = async (req, res) => {
  try {
    const { date } = req.query;
    
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const summary = await StockLedger.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: '$type',
          totalTransactions: { $sum: 1 },
          totalQuantity: { $sum: '$delta' },
          uniqueProducts: { $addToSet: '$productId' }
        }
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          totalTransactions: 1,
          totalQuantity: 1,
          uniqueProducts: { $size: '$uniqueProducts' }
        }
      }
    ]);

    // Get detailed movements for the day
    const movements = await StockLedger.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate('productId', 'name sku')
      .populate('warehouseId', 'name code')
      .populate('performedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: {
        date: targetDate.toISOString().split('T')[0],
        summary,
        recentMovements: movements
      }
    });
  } catch (error) {
    console.error('Get daily summary error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch daily summary'
    });
  }
};

// @desc    Get stock balance for a product/warehouse
// @route   GET /api/v1/ledger/balance
// @access  Private
export const getStockBalance = async (req, res) => {
  try {
    const { productId, warehouseId } = req.query;

    if (!productId || !warehouseId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and Warehouse ID are required'
      });
    }

    // Get the latest ledger entry for this product/warehouse
    const latestEntry = await StockLedger.findOne({
      productId,
      warehouseId
    })
      .sort({ createdAt: -1 })
      .select('newStock');

    // Also get today's movements
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayMovements = await StockLedger.find({
      productId,
      warehouseId,
      createdAt: { $gte: startOfDay }
    })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        currentStock: latestEntry?.newStock || 0,
        todayMovements: todayMovements.length,
        netChangeToday: todayMovements.reduce((sum, m) => sum + m.delta, 0)
      }
    });
  } catch (error) {
    console.error('Get stock balance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch stock balance'
    });
  }
};

export default {
  getLedger,
  getProductLedger,
  getStockValuation,
  getDailySummary,
  getStockBalance
};
