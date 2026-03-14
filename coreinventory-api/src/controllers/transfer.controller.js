import Transfer from '../models/Transfer.model.js';
import Product from '../models/Product.model.js';
import StockLedger from '../models/StockLedger.model.js';
import mongoose from 'mongoose';

// @desc    Create a new transfer
// @route   POST /api/v1/transfers
// @access  Private
export const createTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { fromWarehouseId, toWarehouseId, items, scheduledDate, notes } = req.body;
    const userId = req.user._id;

    // Check if warehouses are different or same (location transfer)
    if (fromWarehouseId === toWarehouseId) {
      // Allow same warehouse for location-to-location transfers
      console.log('Creating location-to-location transfer within same warehouse');
    }

    // Validate stock availability for each item
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

      // Check stock in source warehouse
      const stockInWarehouse = product.stock?.find(
        s => s.warehouseId.toString() === fromWarehouseId
      );

      if (!stockInWarehouse || stockInWarehouse.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${stockInWarehouse?.quantity || 0}, Requested: ${item.quantity}`
        });
      }
    }

    // Create transfer
    const transfer = new Transfer({
      fromWarehouseId,
      toWarehouseId,
      items,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      notes,
      createdBy: userId
    });

    await transfer.save({ session });
    await session.commitTransaction();
    session.endSession();

    // Populate references for response
    await transfer.populate([
      { path: 'fromWarehouseId', select: 'name code' },
      { path: 'toWarehouseId', select: 'name code' },
      { path: 'items.productId', select: 'name sku unitOfMeasure' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Transfer created successfully',
      data: transfer
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Create transfer error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create transfer'
    });
  }
};

// @desc    Get all transfers with filters
// @route   GET /api/v1/transfers
// @access  Private
export const getTransfers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, fromWarehouse, toWarehouse, search } = req.query;
    
    const query = {};

    if (status) query.status = status;
    if (fromWarehouse) query.fromWarehouseId = fromWarehouse;
    if (toWarehouse) query.toWarehouseId = toWarehouse;
    
    if (search) {
      query.$or = [
        { transferNumber: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transfers, total] = await Promise.all([
      Transfer.find(query)
        .populate('fromWarehouseId', 'name code')
        .populate('toWarehouseId', 'name code')
        .populate('items.productId', 'name sku unitOfMeasure')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Transfer.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: transfers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get transfers error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch transfers'
    });
  }
};

// @desc    Get single transfer by ID
// @route   GET /api/v1/transfers/:id
// @access  Private
export const getTransferById = async (req, res) => {
  try {
    const { id } = req.params;

    const transfer = await Transfer.findById(id)
      .populate('fromWarehouseId')
      .populate('toWarehouseId')
      .populate('items.productId')
      .populate('createdBy', 'name email')
      .populate('validatedBy', 'name email')
      .populate('canceledBy', 'name email');

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }

    res.json({
      success: true,
      data: transfer
    });
  } catch (error) {
    console.error('Get transfer by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch transfer'
    });
  }
};

// @desc    Update draft transfer
// @route   PUT /api/v1/transfers/:id
// @access  Private
export const updateTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const updates = req.body;

    const transfer = await Transfer.findById(id).session(session);
    if (!transfer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }

    if (transfer.status !== 'Draft') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Cannot update transfer with status: ${transfer.status}`
      });
    }

    // Validate stock if items or fromWarehouse changed
    if (updates.items || (updates.fromWarehouseId && updates.fromWarehouseId !== transfer.fromWarehouseId.toString())) {
      const fromWarehouseId = updates.fromWarehouseId || transfer.fromWarehouseId;
      const items = updates.items || transfer.items;

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

        const stockInWarehouse = product.stock?.find(
          s => s.warehouseId.toString() === fromWarehouseId.toString()
        );

        if (!stockInWarehouse || stockInWarehouse.quantity < item.quantity) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${stockInWarehouse?.quantity || 0}`
          });
        }
      }
    }

    // Apply updates
    Object.assign(transfer, updates);
    await transfer.save({ session });

    await session.commitTransaction();
    session.endSession();

    await transfer.populate([
      { path: 'fromWarehouseId', select: 'name code' },
      { path: 'toWarehouseId', select: 'name code' },
      { path: 'items.productId', select: 'name sku unitOfMeasure' }
    ]);

    res.json({
      success: true,
      message: 'Transfer updated successfully',
      data: transfer
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Update transfer error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update transfer'
    });
  }
};

// @desc    Validate/Complete transfer
// @route   POST /api/v1/transfers/:id/validate
// @access  Private
export const validateTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { items: validatedItems, notes } = req.body;
    const userId = req.user._id;

    const transfer = await Transfer.findById(id).session(session);
    if (!transfer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }

    if (transfer.status !== 'Draft') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Cannot complete transfer with status: ${transfer.status}`
      });
    }

    // Use provided items or original items
    const itemsToProcess = validatedItems || transfer.items;

    // Process each item: remove from source, add to destination
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

      // Remove from source warehouse
      const fromStockIndex = product.stock?.findIndex(
        s => s.warehouseId.toString() === transfer.fromWarehouseId.toString()
      );

      if (fromStockIndex === -1 || !product.stock[fromStockIndex] || product.stock[fromStockIndex].quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} in source warehouse`
        });
      }

      // Update source stock
      const previousStock = product.stock[fromStockIndex].quantity;
      product.stock[fromStockIndex].quantity -= item.quantity;
      product.stock[fromStockIndex].lastUpdated = new Date();

      // Add to destination warehouse
      const toStockIndex = product.stock?.findIndex(
        s => s.warehouseId.toString() === transfer.toWarehouseId.toString()
      );

      if (toStockIndex === -1) {
        // Create new stock entry for destination warehouse
        if (!product.stock) product.stock = [];
        product.stock.push({
          warehouseId: transfer.toWarehouseId,
          quantity: item.quantity,
          location: item.toLocation || '',
          batchNumber: item.batchNumber || '',
          lastUpdated: new Date()
        });
      } else {
        // Update existing stock
        product.stock[toStockIndex].quantity += item.quantity;
        if (item.toLocation) product.stock[toStockIndex].location = item.toLocation;
        if (item.batchNumber) product.stock[toStockIndex].batchNumber = item.batchNumber;
        product.stock[toStockIndex].lastUpdated = new Date();
      }

      await product.save({ session });

      // Create ledger entry for source (negative)
      await StockLedger.create([{
        productId: product._id,
        warehouseId: transfer.fromWarehouseId,
        delta: -item.quantity,
        previousStock: previousStock,
        newStock: previousStock - item.quantity,
        type: 'transfer',
        referenceId: transfer._id,
        referenceModel: 'Transfer',
        referenceNumber: transfer.transferNumber,
        performedBy: userId,
        note: `Transferred to ${transfer.toWarehouseId} | ${notes || item.notes || ''}`
      }], { session });

      // Create ledger entry for destination (positive)
      const destPreviousStock = product.stock?.find(
        s => s.warehouseId.toString() === transfer.toWarehouseId.toString()
      )?.quantity || 0;

      await StockLedger.create([{
        productId: product._id,
        warehouseId: transfer.toWarehouseId,
        delta: item.quantity,
        previousStock: destPreviousStock - item.quantity,
        newStock: destPreviousStock,
        type: 'transfer',
        referenceId: transfer._id,
        referenceModel: 'Transfer',
        referenceNumber: transfer.transferNumber,
        performedBy: userId,
        note: `Transferred from ${transfer.fromWarehouseId} | ${notes || item.notes || ''}`
      }], { session });
    }

    // Update transfer status
    transfer.status = 'Done';
    transfer.validatedBy = userId;
    transfer.validatedAt = new Date();
    if (notes) transfer.notes = notes;
    await transfer.save({ session });

    await session.commitTransaction();
    session.endSession();

    await transfer.populate([
      { path: 'fromWarehouseId', select: 'name code' },
      { path: 'toWarehouseId', select: 'name code' },
      { path: 'items.productId', select: 'name sku unitOfMeasure' },
      { path: 'validatedBy', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Transfer completed successfully',
      data: transfer
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Validate transfer error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete transfer'
    });
  }
};

// @desc    Cancel transfer
// @route   DELETE /api/v1/transfers/:id
// @access  Private
export const cancelTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const transfer = await Transfer.findById(id).session(session);
    if (!transfer) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }

    if (transfer.status !== 'Draft') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Cannot cancel transfer with status: ${transfer.status}`
      });
    }

    transfer.status = 'Canceled';
    transfer.canceledBy = userId;
    transfer.canceledAt = new Date();
    transfer.cancelReason = reason || 'Canceled by user';
    await transfer.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: 'Transfer canceled successfully',
      data: {
        _id: transfer._id,
        transferNumber: transfer.transferNumber,
        status: transfer.status,
        canceledBy: userId,
        canceledAt: transfer.canceledAt,
        cancelReason: transfer.cancelReason
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Cancel transfer error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel transfer'
    });
  }
};
