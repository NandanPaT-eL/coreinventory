// backend/src/controllers/product.controller.js
import Product from "../models/Product.model.js";

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private (Manager/Admin)
export const createProduct = async (req, res) => {
  try {
    // Check if product with same SKU already exists
    const existingProduct = await Product.findOne({ 
      sku: req.body.sku.toUpperCase() 
    });
    
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this SKU already exists"
      });
    }

    // Calculate current stock from warehouse stock if provided
    let currentStock = 0;
    if (req.body.warehouseStock && req.body.warehouseStock.length > 0) {
      currentStock = req.body.warehouseStock.reduce((sum, ws) => sum + (ws.quantity || 0), 0);
    } else {
      currentStock = req.body.initialStock || 0;
    }

    const productData = {
      ...req.body,
      sku: req.body.sku.toUpperCase(),
      currentStock,
      createdBy: req.user.id
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message
    });
  }
};

// @desc    Get all products with filters
// @route   GET /api/v1/products
// @access  Private
export const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category,
      search,
      isActive,
      lowStock,
      outOfStock,
      warehouseId
    } = req.query;

    // Build filter
    const filter = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (category) {
      filter.category = new RegExp(category, 'i');
    }

    // Search by name or SKU
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { sku: new RegExp(search, 'i') }
      ];
    }

    // Filter by warehouse
    if (warehouseId) {
      filter['warehouseStock.warehouseId'] = warehouseId;
    }

    // Stock status filters
    if (lowStock === 'true') {
      filter.$expr = { $lte: [ "$currentStock", "$reorderPoint" ] };
    }
    
    if (outOfStock === 'true') {
      filter.currentStock = 0;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(filter)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .populate("warehouseStock.warehouseId", "name code")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    // Add virtual fields to each product
    const productsWithVirtuals = products.map(product => {
      const prod = product.toJSON();
      prod.isLowStock = product.isLowStock;
      prod.isOutOfStock = product.isOutOfStock;
      return prod;
    });

    res.json({
      success: true,
      data: productsWithVirtuals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
// @access  Private
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .populate("warehouseStock.warehouseId", "name code location");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const productWithVirtuals = product.toJSON();
    productWithVirtuals.isLowStock = product.isLowStock;
    productWithVirtuals.isOutOfStock = product.isOutOfStock;

    res.json({
      success: true,
      data: productWithVirtuals
    });
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private (Manager/Admin)
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check SKU uniqueness if SKU is being updated
    if (req.body.sku && req.body.sku.toUpperCase() !== product.sku) {
      const existingProduct = await Product.findOne({ 
        sku: req.body.sku.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Product with this SKU already exists"
        });
      }
    }

    // Recalculate current stock if warehouse stock changed
    let currentStock = product.currentStock;
    if (req.body.warehouseStock) {
      currentStock = req.body.warehouseStock.reduce((sum, ws) => sum + (ws.quantity || 0), 0);
    }

    const updateData = {
      ...req.body,
      currentStock,
      updatedBy: req.user.id
    };

    if (req.body.sku) {
      updateData.sku = req.body.sku.toUpperCase();
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("createdBy", "name email")
     .populate("updatedBy", "name email")
     .populate("warehouseStock.warehouseId", "name code");

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message
    });
  }
};

// @desc    Soft delete product
// @route   DELETE /api/v1/products/:id
// @access  Private (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product.isActive = false;
    product.updatedBy = req.user.id;
    await product.save();

    res.json({
      success: true,
      message: "Product deactivated successfully"
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message
    });
  }
};

// @desc    Get product stock by warehouse
// @route   GET /api/v1/products/:id/stock
// @access  Private
export const getProductStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select("name sku currentStock warehouseStock")
      .populate("warehouseStock.warehouseId", "name code location");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      data: {
        productId: product._id,
        name: product.name,
        sku: product.sku,
        totalStock: product.currentStock,
        warehouseBreakdown: product.warehouseStock.map(ws => ({
          warehouse: ws.warehouseId,
          quantity: ws.quantity,
          location: ws.location
        }))
      }
    });
  } catch (error) {
    console.error("Get product stock error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product stock",
      error: error.message
    });
  }
};

// @desc    Activate product
// @route   PATCH /api/v1/products/:id/activate
// @access  Private (Admin only)
export const activateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product.isActive = true;
    product.updatedBy = req.user.id;
    await product.save();

    res.json({
      success: true,
      message: "Product activated successfully"
    });
  } catch (error) {
    console.error("Activate product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to activate product",
      error: error.message
    });
  }
};
