import Warehouse from '../models/Warehouse.model.js';
import Product from '../models/Product.model.js';
import mongoose from 'mongoose';

// @desc    Create a new warehouse
// @route   POST /api/v1/warehouses
// @access  Private/Admin
export const createWarehouse = async (req, res) => {
  try {
    const { name, code, address, city, state, country, pincode, phone, email, manager, isActive } = req.body;

    // Check if warehouse with same code exists
    const existingWarehouse = await Warehouse.findOne({ code });
    if (existingWarehouse) {
      return res.status(400).json({
        success: false,
        message: 'Warehouse with this code already exists'
      });
    }

    const warehouse = await Warehouse.create({
      name,
      code,
      address,
      city,
      state,
      country,
      pincode,
      phone,
      email,
      manager,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Warehouse created successfully',
      data: warehouse
    });
  } catch (error) {
    console.error('Create warehouse error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create warehouse'
    });
  }
};

// @desc    Get all warehouses
// @route   GET /api/v1/warehouses
// @access  Private
export const getWarehouses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [warehouses, total] = await Promise.all([
      Warehouse.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Warehouse.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: warehouses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get warehouses error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch warehouses'
    });
  }
};

// @desc    Get single warehouse by ID
// @route   GET /api/v1/warehouses/:id
// @access  Private
export const getWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await Warehouse.findById(id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    // Get product count in this warehouse
    const products = await Product.find({
      'stock.warehouseId': id
    }).select('name sku stock');

    const productCount = products.length;
    const totalStock = products.reduce((sum, product) => {
      const stockInWarehouse = product.stock?.find(s => s.warehouseId.toString() === id);
      return sum + (stockInWarehouse?.quantity || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        ...warehouse.toObject(),
        stats: {
          productCount,
          totalStock
        }
      }
    });
  } catch (error) {
    console.error('Get warehouse by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch warehouse'
    });
  }
};

// @desc    Update warehouse
// @route   PUT /api/v1/warehouses/:id
// @access  Private/Admin
export const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const warehouse = await Warehouse.findById(id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    // If code is being updated, check for duplicates
    if (updates.code && updates.code !== warehouse.code) {
      const existingWarehouse = await Warehouse.findOne({ code: updates.code });
      if (existingWarehouse) {
        return res.status(400).json({
          success: false,
          message: 'Warehouse with this code already exists'
        });
      }
    }

    // Update fields
    Object.assign(warehouse, updates);
    warehouse.updatedBy = req.user._id;
    await warehouse.save();

    res.json({
      success: true,
      message: 'Warehouse updated successfully',
      data: warehouse
    });
  } catch (error) {
    console.error('Update warehouse error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update warehouse'
    });
  }
};

// @desc    Delete warehouse (soft delete - deactivate)
// @route   DELETE /api/v1/warehouses/:id
// @access  Private/Admin
export const deleteWarehouse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const warehouse = await Warehouse.findById(id).session(session);

    if (!warehouse) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    // Check if warehouse has any products
    const productsInWarehouse = await Product.findOne({
      'stock.warehouseId': id,
      'stock.quantity': { $gt: 0 }
    }).session(session);

    if (productsInWarehouse) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Cannot delete warehouse with existing stock. Deactivate it instead.'
      });
    }

    // Soft delete - just deactivate
    warehouse.isActive = false;
    warehouse.deletedBy = req.user._id;
    warehouse.deletedAt = new Date();
    await warehouse.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: 'Warehouse deactivated successfully',
      data: {
        _id: warehouse._id,
        name: warehouse.name,
        code: warehouse.code,
        isActive: warehouse.isActive
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Delete warehouse error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete warehouse'
    });
  }
};

// @desc    Get warehouse inventory summary
// @route   GET /api/v1/warehouses/:id/inventory
// @access  Private
export const getWarehouseInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    // Get all products with stock in this warehouse
    const products = await Product.find({
      'stock.warehouseId': id
    }).select('name sku category stock costPrice sellingPrice');

    const inventory = products.map(product => {
      const stockInWarehouse = product.stock?.find(s => s.warehouseId.toString() === id);
      return {
        productId: product._id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        quantity: stockInWarehouse?.quantity || 0,
        location: stockInWarehouse?.location || '',
        batchNumber: stockInWarehouse?.batchNumber || '',
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        lastUpdated: stockInWarehouse?.lastUpdated
      };
    }).filter(item => item.quantity > 0);

    const summary = {
      totalProducts: inventory.length,
      totalItems: inventory.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: inventory.reduce((sum, item) => sum + (item.quantity * (item.costPrice || 0)), 0),
      categories: [...new Set(inventory.map(i => i.category).filter(Boolean))]
    };

    res.json({
      success: true,
      data: {
        warehouse: {
          _id: warehouse._id,
          name: warehouse.name,
          code: warehouse.code
        },
        inventory,
        summary
      }
    });
  } catch (error) {
    console.error('Get warehouse inventory error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch warehouse inventory'
    });
  }
};

export default {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseInventory
};
