import Adjustment from '../models/Adjustment.model.js';
import Product from '../models/Product.model.js';
import StockLedger from '../models/StockLedger.model.js';
import mongoose from 'mongoose';

// @desc    Create a new adjustment
// @route   POST /api/v1/adjustments
// @access  Private
export const createAdjustment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { warehouseId, items, notes } = req.body;
    const userId = req.user._id;

    // Validate products exist
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }
    }

    // Create adjustment
    const adjustment = new Adjustment({
      warehouseId,
      items,
      notes,
      createdBy: userId
    });

    await adjustment.save({ session });
    await session.commitTransaction();
    session.endSession();

    // Populate references for response
    await adjustment.populate([
      { path: 'warehouseId', select: 'name code' },
      { path: 'items.productId', select: 'name sku unitOfMeasure' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Adjustment created successfully',
      data: adjustment
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Create adjustment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create adjustment'
    });
  }
};

// @desc    Get all adjustments with filters
// @route   GET /api/v1/adjustments
// @access  Private
export const getAdjustments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, warehouseId, search } = req.query;
    
    const query = {};

    if (status) query.status = status;
    if (warehouseId) query.warehouseId = warehouseId;
    
    if (search) {
      query.$or = [
        { adjustmentNumber: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [adjustments, total] = await Promise.all([
      Adjustment.find(query)
        .populate('warehouseId', 'name code')
        .populate('items.productId', 'name sku unitOfMeasure')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Adjustment.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: adjustments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get adjustments error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch adjustments'
    });
  }
};

// @desc    Get single adjustment by ID
// @route   GET /api/v1/adjustments/:id
// @access  Private
export const getAdjustmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const adjustment = await Adjustment.findById(id)
      .populate('warehouseId')
      .populate('items.productId')
      .populate('createdBy', 'name email')
      .populate('validatedBy', 'name email')
      .populate('canceledBy', 'name email');

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found'
      });
    }

    res.json({
      success: true,
      data: adjustment
    });
  } catch (error) {
    console.error('Get adjustment by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch adjustment'
    });
  }
};

// @desc    Update draft adjustment
// @route   PUT /api/v1/adjustments/:id
// @access  Private
export const updateAdjustment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const updates = req.body;

    const adjustment = await Adjustment.findById(id).session(session);
    if (!adjustment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found'
      });
    }

    if (adjustment.status !== 'Draft') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Cannot update adjustment with status: ${adjustment.status}`
      });
    }

    // Apply updates
    Object.assign(adjustment, updates);
    await adjustment.save({ session });

    await session.commitTransaction();
    session.endSession();

    await adjustment.populate([
      { path: 'warehouseId', select: 'name code' },
      { path: 'items.productId', select: 'name sku unitOfMeasure' }
    ]);

    res.json({
      success: true,
      message: 'Adjustment updated successfully',
      data: adjustment
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Update adjustment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update adjustment'
    });
  }
};

// @desc    Validate/Apply adjustment
// @route   POST /api/v1/adjustments/:id/validate
// @access  Private
export const validateAdjustment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { items: validatedItems, notes } = req.body;
    const userId = req.user._id;

    const adjustment = await Adjustment.findById(id).session(session);
    if (!adjustment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found'
      });
    }

    if (adjustment.status !== 'Draft') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Cannot apply adjustment with status: ${adjustment.status}`
      });
    }

    // Use provided items or original items
    const itemsToProcess = validatedItems || adjustment.items;

    // Process each item: update stock based on counted quantity
    for (const item of itemsToProcess) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      // Find current stock in this warehouse
      const stockIndex = product.stock?.findIndex(
        s => s.warehouseId.toString() === adjustment.warehouseId.toString()
      );

      const previousStock = stockIndex !== -1 ? product.stock[stockIndex].quantity : 0;
      const delta = item.countedQuantity - previousStock;

      if (delta === 0) {
        // No change needed
        continue;
      }

      if (stockIndex === -1) {
        // Create new stock entry
        if (!product.stock) product.stock = [];
        product.stock.push({
          warehouseId: adjustment.warehouseId,
          quantity: item.countedQuantity,
          location: '',
          batchNumber: '',
          lastUpdated: new Date()
        });
      } else {
        // Update existing stock
        product.stock[stockIndex].quantity = item.countedQuantity;
        product.stock[stockIndex].lastUpdated = new Date();
      }

      await product.save({ session });

      // Create ledger entry
      await StockLedger.create([{
        productId: product._id,
        warehouseId: adjustment.warehouseId,
        delta: delta,
        previousStock: previousStock,
        newStock: item.countedQuantity,
        type: 'adjustment',
        referenceId: adjustment._id,
        referenceModel: 'Adjustment',
        referenceNumber: adjustment.adjustmentNumber,
        performedBy: userId,
        note: `Adjustment: ${item.reason || 'correction'} | Expected: ${previousStock}, Counted: ${item.countedQuantity} | ${notes || item.notes || ''}`
      }], { session });
    }

    // Update adjustment status
    adjustment.status = 'Done';
    adjustment.validatedBy = userId;
    adjustment.validatedAt = new Date();
    if (notes) adjustment.notes = notes;
    await adjustment.save({ session });

    await session.commitTransaction();
    session.endSession();

    await adjustment.populate([
      { path: 'warehouseId', select: 'name code' },
      { path: 'items.productId', select: 'name sku unitOfMeasure' },
      { path: 'validatedBy', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Adjustment applied successfully',
      data: adjustment
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Validate adjustment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to apply adjustment'
    });
  }
};

// @desc    Cancel adjustment
// @route   DELETE /api/v1/adjustments/:id
// @access  Private
export const cancelAdjustment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const adjustment = await Adjustment.findById(id).session(session);
    if (!adjustment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found'
      });
    }

    if (adjustment.status !== 'Draft') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Cannot cancel adjustment with status: ${adjustment.status}`
      });
    }

    adjustment.status = 'Canceled';
    adjustment.canceledBy = userId;
    adjustment.canceledAt = new Date();
    adjustment.cancelReason = reason || 'Canceled by user';
    await adjustment.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: 'Adjustment canceled successfully',
      data: {
        _id: adjustment._id,
        adjustmentNumber: adjustment.adjustmentNumber,
        status: adjustment.status,
        canceledBy: userId,
        canceledAt: adjustment.canceledAt,
        cancelReason: adjustment.cancelReason
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Cancel adjustment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel adjustment'
    });
  }
};
